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
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const EmbeddedSquareCheckout = ({
  customerInfo,
  shippingAddress,
  billingAddress,
  sameAsShipping,
  onSuccess,
  onError
}: EmbeddedSquareCheckoutProps) => {
  const { items, getCartTotal, clearCart } = useCart();
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize Square Web Payments SDK
  useEffect(() => {
    const initializeSquare = async () => {
      if (!window.Square) {
        console.error('Square SDK not loaded');
        return;
      }

      if (!settings.square_app_id) {
        console.error('Square App ID not configured');
        return;
      }

      try {
        const paymentsInstance = window.Square.payments(settings.square_app_id, settings.square_location_id);
        setPayments(paymentsInstance);

        // Initialize card payment method
        const cardInstance = await paymentsInstance.card();
        await cardInstance.attach(cardRef.current);
        setCard(cardInstance);

        console.log('Square Web Payments SDK initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Square Web Payments SDK:', error);
        toast({
          title: "Payment Initialization Error",
          description: "Failed to initialize payment system. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (settings.square_app_id && settings.square_location_id) {
      initializeSquare();
    }
  }, [settings.square_app_id, settings.square_location_id]);

  const handlePayment = async () => {
    if (!card || !payments) {
      toast({
        title: "Payment Error",
        description: "Payment system not initialized. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    // Validate customer information
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required customer information.",
        variant: "destructive",
      });
      return;
    }

    // Validate shipping address
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast({
        title: "Missing Address",
        description: "Please fill in all required shipping address fields.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Tokenize the card
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
          amount: Math.round(getCartTotal() * 100), // Convert to cents
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
          console.log('Payment successful:', data);
          
          // Clear cart on successful payment
          clearCart();
          
          toast({
            title: "Payment Successful!",
            description: `Order #${data.orderId} has been processed successfully.`,
          });

          onSuccess?.();
        } else {
          throw new Error(data.error || 'Payment failed');
        }
      } else {
        console.error('Tokenization failed:', tokenResult.errors);
        throw new Error('Card tokenization failed. Please check your card details.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      let errorMessage = "Payment processing failed. Please try again.";
      if (error.message.includes('card')) {
        errorMessage = "Card information is invalid. Please check your card details.";
      } else if (error.message.includes('amount')) {
        errorMessage = "Payment amount is invalid. Please try again.";
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
      {/* Card Input Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-sage/10 p-6">
        <h3 className="text-lg font-semibold text-charcoal mb-4">Payment Information</h3>
        <div 
          ref={cardRef} 
          id="card-container"
          className="min-h-[60px] p-4 border border-stone/20 rounded-lg bg-white"
        />
      </div>

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={isLoading || !card}
        className="w-full bg-sage hover:bg-forest text-white text-lg font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Processing Payment...
          </>
        ) : (
          `Pay $${getCartTotal().toFixed(2)}`
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