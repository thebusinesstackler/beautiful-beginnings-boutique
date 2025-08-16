import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import type { SDKStatus } from '@/types/SquareCheckout';

interface UseSquareSDKProps {
  squareAppId?: string;
  squareLocationId?: string;
  squareEnvironment?: string;
}

const PROJECT_REF = 'ibdjzzgvxlscmwlbuewd'; // Your Supabase project ref
const FUNCTION_URL = `https://${PROJECT_REF}.functions.supabase.co/square-payments`;

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
    const secure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
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

/** Fetch Square config from Supabase */
  const fetchSquareConfig = async () => {
    console.log('Fetching Square configuration...');
    
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test_connection' }),
    });

    console.log('Square config response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      console.error('Square config fetch failed:', res.status, errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Square config response:', { success: data.success, hasAppId: !!data.applicationId, hasLocationId: !!data.locationId });

    if (!data.success) {
      console.error('Square config error:', data.error);
      throw new Error(data.error || 'Square configuration error');
    }

    if (!data.applicationId || !data.locationId) {
      console.error('Missing Square credentials in response:', data);
      throw new Error('Square credentials not properly configured');
    }

    return {
      appId: data.applicationId,
      locationId: data.locationId,
    };
  };

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
        console.log('Fetching Square configuration...');
        const config = await fetchSquareConfig();
        if (!mounted) return;
        
        console.log('Square config loaded:', { appId: config.appId?.substring(0, 10) + '...', locationId: config.locationId });
        setSquareConfig(config);

        if (!window.Square) {
          console.error('Square SDK not loaded on window object');
          throw new Error('Square SDK not loaded');
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
            description: err.message || 'Failed to initialize payment system',
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
