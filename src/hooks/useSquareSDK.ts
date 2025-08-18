import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { SDKStatus } from '@/types/SquareCheckout';

interface UseSquareSDKProps {
  squareAppId?: string;
  squareLocationId?: string;
  squareEnvironment?: string;
}


// Global flag to track SDK loading state
let squareSDKLoading = false;
let squareSDKLoaded = false;

const loadSquareSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (squareSDKLoaded && window.Square) {
      resolve();
      return;
    }

    // If currently loading, wait for it
    if (squareSDKLoading) {
      const checkLoaded = () => {
        if (squareSDKLoaded && window.Square) {
          resolve();
        } else {
          setTimeout(checkLoaded, 50);
        }
      };
      checkLoaded();
      return;
    }

    // Check if Square SDK script already exists
    const existingScript = document.querySelector('script[src*="square"]');
    if (existingScript) {
      // Script tag exists, wait for window.Square to be available
      const checkSquare = () => {
        if (window.Square) {
          squareSDKLoaded = true;
          resolve();
        } else {
          setTimeout(checkSquare, 50);
        }
      };
      checkSquare();
      return;
    }

    // Load the SDK script dynamically if not found
    squareSDKLoading = true;
    const script = document.createElement('script');
    script.src = 'https://web.squarecdn.com/v1/square.js'; // Use production URL
    script.async = true;
    
    script.onload = () => {
      squareSDKLoading = false;
      squareSDKLoaded = true;
      resolve();
    };
    
    script.onerror = () => {
      squareSDKLoading = false;
      reject(new Error('Failed to load Square SDK'));
    };
    
    document.head.appendChild(script);
  });
};

