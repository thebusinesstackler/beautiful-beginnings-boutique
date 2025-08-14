
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
      
      console.log('Calling square-payments function for configuration...');
      const { data, error } = await supabase.functions.invoke('square-payments', {
        body: { action: 'test_connection' }
      });

      console.log('Square function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to fetch Square configuration: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data received from Square configuration function');
      }

      if (!data.success) {
        console.error('Square configuration error:', data.error);
        throw new Error(data.error || 'Square configuration error');
      }

      console.log('Square configuration received successfully:', {
        hasAppId: !!data.applicationId,
        hasLocationId: !!data.locationId,
        environment: data.environment
      });

      return {
        appId: data.applicationId,
        locationId: data.locationId,
        environment: 'production' // Production only
      };
    } catch (error: any) {
      console.error('fetchSquareConfig error:', error);
      throw error;
    }
  };

  // Initialize Square Web Payments SDK
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    let mounted = true;

    const initializeSquare = async () => {
      if (!mounted) return;
      
      setSdkStatus('loading');
      
      if (!checkSecureConnection()) {
        console.error('Secure connection check failed');
        if (mounted) setSdkStatus('error');
        return;
      }

      try {
        // First fetch Square configuration
        console.log('Fetching Square configuration...');
        const config = await fetchSquareConfig();
        console.log('Square config received:', config);
        if (mounted) setSquareConfig(config);
        
        // Check if Square SDK is loaded with more patience
        if (!window.Square) {
          console.warn(`Square SDK not loaded, retry ${retryCount + 1}/${maxRetries}`);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(() => {
              if (mounted) initializeSquare();
            }, 2000); // Increase timeout to 2 seconds
            return;
          } else {
            console.error('Square SDK failed to load after max retries');
            if (mounted) setSdkStatus('error');
            return;
          }
        }
        
        console.log('Square SDK detected, version:', window.Square?.version || 'unknown');
        console.log('Initializing Square payments with config:', config);
        
        const paymentsInstance = window.Square.payments(config.appId, config.locationId);
        console.log('Square payments instance created successfully');
        
        if (mounted) {
          setPayments(paymentsInstance);
          setSdkStatus('ready');

          // Wait for DOM to be ready before initializing card
          setTimeout(() => {
            if (mounted) initializeCard(paymentsInstance);
          }, 500); // Increase timeout to 500ms
        }
        
      } catch (error) {
        console.error('Square SDK initialization error:', error);
        if (mounted) setSdkStatus('error');
        
        toast({
          title: "Payment System Error",
          description: `Failed to initialize payment system: ${error.message}`,
          variant: "destructive",
        });
      }
    };

    // Start initialization after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(initializeSquare, 500);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
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
