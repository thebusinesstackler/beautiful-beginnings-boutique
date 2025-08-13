
import { useState, useCallback } from 'react';
import { toast } from './use-toast';

export const useSquareCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = useCallback(async (orderData: any) => {
    setIsLoading(true);
    
    try {
      // Edge function handles all Square configuration from secrets
      const response = await fetch('/functions/v1/square-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create Square checkout');
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
  }, []);

  return {
    createCheckout,
    isLoading,
  };
};
