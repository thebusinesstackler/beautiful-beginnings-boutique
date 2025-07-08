
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';

interface SquareCheckoutProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const SquareCheckout = ({ onSuccess, onError }: SquareCheckoutProps) => {
  const { items, getCartTotal, clearCart } = useCart();
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [squareReady, setSquareReady] = useState(false);

  useEffect(() => {
    // Load Square Web SDK
    const script = document.createElement('script');
    script.src = 'https://sandbox-web.squarecdn.com/v1/square.js';
    script.async = true;
    script.onload = () => {
      setSquareReady(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSquareCheckout = async () => {
    if (!squareReady || !settings.square_app_id || !settings.square_location_id) {
      toast({
        title: "Configuration Error",
        description: "Square checkout is not properly configured. Please check admin settings.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Initialize Square Web SDK
      const square = (window as any).Square;
      if (!square) {
        throw new Error('Square SDK not loaded');
      }

      const payments = square.payments(settings.square_app_id, settings.square_location_id);
      
      // Create checkout request
      const checkoutRequest = {
        requestId: `checkout-${Date.now()}`,
        order: {
          locationId: settings.square_location_id,
          orderSource: 'online',
          lineItems: items.map(item => ({
            quantity: item.quantity.toString(),
            itemType: 'ITEM',
            basePriceMoney: {
              amount: Math.round(item.price * 100), // Convert to cents
              currency: 'USD'
            },
            name: item.name,
            note: item.uploadedPhoto ? 'Custom photo uploaded' : undefined
          }))
        },
        redirectUrl: `${window.location.origin}/checkout/success`,
        note: 'Online order with photo customization'
      };

      // Create checkout link
      const response = await fetch('/api/square/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout');
      }

      const { checkoutUrl } = await response.json();
      
      // Redirect to Square checkout
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error('Square checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "There was an error processing your checkout. Please try again.",
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

  return (
    <Button
      onClick={handleSquareCheckout}
      disabled={isLoading || !squareReady}
      className="w-full bg-sage hover:bg-forest text-white text-lg font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
          Processing...
        </>
      ) : (
        'Pay with Square'
      )}
    </Button>
  );
};

export default SquareCheckout;
