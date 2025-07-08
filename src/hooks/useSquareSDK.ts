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
    
    if (!isSecure) {
      setSdkStatus('error');
      toast({
        title: "Secure Connection Required",
        description: "Square payments require HTTPS. Please use a secure connection.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateEnvironmentCredentials = () => {
    // Validate that App ID matches environment
    const appId = squareAppId || '';
    const environment = 'sandbox'; // Force sandbox
    
    const isSandboxAppId = appId.includes('sandbox');
    
    if (environment === 'sandbox' && !isSandboxAppId) {
      console.warn('Environment mismatch: Using sandbox environment but App ID appears to be production');
      toast({
        title: "Configuration Warning",
        description: "App ID may not match sandbox environment. Please verify your Square configuration.",
        variant: "destructive",
      });
      return false;
    }
    
    // Note: Currently forcing sandbox, so production check is commented out
    // if (environment === 'production' && !isProductionAppId) {
    //   console.warn('Environment mismatch: Using production environment but App ID appears to be sandbox');
    //   return false;
    // }
    
    return true;
  };

  const initializeCard = async (paymentsInstance: any, retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      console.log(`Initializing card (attempt ${retryCount + 1}/${maxRetries + 1})`);
      
      // Ensure card container is available
      if (!cardRef.current) {
        if (retryCount < maxRetries) {
          console.log('Card container not ready, retrying in 500ms...');
          setTimeout(() => initializeCard(paymentsInstance, retryCount + 1), 500);
          return;
        } else {
          throw new Error('Card container not available after retries');
        }
      }

      // Initialize card payment method with enhanced error handling
      console.log('Creating card instance...');
      const cardInstance = await paymentsInstance.card({
        style: {
          input: {
            fontSize: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#374151',
            backgroundColor: '#ffffff',
            lineHeight: '1.5'
          },
          placeholder: {
            color: '#9CA3AF'
          }
        },
        // Add buyer verification for enhanced security
        includeInputLabels: true
      });
      
      console.log('Card instance created successfully, attaching to DOM...');
      
      // Ensure the card container is visible and ready
      if (cardRef.current) {
        cardRef.current.innerHTML = ''; // Clear any existing content
        cardRef.current.setAttribute('data-square-container', 'true'); // Add identifier
        console.log('Card container cleared, attempting attach...');
      }
      
      // Use React ref instead of DOM selector for better reliability
      await cardInstance.attach(cardRef.current);
      
      setCard(cardInstance);
      console.log('Square card form attached successfully to DOM');
      
      // Verify card form is rendered
      setTimeout(() => {
        const cardContainer = cardRef.current;
        if (cardContainer && cardContainer.children.length > 0) {
          console.log('Card form rendered successfully - children found:', cardContainer.children.length);
        } else {
          console.warn('Card form may not have rendered properly - no children found');
        }
      }, 1000);
      
    } catch (error) {
      console.error(`Card initialization failed (attempt ${retryCount + 1}):`, error);
      if (retryCount < maxRetries) {
        console.log(`Retrying card initialization in ${(retryCount + 1) * 1000}ms...`);
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
    const retryDelay = 1000;

    const initializeSquare = async () => {
      console.log(`Attempting to initialize Square SDK (attempt ${retryCount + 1}/${maxRetries})`);
      setSdkStatus('loading');
      
      // Check secure connection first
      if (!checkSecureConnection()) {
        return;
      }
      
      if (!window.Square) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Square SDK not loaded yet, retrying in ${retryDelay * retryCount}ms...`);
          setTimeout(initializeSquare, retryDelay * retryCount); // Exponential backoff
          return;
        } else {
          console.error('Square SDK failed to load after maximum retries');
          setSdkStatus('error');
          toast({
            title: "Payment System Error",
            description: "Failed to load Square SDK. Please check your internet connection and refresh the page.",
            variant: "destructive",
          });
          return;
        }
      }

      if (!squareAppId) {
        console.error('Square App ID not configured');
        setSdkStatus('error');
        return;
      }

      if (!squareLocationId) {
        console.error('Square Location ID not configured');
        setSdkStatus('error');
        return;
      }

      // Validate environment and credentials match
      if (!validateEnvironmentCredentials()) {
        setSdkStatus('error');
        return;
      }

      try {
        const environment = 'sandbox'; // Force sandbox since using sandbox SDK URL
        
        console.log('Square SDK Initialization:', {
          environment,
          appId: squareAppId,
          locationId: squareLocationId,
          hostname: window.location.hostname,
          protocol: window.location.protocol,
          isSecure: isSecureConnection
        });

        // Initialize Square payments with correct API call
        console.log('Initializing Square SDK with environment:', environment);
        
        // For sandbox, use the 'sandbox' parameter; for production, omit it
        const paymentsInstance = environment === 'sandbox' 
          ? window.Square.payments(squareAppId, squareLocationId, 'sandbox')
          : window.Square.payments(squareAppId, squareLocationId);
        
        console.log('Square payments instance created for environment:', environment);
        
        setPayments(paymentsInstance);
        console.log('Square payments instance created successfully');
        setSdkStatus('ready');

        // Wait for DOM to be ready and initialize card
        await initializeCard(paymentsInstance);
        
      } catch (error) {
        console.error('Failed to initialize Square Web Payments SDK:', error);
        setSdkStatus('error');
        
        let errorMessage = "Failed to initialize payment system";
        if (error.message?.includes('APPLICATION_ID')) {
          errorMessage = "Invalid Square Application ID. Please check your configuration.";
        } else if (error.message?.includes('LOCATION_ID')) {
          errorMessage = "Invalid Square Location ID. Please check your configuration.";
        } else if (error.message?.includes('CORS')) {
          errorMessage = "Domain not authorized for Square payments. Please contact support.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Payment Initialization Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    if (squareAppId && squareLocationId) {
      // Small delay to ensure DOM is ready
      setTimeout(initializeSquare, 100);
    }

    // Cleanup function
    return () => {
      if (card) {
        try {
          card.destroy();
        } catch (error) {
          console.log('Error destroying card instance:', error);
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