export const useSquareSDK = ({ squareAppId, squareLocationId, squareEnvironment }: UseSquareSDKProps) => {
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [sdkStatus, setSdkStatus] = useState<SDKStatus>('loading');
  const [isSecureConnection, setIsSecureConnection] = useState<boolean>(false);
  const [squareConfig, setSquareConfig] = useState<{ appId: string; locationId: string; environment?: string } | null>(null);

  // This ref is passed to SquareCardForm
  const cardRef = useRef<HTMLDivElement>(null);

  /** Check HTTPS or localhost */
  const checkSecureConnection = () => {
    // Allow HTTPS everywhere, HTTP only on localhost/development
    const isLocalDev = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.includes('lovable.app');
    
    const secure = window.location.protocol === 'https:' || isLocalDev;
    setIsSecureConnection(secure);
    return secure;
  };

  /** Attach the card element with retry logic */
  const initializeCard = async (paymentsInstance: any, retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      // Wait for DOM to be ready
      await new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve(void 0);
        } else {
          window.addEventListener('load', () => resolve(void 0), { once: true });
        }
      });

      // Additional delay to ensure container is rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!cardRef.current) {
        if (retryCount < maxRetries) {
          console.log(`Card container not found, retrying... (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => initializeCard(paymentsInstance, retryCount + 1), 500);
          return;
        }
        throw new Error('Card container not found after retries');
      }

      console.log('Creating Square card instance...');
      const cardInstance = await paymentsInstance.card({
        style: {
          input: {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
          },
        },
      });

      console.log('Attaching card to DOM...');
      cardRef.current.innerHTML = '';
      await cardInstance.attach(cardRef.current);
      setCard(cardInstance);
      console.log('Square card initialized successfully');
    } catch (err) {
      console.error('Error initializing card:', err);
      if (retryCount < maxRetries) {
        console.log(`Retrying card initialization... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => initializeCard(paymentsInstance, retryCount + 1), 1000);
      } else {
        throw err;
      }
    }
  };

  /** Fetch Square config from Supabase using proper client with retry logic */
  const fetchSquareConfig = useCallback(async () => {
    console.log('🔍 Fetching Square configuration via Supabase client...');
    
    const maxRetries = 3;
    let retryCount = 0;
    
    const attemptFetch = async (): Promise<{ appId: string; locationId: string }> => {
      try {
        const { data, error } = await supabase.functions.invoke('square-payments', {
          body: { action: 'test_connection' }
        });
        
        console.log('📊 Square config response:', { data, error });
        
        if (error) {
          console.error('❌ Supabase function error:', error);
          
          // Check if it's a network error that we should retry
          if (error.message?.includes('Failed to fetch') || 
              error.message?.includes('network') || 
              error.message?.includes('timeout')) {
            
            if (retryCount < maxRetries) {
              retryCount++;
              const delay = Math.pow(2, retryCount - 1) * 1000; // Exponential backoff: 1s, 2s, 4s
              console.log(`⏳ Network error, retrying in ${delay}ms... (attempt ${retryCount}/${maxRetries})`);
              await new Promise(resolve => setTimeout(resolve, delay));
              return attemptFetch();
            }
          }
          
          // Try to get more detailed error information
          let errorMessage = error.message;
          if (error.context?.response) {
            try {
              const responseText = await error.context.response.text();
              console.error('❌ Function response body:', responseText);
              errorMessage += `: ${responseText}`;
            } catch (e) {
              console.error('❌ Could not read error response:', e);
            }
          }
          
          throw new Error(`Function invocation failed: ${errorMessage}`);
        }
        
        if (!data?.success) {
          console.error('❌ Square config failed:', data);
          throw new Error(data?.error || 'Square configuration failed');
        }
        
        if (!data.applicationId || !data.locationId) {
          console.error('❌ Missing Square credentials in response:', data);
          throw new Error('Square credentials not properly configured');
        }
        
        console.log('✅ Square config success:', {
          applicationId: data.applicationId?.substring(0, 10) + '...',
          locationId: data.locationId?.substring(0, 10) + '...',
          environment: data.environment
        });
        
        return {
          appId: data.applicationId,
          locationId: data.locationId,
        };
      } catch (error) {
        // If it's a network error and we haven't exhausted retries
        if (retryCount < maxRetries && 
            (error.message?.includes('Failed to fetch') || 
             error.message?.includes('network') || 
             error.message?.includes('timeout'))) {
          
          retryCount++;
          const delay = Math.pow(2, retryCount - 1) * 1000;
          console.log(`⏳ Network error, retrying in ${delay}ms... (attempt ${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptFetch();
        }
        
        console.error('💥 Failed to fetch Square config:', error);
        throw error;
      }
    };
    
    return attemptFetch();
  }, []);

  /** Initialize Square SDK */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      console.log('Initializing Square SDK...');
      setSdkStatus('loading');

      if (!checkSecureConnection()) {
        console.error('Insecure connection detected');
        setSdkStatus('error');
        return;
      }

      try {
        // First, ensure Square SDK is loaded
        console.log('Loading Square SDK...');
        await loadSquareSDK();
        if (!mounted) return;

        console.log('Square SDK loaded successfully');

        // Fetch Square configuration from Supabase
        console.log('Fetching Square configuration...');
        const config = await fetchSquareConfig();
        if (!mounted) return;
        
        console.log('Square config loaded:', { appId: config.appId?.substring(0, 10) + '...', locationId: config.locationId });
        setSquareConfig(config);

        // Verify Square SDK is available
        if (!window.Square) {
          throw new Error('Square SDK failed to load properly');
        }

        console.log('Creating Square payments instance...');
        const paymentsInstance = window.Square.payments(config.appId, config.locationId);
        setPayments(paymentsInstance);
        setSdkStatus('ready');
        
        console.log('Square SDK initialized successfully, initializing card...');
        // Initialize card with proper DOM readiness check
        initializeCard(paymentsInstance);
      } catch (err: any) {
        console.error('Square SDK initialization failed:', err);
        if (mounted) {
          setSdkStatus('error');
          toast({
            title: 'Payment System Error',
            description: err.message || 'Unable to initialize the payment system. This could be due to:\n\n• Network connectivity issues\n• Square service temporarily unavailable\n• Invalid payment configuration\n\nPlease try refreshing the page or contact support if the issue persists.',
            variant: 'destructive',
          });
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (card) {
        try {
          card.destroy();
        } catch {}
      }
    };
  }, []);

  /** Return Square SDK state and methods */
  return {
    payments,
    card,
    sdkStatus,
    isSecureConnection,
    cardRef,
    squareEnvironment: 'production',
  };
};
