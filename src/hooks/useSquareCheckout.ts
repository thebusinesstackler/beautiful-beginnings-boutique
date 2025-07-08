
import { useState, useCallback } from 'react';
import { useSettings } from './useSettings';
import { toast } from './use-toast';

export const useSquareCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useSettings();

  const createCheckout = useCallback(async (orderData: any) => {
    if (!settings.square_app_id || !settings.square_location_id || !settings.square_access_token) {
      throw new Error('Square configuration missing');
    }

    setIsLoading(true);
    
    try {
      // Note: This hook is kept for compatibility but the main checkout logic
      // is now handled directly in the SquareCheckout component
      const response = await fetch('/api/square/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          locationId: settings.square_location_id,
          squareCredentials: {
            appId: settings.square_app_id,
            accessToken: settings.square_access_token,
            environment: settings.square_environment || 'sandbox'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Square checkout');
      }

      return await response.json();
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "Failed to initialize Square checkout",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [settings.square_app_id, settings.square_location_id, settings.square_access_token, settings.square_environment]);

  return {
    createCheckout,
    isLoading,
  };
};
