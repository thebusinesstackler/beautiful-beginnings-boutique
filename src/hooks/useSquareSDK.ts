
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
      console.log(`Initializing card (attempt ${retryCount + 1}/${maxRetries + 1})`);
      
      if (!cardRef.current) {
        if (retryCount < maxRetries) {
          console.log('Card container not ready, retrying...');
          setTimeout(() => initializeCard(paymentsInstance, retryCount + 1), 500);
          return;
        } else {
          throw new Error('Card container not available');
        }
      }

      console.log('Creating card instance...');
      const cardInstance = await paymentsInstance.card({
        style: {
          input: {
            fontSize: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#2d3436',
            backgroundColor: '#ffffff',
            padding: '12px'
          },
          '.input-container': {
            borderRadius: '8px',
            border: '1px solid #d1d5db'
          },
          '.input-container.is-focus': {
            borderColor: '#8fa68e'
          },
          '.input-container.is-error': {
            borderColor: '#ef4444'
          }
        }
      });
      
      console.log('Card instance created, attaching to DOM...');
      
      if (cardRef.current) {
        cardRef.current.innerHTML = '';
        console.log('Card container cleared, attempting attach...');
      }
      
      await cardInstance.attach(cardRef.current);
      
      setCard(cardInstance);
      console.log('Square card form attached successfully');
      
    } catch (error) {
      console.error(`Card initialization failed (attempt ${retryCount + 1}):`, error);
      if (retryCount < maxRetries) {
        setTimeout(() => initializeCard(paymentsInstance, retryCount + 1), (retryCount + 1) * 1000);
      } else {
        throw error;
      }
    }
  };

  // Initialize Square Web Payments SDK
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;

    const initializeSquare = async () => {
      console.log(`Initializing Square SDK (attempt ${retryCount + 1}/${maxRetries})`);
      setSdkStatus('loading');
      
      if (!checkSecureConnection()) {
        setSdkStatus('error');
        return;
      }
      
      if (!window.Square) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initializeSquare, 1000);
          return;
        } else {
          console.error('Square SDK failed to load');
          setSdkStatus('error');
          return;
        }
      }

      if (!squareAppId || !squareLocationId) {
        console.error('Square credentials missing');
        setSdkStatus('error');
        return;
      }

      try {
        console.log('Initializing Square payments...');
        
        const paymentsInstance = window.Square.payments(squareAppId, squareLocationId, 'sandbox');
        
        setPayments(paymentsInstance);
        console.log('Square payments instance created');
        setSdkStatus('ready');

        await initializeCard(paymentsInstance);
        
      } catch (error) {
        console.error('Failed to initialize Square SDK:', error);
        setSdkStatus('error');
        
        toast({
          title: "Payment System Error",
          description: "Failed to initialize payment system. Please refresh and try again.",
          variant: "destructive",
        });
      }
    };

    if (squareAppId && squareLocationId) {
      setTimeout(initializeSquare, 500);
    }

    return () => {
      if (card) {
        try {
          card.destroy();
        } catch (error) {
          console.log('Error destroying card:', error);
        }
      }
    };
  }, [squareAppId, squareLocationId]);

  return {
    payments,
    card,
    sdkStatus,
    isSecureConnection,
    cardRef
  };
};
