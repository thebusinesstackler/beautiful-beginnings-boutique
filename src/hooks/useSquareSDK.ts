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
  const [squareConfig, setSquareConfig] = useState<{ appId: string; locationId: string; environment: string } | null>(null);

  // This ref is passed to SquareCardForm
  const cardRef = useRef<HTMLDivElement>(null);

  /** Check HTTPS or localhost */
  const checkSecureConnection = () => {
    const secure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    setIsSecureConnection(secure);
    return secure;
  };

  /** Attach the card element */
  const initializeCard = async (paymentsInstance: any) => {
    try {
      if (!cardRef.current) throw new Error('Card container not found');

      const cardInstance = await paymentsInstance.card({
        style: {
          input: {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
          },
        },
      });

      cardRef.current.innerHTML = '';
      await cardInstance.attach(cardRef.current);
      setCard(cardInstance);
    } catch (err) {
      console.error('Error initializing card:', err);
      throw err;
    }
  };

  /** Fetch Square config from Supabase */
  const fetchSquareConfig = async () => {
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test_connection' }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.success) throw new Error(data.error || 'Square configuration error');

    return {
      appId: data.applicationId,
      locationId: data.locationId,
      environment: 'production',
    };
  };

  /** Initialize Square SDK */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setSdkStatus('loading');

      if (!checkSecureConnection()) {
        setSdkStatus('error');
        return;
      }

      try {
        const config = await fetchSquareConfig();
        if (!mounted) return;
        setSquareConfig(config);

        if (!window.Square) throw new Error('Square SDK not loaded');

        const paymentsInstance = window.Square.payments(config.appId, config.locationId);
        setPayments(paymentsInstance);
        setSdkStatus('ready');

        setTimeout(() => initializeCard(paymentsInstance), 500);
      } catch (err: any) {
        if (mounted) {
          setSdkStatus('error');
          toast({
            title: 'Payment System Error',
            description: err.message,
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

  /** ✅ Return matches SquareCardForm expected props */
  return {
    payments,
    card,
    sdkStatus,
    isSecureConnection,
    cardRef,
    squareEnvironment: squareConfig?.environment || 'production',
  };
};
