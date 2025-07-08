
import { useState, useCallback } from 'react';
import { useSettings } from './useSettings';
import { toast } from './use-toast';

export const useSquareCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useSettings();

  const createCheckout = useCallback(async (orderData: any) => {
    if (!settings.square_app_id || !settings.square_location_id) {
      throw new Error('Square configuration missing');
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/square/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          locationId: settings.square_location_id,
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
  }, [settings.square_app_id, settings.square_location_id]);

  return {
    createCheckout,
    isLoading,
  };
};
