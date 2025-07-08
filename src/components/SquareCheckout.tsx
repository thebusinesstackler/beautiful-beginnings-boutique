
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { supabase } from '@/integrations/supabase/client';

interface SquareCheckoutProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const SquareCheckout = ({ onSuccess, onError }: SquareCheckoutProps) => {
  const { items, getCartTotal } = useCart();
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!settings.square_app_id || !settings.square_location_id || !settings.square_access_token) {
      toast({
        title: "Configuration Error",
        description: "Square checkout is not properly configured. Please check admin settings.",
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
      // Create checkout request with Square credentials from settings
      const checkoutRequest = {
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
        note: 'Online order with photo customization',
        squareCredentials: {
          appId: settings.square_app_id,
          accessToken: settings.square_access_token,
          environment: settings.square_environment || 'sandbox'
        }
      };

      console.log('Creating Square checkout with credentials from admin settings');

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('square-checkout', {
        body: checkoutRequest
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to create checkout');
      }

      if (!data?.checkoutUrl) {
        throw new Error('No checkout URL received');
      }

      console.log('Square checkout created successfully:', data);
      
      // Redirect to Square checkout
      window.location.href = data.checkoutUrl;
      
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
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full bg-sage hover:bg-forest text-white text-lg font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
          Processing...
        </>
      ) : (
        'Checkout'
      )}
    </Button>
  );
};

export default SquareCheckout;
