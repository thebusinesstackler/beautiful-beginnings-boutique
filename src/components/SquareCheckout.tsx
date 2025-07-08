
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

// Helper function to validate Square Location ID format
const isValidLocationId = (locationId: string): boolean => {
  // Square Location IDs are typically 11-13 characters and alphanumeric
  return /^[A-Z0-9]{11,13}$/.test(locationId);
};

// Helper function to validate Square App ID format  
const isValidAppId = (appId: string): boolean => {
  // Square App IDs start with "sq0idp-" for production or "sandbox-sq0idb-" for sandbox
  return /^(sq0idp-|sandbox-sq0idb-)[A-Za-z0-9_-]+$/.test(appId);
};

// Helper function to validate Square Access Token format
const isValidAccessToken = (accessToken: string): boolean => {
  // Square Access Tokens are long alphanumeric strings, often start with "EAAA"
  return accessToken.length > 20 && /^[A-Za-z0-9_-]+$/.test(accessToken);
};

const SquareCheckout = ({ onSuccess, onError }: SquareCheckoutProps) => {
  const { items, getCartTotal } = useCart();
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  // Validate Square configuration on component mount
  useEffect(() => {
    if (settings.square_app_id && settings.square_location_id && settings.square_access_token) {
      const validationErrors = [];
      
      if (!isValidAppId(settings.square_app_id)) {
        validationErrors.push(`Invalid App ID format: ${settings.square_app_id}`);
      }
      
      if (!isValidLocationId(settings.square_location_id)) {
        validationErrors.push(`Invalid Location ID format: ${settings.square_location_id}. Expected format: 11-13 alphanumeric characters (e.g., L7P8XBGX7GH2J)`);
      }
      
      if (!isValidAccessToken(settings.square_access_token)) {
        validationErrors.push(`Invalid Access Token format`);
      }
      
      if (validationErrors.length > 0) {
        console.warn('Square configuration validation failed:', validationErrors);
        toast({
          title: "Square Configuration Warning",
          description: `Potential issues detected: ${validationErrors.join(', ')}`,
          variant: "destructive",
        });
      } else {
        console.log('Square configuration validation passed');
      }
    }
  }, [settings.square_app_id, settings.square_location_id, settings.square_access_token]);

  const handleCheckout = async () => {
    console.log('=== SQUARE CHECKOUT DEBUG INFO ===');
    console.log('Cart items:', items.length);
    console.log('Cart total:', getCartTotal());
    console.log('Square settings validation:', {
      appIdValid: isValidAppId(settings.square_app_id || ''),
      locationIdValid: isValidLocationId(settings.square_location_id || ''),
      accessTokenValid: isValidAccessToken(settings.square_access_token || ''),
      environment: settings.square_environment || 'sandbox',
      actualLocationId: settings.square_location_id,
      locationIdLength: settings.square_location_id?.length
    });

    // Enhanced validation with specific error messages
    const validationErrors = [];
    
    if (!settings.square_app_id) {
      validationErrors.push('App ID is missing');
    } else if (!isValidAppId(settings.square_app_id)) {
      validationErrors.push(`App ID format is invalid. Expected format: sandbox-sq0idb-[chars] or sq0idp-[chars]`);
    }
    
    if (!settings.square_location_id) {
      validationErrors.push('Location ID is missing');
    } else if (!isValidLocationId(settings.square_location_id)) {
      validationErrors.push(`Location ID format is invalid. Got "${settings.square_location_id}" but expected 11-13 alphanumeric characters like "L7P8XBGX7GH2J"`);
    }
    
    if (!settings.square_access_token) {
      validationErrors.push('Access Token is missing');
    } else if (!isValidAccessToken(settings.square_access_token)) {
      validationErrors.push('Access Token format appears invalid');
    }

    if (validationErrors.length > 0) {
      console.error('Square validation failed:', validationErrors);
      toast({
        title: "Square Configuration Error",
        description: validationErrors.join('. '),
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
          environment: settings.square_environment || 'sandbox',
          locationId: settings.square_location_id
        }
      };

      console.log('Square checkout request:', JSON.stringify(checkoutRequest, null, 2));

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('square-checkout', {
        body: checkoutRequest
      });

      console.log('Supabase Edge Function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: "Checkout Error",
          description: `Edge function error: ${error.message || 'Unknown error'}`,
          variant: "destructive",
        });
        throw new Error(error.message || 'Failed to create checkout');
      }

      if (!data) {
        console.error('No data received from edge function');
        toast({
          title: "Checkout Error",
          description: "No response received from payment processor",
          variant: "destructive",
        });
        throw new Error('No data received from edge function');
      }

      if (!data.checkoutUrl) {
        console.error('No checkout URL in response:', data);
        toast({
          title: "Checkout Error",
          description: data.error || "No checkout URL received from payment processor",
          variant: "destructive",
        });
        throw new Error(data.error || 'No checkout URL received');
      }

      console.log('Square checkout created successfully:', data);
      
      // Redirect to Square checkout
      window.location.href = data.checkoutUrl;
      
    } catch (error: any) {
      console.error('Square checkout error:', error);
      
      // More specific error handling
      let errorMessage = "There was an error processing your checkout. Please try again.";
      if (error.message) {
        console.error('Square API Error Details:', error.message);
        if (error.message.includes('location') || error.message.includes('Invalid location id')) {
          errorMessage = `Invalid Square Location ID "${settings.square_location_id}". Please get the correct Location ID from your Square Dashboard → Account & Settings → Business → Locations. It should be 11-13 characters like "L7P8XBGX7GH2J", not "${settings.square_location_id}".`;
        } else if (error.message.includes('access') || error.message.includes('Unauthorized')) {
          errorMessage = "Invalid Square Access Token. Please check your Square credentials in the admin panel.";
        } else if (error.message.includes('app') || error.message.includes('application')) {
          errorMessage = "Invalid Square App ID. Please check your Square configuration in the admin panel.";
        } else if (error.message.includes('environment')) {
          errorMessage = "Square environment mismatch. Ensure your credentials match the selected environment (sandbox/production).";
        } else {
          errorMessage = `Square API Error: ${error.message}`;
        }
      }
      
      console.error('=== SQUARE CHECKOUT ERROR SUMMARY ===');
      console.error('Error:', error);
      console.error('Settings used:', {
        appId: settings.square_app_id?.substring(0, 20) + '...',
        locationId: settings.square_location_id,
        environment: settings.square_environment,
        hasAccessToken: !!settings.square_access_token
      });
      console.error('=== END ERROR SUMMARY ===');
      
      toast({
        title: "Checkout Error",
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
