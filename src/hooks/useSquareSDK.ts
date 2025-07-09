
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

      console.log('🎯 Creating Square card instance with enhanced styling...');
      
      // Enhanced Square card styling for professional appearance
      const cardInstance = await paymentsInstance.card({
        style: {
          input: {
            fontSize: '16px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#1f2937',
            lineHeight: '1.5',
            padding: '16px',
            '::placeholder': {
              color: '#9ca3af',
              fontWeight: '400'
            }
          },
          '.input-container': {
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease'
          },
          '.input-container.is-focus': {
            border: '2px solid #3b82f6',
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)'
          },
          '.input-container.is-error': {
            border: '2px solid #ef4444',
            boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.1)'
          },
          '.message-text': {
            color: '#ef4444',
            fontSize: '14px',
            fontWeight: '500',
            marginTop: '8px'
          }
        }
      });
      
      console.log('🎨 Card instance created, attaching to container...');
      
      // Clear container and attach with enhanced error handling
      if (cardRef.current) {
        cardRef.current.innerHTML = '';
        await cardInstance.attach(cardRef.current);
        console.log('✅ Square card form attached successfully with professional styling!');
        
        // Add event listeners for better UX
        cardInstance.addEventListener('cardBrandChanged', (event: any) => {
          console.log('Card brand detected:', event.cardBrand);
        });
        
        cardInstance.addEventListener('postalCodeChanged', (event: any) => {
          console.log('Postal code changed:', event.postalCodeValue ? 'entered' : 'cleared');
        });
      }
      
      setCard(cardInstance);
      
    } catch (error) {
      console.error(`❌ Card initialization failed (attempt ${retryCount + 1}):`, error);
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => initializeCard(paymentsInstance, retryCount + 1), (retryCount + 1) * 1000);
      } else {
        console.error('💥 Max retries reached, card initialization failed');
        setSdkStatus('error');
        toast({
          title: "Payment System Error",
          description: "Unable to initialize secure payment form. Please refresh the page.",
          variant: "destructive",
        });
        throw error;
      }
    }
  };

  // Initialize Square Web Payments SDK with enhanced configuration
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    let initializationTimeout: NodeJS.Timeout;

    const initializeSquare = async () => {
      console.log(`🚀 Initializing Square SDK (attempt ${retryCount + 1}/${maxRetries})`);
      setSdkStatus('loading');
      
      if (!checkSecureConnection()) {
        console.error('🔒 Secure connection required for Square payments');
        setSdkStatus('error');
        toast({
          title: "Secure Connection Required",
          description: "HTTPS is required for payment processing.",
          variant: "destructive",
        });
        return;
      }
      
      if (!window.Square) {
        console.log('⏳ Square SDK not loaded, waiting...');
        if (retryCount < maxRetries) {
          retryCount++;
          initializationTimeout = setTimeout(initializeSquare, 1000);
          return;
        } else {
          console.error('💥 Square SDK failed to load after retries');
          setSdkStatus('error');
          toast({
            title: "Payment System Unavailable",
            description: "Square payment system could not be loaded. Please refresh the page.",
            variant: "destructive",
          });
          return;
        }
      }

      if (!squareAppId || !squareLocationId) {
        console.error('⚠️ Square credentials missing:', { 
          squareAppId: !!squareAppId, 
          squareLocationId: !!squareLocationId 
        });
        setSdkStatus('error');
        toast({
          title: "Configuration Error",
          description: "Square payment configuration is incomplete.",
          variant: "destructive",
        });
        return;
      }

      try {
        console.log('🏗️ Creating Square payments instance with enhanced configuration...');
        
        const paymentsInstance = window.Square.payments(
          squareAppId, 
          squareLocationId, 
          squareEnvironment || 'sandbox'
        );
        
        setPayments(paymentsInstance);
        console.log('✅ Square payments instance created successfully');
        setSdkStatus('ready');

        // Initialize card with delay to ensure DOM is ready
        setTimeout(() => {
          initializeCard(paymentsInstance);
        }, 300);
        
      } catch (error) {
        console.error('💥 Failed to initialize Square SDK:', error);
        setSdkStatus('error');
        
        toast({
          title: "Payment System Error",
          description: "Failed to initialize secure payment system. Please refresh and try again.",
          variant: "destructive",
        });
      }
    };

    if (squareAppId && squareLocationId) {
      console.log('🎬 Starting Square initialization with professional configuration...');
      // Small delay to ensure proper DOM state
      initializationTimeout = setTimeout(initializeSquare, 200);
    } else {
      console.log('⚠️ Square credentials not provided, skipping initialization');
      setSdkStatus('error');
    }

    return () => {
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
      
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
