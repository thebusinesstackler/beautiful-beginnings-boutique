
import { useState, useCallback } from 'react';
import { toast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSquareCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = useCallback(async (orderData: any) => {
    setIsLoading(true);
    
    try {
      console.log('Creating Square checkout via Edge Function...');
      
      // Use Supabase Edge Function instead of direct API call
      const { data, error } = await supabase.functions.invoke('square-checkout', {
        body: orderData
      });

      if (error) {
        console.error('Square checkout error:', error);
        throw new Error(error.message || 'Failed to create Square checkout');
      }

      console.log('Square checkout created successfully:', data);
      return data;
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
