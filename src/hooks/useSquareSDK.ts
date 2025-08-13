
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
  const [squareConfig, setSquareConfig] = useState<{ appId: string; locationId: string; environment: string } | null>(null);
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
      if (!cardRef.current) {
        if (retryCount < maxRetries) {
          setTimeout(() => initializeCard(paymentsInstance, retryCount + 1), 500);
          return;
        } else {
          throw new Error('Card container not available after retries');
        }
      }
      
      // Use minimal Square-approved styling with correct font family format
      const cardInstance = await paymentsInstance.card({
        style: {
          input: {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif' // Use simple font family that Square accepts
          }
        }
      });
      
      // Clear container and attach
      if (cardRef.current) {
        cardRef.current.innerHTML = '';
        await cardInstance.attach(cardRef.current);
      }
      
      setCard(cardInstance);
      
    } catch (error) {
      if (retryCount < maxRetries) {
        setTimeout(() => initializeCard(paymentsInstance, retryCount + 1), (retryCount + 1) * 1000);
      } else {
        throw error;
      }
    }
  };

  // Fetch Square configuration from edge function
  const fetchSquareConfig = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('square-payments', {
        body: { action: 'test_connection' }
      });

      if (error) {
        throw new Error('Failed to fetch Square configuration');
      }

      if (!data.success) {
        throw new Error(data.error || 'Square configuration error');
      }

      return {
        appId: data.applicationId,
        locationId: data.locationId,
        environment: data.environment || 'production'
      };
    } catch (error: any) {
      throw error;
    }
  };

  // Initialize Square Web Payments SDK
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;

    const initializeSquare = async () => {
      setSdkStatus('loading');
      
      if (!checkSecureConnection()) {
        setSdkStatus('error');
        return;
      }

      try {
        // First fetch Square configuration
        const config = await fetchSquareConfig();
        setSquareConfig(config);
        
        // Check if Square SDK is loaded
        if (!window.Square) {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(initializeSquare, 1000);
            return;
          } else {
            setSdkStatus('error');
            return;
          }
        }
        
        const paymentsInstance = window.Square.payments(config.appId, config.locationId, config.environment);
        
        setPayments(paymentsInstance);
        setSdkStatus('ready');

        // Wait for DOM to be ready before initializing card
        setTimeout(() => {
          initializeCard(paymentsInstance);
        }, 200);
        
      } catch (error) {
        setSdkStatus('error');
        
        toast({
          title: "Payment System Error",
          description: "Failed to initialize payment system. Please refresh and try again.",
          variant: "destructive",
        });
      }
    };

    setTimeout(initializeSquare, 100);

    return () => {
      if (card) {
        try {
          card.destroy();
        } catch (error) {
          // Silent cleanup
        }
      }
    };
  }, []);

  return {
    payments,
    card,
    sdkStatus,
    isSecureConnection,
    cardRef,
    squareEnvironment: squareConfig?.environment || 'production'
  };
};
