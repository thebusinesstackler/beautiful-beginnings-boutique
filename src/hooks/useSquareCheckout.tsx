
import { useState, useCallback } from 'react';
import { toast } from './use-toast';

export const useSquareCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = useCallback(async (orderData: any) => {
    setIsLoading(true);
    
    try {
      // The Edge Function will handle Square credentials securely from environment variables
      const response = await fetch('/api/square/create-checkout', {
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
      console.error('Square checkout error:', error);
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to initialize Square checkout. Please try again.",
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
