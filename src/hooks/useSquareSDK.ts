
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

      console.log('🎯 Creating Square card instance...');
      
      // Use minimal Square-approved styling with correct font family format
      const cardInstance = await paymentsInstance.card({
        style: {
          input: {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif' // Use simple font family that Square accepts
          }
        }
      });
      
      console.log('🎨 Card instance created, attaching to container...');
      
      // Clear container and attach
      if (cardRef.current) {
        cardRef.current.innerHTML = '';
        await cardInstance.attach(cardRef.current);
        console.log('✅ Square card form attached successfully!');
      }
      
      setCard(cardInstance);
      
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

  // Fetch Square configuration from edge function
  const fetchSquareConfig = async () => {
    try {
      console.log('🔄 Fetching Square configuration from edge function...');
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

      console.log('✅ Square config fetched:', { 
        appId: data.applicationId, 
        locationId: data.locationId,
        environment: data.environment 
      });

      return {
        appId: data.applicationId,
        locationId: data.locationId,
        environment: data.environment || 'production'
      };
    } catch (error: any) {
      console.error('❌ Error fetching Square config:', error);
      throw error;
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

      try {
        // First fetch Square configuration
        const config = await fetchSquareConfig();
        setSquareConfig(config);
        
        // Check if Square SDK is loaded
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

        console.log('🏗️ Creating Square payments instance with config:', config);
        
        const paymentsInstance = window.Square.payments(config.appId, config.locationId, config.environment);
        
        setPayments(paymentsInstance);
        console.log('✅ Square payments instance created');
        setSdkStatus('ready');

        // Wait for DOM to be ready before initializing card
        setTimeout(() => {
          initializeCard(paymentsInstance);
        }, 200);
        
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

    console.log('🎬 Starting Square initialization...');
    setTimeout(initializeSquare, 100);

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
