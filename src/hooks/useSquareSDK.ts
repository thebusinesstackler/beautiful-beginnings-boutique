
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import type { SDKStatus } from '@/types/SquareCheckout';

interface UseSquareSDKProps {
  squareAppId?: string;
  squareLocationId?: string;
  squareEnvironment?: string;
}

export const useSquareSDK = ({ squareAppId, squareLocationId, squareEnvironment }: UseSquareSDKProps) => {
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [sdkStatus, setSdkStatus] = useState<SDKStatus>('loading');
  const [isSecureConnection, setIsSecureConnection] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Check HTTPS connection
  const checkSecureConnection = () => {
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    setIsSecureConnection(isSecure);
    return isSecure;
  };

  const initializeCard = async (paymentsInstance: any, retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      console.log(`🔄 Initializing Square card (attempt ${retryCount + 1}/${maxRetries + 1})`);
      
      if (!cardRef.current) {
        console.log('⚠️ Card container not ready, waiting...');
        if (retryCount < maxRetries) {
          setTimeout(() => initializeCard(paymentsInstance, retryCount + 1), 500);
          return;
        } else {
          throw new Error('Card container not available after retries');
        }
      }

      console.log('🎯 Creating Square card instance with minimal styling...');
      const cardInstance = await paymentsInstance.card({
        style: {
          input: {
            fontSize: '16px'
          },
          '.input-container': {
            borderColor: '#d1d5db',
            borderRadius: '8px'
          },
          '.input-container.is-focus': {
            borderColor: '#10b981'
          },
          '.input-container.is-error': {
            borderColor: '#ef4444'
          }
        }
      });
      
      console.log('🎨 Card instance created, preparing container...');
      
      // Ensure container is clean and ready
      if (cardRef.current) {
        cardRef.current.innerHTML = '';
        console.log('🧹 Card container prepared');
      }
      
      console.log('📎 Attaching card to container...');
      await cardInstance.attach(cardRef.current);
      
      setCard(cardInstance);
      console.log('✅ Square card form attached successfully!');
      
    } catch (error) {
      console.error(`❌ Card initialization failed (attempt ${retryCount + 1}):`, error);
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => initializeCard(paymentsInstance, retryCount + 1), (retryCount + 1) * 1000);
      } else {
        console.error('💥 Max retries reached, card initialization failed');
        throw error;
      }
    }
  };

  // Initialize Square Web Payments SDK
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;

    const initializeSquare = async () => {
      console.log(`🚀 Initializing Square SDK (attempt ${retryCount + 1}/${maxRetries})`);
      setSdkStatus('loading');
      
      if (!checkSecureConnection()) {
        console.error('🔒 Secure connection required');
        setSdkStatus('error');
        return;
      }
      
      if (!window.Square) {
        console.log('⏳ Square SDK not loaded, waiting...');
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initializeSquare, 1000);
          return;
        } else {
          console.error('💥 Square SDK failed to load after retries');
          setSdkStatus('error');
          return;
        }
      }

      if (!squareAppId || !squareLocationId) {
        console.error('⚠️ Square credentials missing:', { squareAppId: !!squareAppId, squareLocationId: !!squareLocationId });
        setSdkStatus('error');
        return;
      }

      try {
        console.log('🏗️ Creating Square payments instance...');
        console.log('📋 Square config:', { 
          appId: squareAppId?.substring(0, 10) + '...', 
          locationId: squareLocationId?.substring(0, 10) + '...',
          environment: squareEnvironment 
        });
        
        const paymentsInstance = window.Square.payments(squareAppId, squareLocationId, squareEnvironment || 'sandbox');
        
        setPayments(paymentsInstance);
        console.log('✅ Square payments instance created');
        setSdkStatus('ready');

        // Wait a bit for the component to render before initializing card
        setTimeout(() => {
          initializeCard(paymentsInstance);
        }, 100);
        
      } catch (error) {
        console.error('💥 Failed to initialize Square SDK:', error);
        setSdkStatus('error');
        
        toast({
          title: "Payment System Error",
          description: "Failed to initialize payment system. Please refresh and try again.",
          variant: "destructive",
        });
      }
    };

    if (squareAppId && squareLocationId) {
      console.log('🎬 Starting Square initialization...');
      setTimeout(initializeSquare, 100); // Small delay to ensure DOM is ready
    } else {
      console.log('⚠️ Square credentials not provided, skipping initialization');
    }

    return () => {
      if (card) {
        try {
          console.log('🧹 Cleaning up Square card instance');
          card.destroy();
        } catch (error) {
          console.log('⚠️ Error destroying card:', error);
        }
      }
    };
  }, [squareAppId, squareLocationId, squareEnvironment]);

  return {
    payments,
    card,
    sdkStatus,
    isSecureConnection,
    cardRef
  };
};
