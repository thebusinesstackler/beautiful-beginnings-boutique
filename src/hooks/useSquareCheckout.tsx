
import { useState, useCallback } from 'react';
import { toast } from './use-toast';

export const useSquareCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = useCallback(async (orderData: any) => {
    setIsLoading(true);
    
    try {
      // Note: Square credentials are now securely managed in Edge Function secrets
      // This hook interfaces with the secure Square Edge Function
      const response = await fetch('/api/square/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create Square checkout');
      }

      return await response.json();
    } catch (error) {
      console.error('Square checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "Failed to initialize Square checkout. Please try again.",
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
