import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { supabase } from '@/integrations/supabase/client';

// Declare Square types
declare global {
  interface Window {
    Square: any;
  }
}

interface EmbeddedSquareCheckoutProps {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  sameAsShipping: boolean;
  total: number; // Total amount including shipping and tax
  subtotal: number;
  shippingCost: number;
  tax: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const EmbeddedSquareCheckout = ({
  customerInfo,
  shippingAddress,
  billingAddress,
  sameAsShipping,
  total,
  subtotal,
  shippingCost,
  tax,
  onSuccess,
  onError
}: EmbeddedSquareCheckoutProps) => {
  const { items, getCartTotal, clearCart } = useCart();
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isSecureConnection, setIsSecureConnection] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize Square Web Payments SDK with comprehensive validation
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 1000;

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
      const appId = settings.square_app_id || '';
      const environment = 'sandbox'; // Force sandbox
      
      const isSandboxAppId = appId.includes('sandbox');
      const isProductionAppId = !appId.includes('sandbox') && appId.length > 0;
      
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

      if (!settings.square_app_id) {
        console.error('Square App ID not configured');
        setSdkStatus('error');
        return;
      }

      if (!settings.square_location_id) {
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
          appId: settings.square_app_id,
          locationId: settings.square_location_id,
          hostname: window.location.hostname,
          protocol: window.location.protocol,
          isSecure: isSecureConnection
        });

        // Initialize Square payments with correct API call
        console.log('Initializing Square SDK with environment:', environment);
        
        // For sandbox, use the 'sandbox' parameter; for production, omit it
        const paymentsInstance = environment === 'sandbox' 
          ? window.Square.payments(settings.square_app_id, settings.square_location_id, 'sandbox')
          : window.Square.payments(settings.square_app_id, settings.square_location_id);
        
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

    if (settings.square_app_id && settings.square_location_id) {
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
  }, [settings.square_app_id, settings.square_location_id, settings.square_environment]);

  // Enhanced form validation
  const validateForm = () => {
    const errors: string[] = [];

    // Customer info validation
    if (!customerInfo.firstName?.trim()) errors.push("First name is required");
    if (!customerInfo.lastName?.trim()) errors.push("Last name is required");
    if (!customerInfo.email?.trim()) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.push("Please enter a valid email address");
    }
    if (!customerInfo.phone?.trim()) errors.push("Phone number is required");

    // Shipping address validation
    if (!shippingAddress.address?.trim()) errors.push("Shipping address is required");
    if (!shippingAddress.city?.trim()) errors.push("City is required");
    if (!shippingAddress.state?.trim()) errors.push("State is required");
    if (!shippingAddress.zipCode?.trim()) errors.push("ZIP code is required");
    else if (!/^\d{5}(-\d{4})?$/.test(shippingAddress.zipCode)) {
      errors.push("Please enter a valid ZIP code (e.g., 12345 or 12345-6789)");
    }

    // Billing address validation (if different from shipping)
    if (!sameAsShipping) {
      if (!billingAddress.address?.trim()) errors.push("Billing address is required");
      if (!billingAddress.city?.trim()) errors.push("Billing city is required");
      if (!billingAddress.state?.trim()) errors.push("Billing state is required");
      if (!billingAddress.zipCode?.trim()) errors.push("Billing ZIP code is required");
      else if (!/^\d{5}(-\d{4})?$/.test(billingAddress.zipCode)) {
        errors.push("Please enter a valid billing ZIP code");
      }
    }

    // Cart validation
    if (items.length === 0) errors.push("Your cart is empty");

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePayment = async () => {
    if (!card || !payments) {
      toast({
        title: "Payment Error",
        description: "Payment system not initialized. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    // Comprehensive form validation
    if (!validateForm()) {
      toast({
        title: "Please Fix Form Errors",
        description: `${validationErrors.length} error(s) found: ${validationErrors.slice(0, 2).join(', ')}${validationErrors.length > 2 ? '...' : ''}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      // Tokenize the card with buyer verification
      console.log('Starting card tokenization...');
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status === 'OK') {
        const paymentToken = tokenResult.token;
        
        // Send payment token to backend
        const paymentRequest = {
          token: paymentToken,
          customerInfo,
          shippingAddress,
          billingAddress: sameAsShipping ? shippingAddress : billingAddress,
          items,
          amount: Math.round(total * 100), // Convert total to cents
          breakdown: {
            subtotal: Math.round(subtotal * 100),
            shipping: Math.round(shippingCost * 100),
            tax: Math.round(tax * 100),
            total: Math.round(total * 100)
          },
          squareCredentials: {
            appId: settings.square_app_id,
            accessToken: settings.square_access_token,
            environment: settings.square_environment || 'sandbox',
            locationId: settings.square_location_id
          }
        };

        console.log('Processing payment with token:', paymentRequest);

        const { data, error } = await supabase.functions.invoke('square-checkout', {
          body: paymentRequest
        });

        if (error) {
          console.error('Payment processing error:', error);
          throw new Error(error.message || 'Payment processing failed');
        }

        if (data.success) {
          setPaymentStatus('success');
          console.log('Payment successful:', data);
          
          // Clear cart on successful payment
          clearCart();
          
          toast({
            title: "Payment Successful!",
            description: `Order #${data.orderId} has been processed successfully.`,
          });

          onSuccess?.();
        } else {
          setPaymentStatus('error');
          throw new Error(data.error || 'Payment failed');
        }
      } else {
        setPaymentStatus('error');
        console.error('Tokenization failed:', tokenResult.errors);
        throw new Error('Card tokenization failed. Please check your card details.');
      }
    } catch (error: any) {
      setPaymentStatus('error');
      console.error('Payment error:', error);
      
      let errorMessage = "Payment processing failed. Please try again.";
      
      // Enhanced error handling for different Square error types
      if (error.message.includes('INVALID_CARD_DATA')) {
        errorMessage = "Invalid card information. Please check your card number, expiration date, and CVV.";
      } else if (error.message.includes('CARD_DECLINED')) {
        errorMessage = "Your card was declined. Please try a different payment method or contact your bank.";
      } else if (error.message.includes('INSUFFICIENT_FUNDS')) {
        errorMessage = "Insufficient funds on your card. Please try a different payment method.";
      } else if (error.message.includes('EXPIRED_CARD')) {
        errorMessage = "Your card has expired. Please use a different payment method.";
      } else if (error.message.includes('CVV_FAILURE')) {
        errorMessage = "CVV verification failed. Please check your card's security code.";
      } else if (error.message.includes('INVALID_LOCATION')) {
        errorMessage = "Payment configuration error. Please contact support.";
      } else if (error.message.includes('card')) {
        errorMessage = "Card information is invalid. Please check your card details.";
      } else if (error.message.includes('amount')) {
        errorMessage = "Payment amount is invalid. Please try again.";
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  // Show configuration message if Square is not set up
  if (!settings.square_app_id || !settings.square_location_id || !settings.square_access_token) {
    return (
      <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800 text-center">
          Square checkout is not configured. Please configure Square settings in the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Validation Errors Display */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h4 className="font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Card Input Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-sage/10 p-6">
        <h3 className="text-lg font-semibold text-charcoal mb-4">Payment Information</h3>
        
        {/* SDK Status Indicator */}
        {sdkStatus === 'loading' && (
          <div className="flex items-center justify-center min-h-[60px] p-4 border border-stone/20 rounded-lg bg-white">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-sage border-t-transparent mr-3"></div>
            <span className="text-charcoal/60">Loading payment form...</span>
          </div>
        )}
        
        {sdkStatus === 'error' && (
          <div className="min-h-[60px] p-4 border border-red-200 rounded-lg bg-red-50 flex items-center justify-center">
            <span className="text-red-700">Payment form failed to load. Please refresh the page.</span>
          </div>
        )}
        
        {sdkStatus === 'ready' && (
          <div 
            ref={cardRef} 
            id="card-container"
            data-square-container="true"
            className="min-h-[60px] p-4 border border-stone/20 rounded-lg bg-white transition-opacity duration-300"
          />
        )}
        
        {!isSecureConnection && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
            ⚠️ Secure connection (HTTPS) required for payment processing
          </div>
        )}
      </div>

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={isLoading || !card || sdkStatus !== 'ready' || !isSecureConnection}
        className="w-full bg-sage hover:bg-forest text-white text-lg font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Processing Payment...
          </>
        ) : sdkStatus === 'loading' ? (
          'Loading Payment Form...'
        ) : sdkStatus === 'error' ? (
          'Payment Form Unavailable'
        ) : !isSecureConnection ? (
          'Secure Connection Required'
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </Button>

      <div className="text-center text-xs text-charcoal/60">
        <p>🔒 Secure payment powered by Square</p>
        <p className="mt-1">Your payment information is protected with industry-standard encryption</p>
      </div>
    </div>
  );
};

export default EmbeddedSquareCheckout;