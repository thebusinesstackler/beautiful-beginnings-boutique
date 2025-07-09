
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { PaymentStatus, PaymentRequest } from '@/types/SquareCheckout';

interface UseSquarePaymentProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  clearCart: () => void;
}

export const useSquarePayment = ({ onSuccess, onError, clearCart }: UseSquarePaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');

  const processPayment = async (card: any, paymentRequest: PaymentRequest) => {
    if (!card) {
      toast({
        title: "Payment Error",
        description: "Payment system not initialized. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      // Validate Square credentials before processing
      if (!paymentRequest.squareCredentials.appId || !paymentRequest.squareCredentials.locationId) {
        throw new Error('Square credentials are not properly configured. Please contact support.');
      }

      // Tokenize the card with buyer verification
      console.log('Starting card tokenization...');
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status === 'OK') {
        const paymentToken = tokenResult.token;
        
        // Collect uploaded image URLs from cart items
        const uploadedImages = [];
        
        // Check each item for uploaded photos
        paymentRequest.items.forEach((item: any) => {
          console.log('Checking item for uploaded photos:', item);
          
          // Check for uploadedPhotoUrl
          if (item.uploadedPhotoUrl) {
            uploadedImages.push(item.uploadedPhotoUrl);
            console.log('Found uploadedPhotoUrl:', item.uploadedPhotoUrl);
          }
          
          // Check for uploadedPhoto file that needs to be converted to URL
          if (item.uploadedPhoto && item.uploadedPhoto instanceof File) {
            console.log('Found uploaded photo file, will be processed by backend:', item.uploadedPhoto.name);
          }
        });

        // Also check for any global uploaded images in the payment request
        if (paymentRequest.uploadedImages && Array.isArray(paymentRequest.uploadedImages)) {
          uploadedImages.push(...paymentRequest.uploadedImages);
          console.log('Added global uploaded images:', paymentRequest.uploadedImages);
        }

        console.log('All collected uploaded images:', uploadedImages);

        // Clean the cart items to avoid circular references
        const cleanCartItems = paymentRequest.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          uploadedPhotoUrl: item.uploadedPhotoUrl || null,
          willUploadLater: item.willUploadLater || false
        }));

        // Send payment token to backend with cleaned data
        const requestPayload = {
          ...paymentRequest,
          token: paymentToken,
          uploadedImages: uploadedImages,
          // Include clean cart items without file objects or circular references
          cartItems: cleanCartItems,
          items: cleanCartItems // Also update the main items array
        };

        console.log('Processing payment with clean payload:', {
          ...requestPayload,
          squareCredentials: {
            ...requestPayload.squareCredentials,
            accessToken: requestPayload.squareCredentials.accessToken ? '[PRESENT]' : '[MISSING]'
          }
        });

        const { data, error } = await supabase.functions.invoke('square-checkout', {
          body: requestPayload
        });

        if (error) {
          console.error('Payment processing error:', error);
          
          // Provide more specific error messages based on the error
          if (error.message.includes('unauthorized') || error.message.includes('credentials')) {
            throw new Error('Square payment configuration error. Please contact support.');
          } else if (error.message.includes('non-2xx')) {
            throw new Error('Payment processing service is currently unavailable. Please try again later.');
          } else {
            throw new Error(error.message || 'Payment processing failed');
          }
        }

        if (data?.success) {
          setPaymentStatus('success');
          console.log('Payment successful:', data);
          
          // Clear cart on successful payment
          clearCart();
          
          toast({
            title: "Payment Successful!",
            description: `Order #${data.orderId} has been processed successfully.`,
          });

          onSuccess?.();
        } else {
          setPaymentStatus('error');
          throw new Error(data?.error || 'Payment failed');
        }
      } else {
        setPaymentStatus('error');
        console.error('Tokenization failed:', tokenResult.errors);
        throw new Error('Card tokenization failed. Please check your card details.');
      }
    } catch (error: any) {
      setPaymentStatus('error');
      console.error('Payment error:', error);
      
      let errorMessage = "Payment processing failed. Please try again.";
      
      // Enhanced error handling for different Square error types
      if (error.message.includes('INVALID_CARD_DATA')) {
        errorMessage = "Invalid card information. Please check your card number, expiration date, and CVV.";
      } else if (error.message.includes('CARD_DECLINED')) {
        errorMessage = "Your card was declined. Please try a different payment method or contact your bank.";
      } else if (error.message.includes('INSUFFICIENT_FUNDS')) {
        errorMessage = "Insufficient funds on your card. Please try a different payment method.";
      } else if (error.message.includes('EXPIRED_CARD')) {
        errorMessage = "Your card has expired. Please use a different payment method.";
      } else if (error.message.includes('CVV_FAILURE')) {
        errorMessage = "CVV verification failed. Please check your card's security code.";
      } else if (error.message.includes('INVALID_LOCATION')) {
        errorMessage = "Payment configuration error. Please contact support.";
      } else if (error.message.includes('credentials') || error.message.includes('configuration')) {
        errorMessage = "Payment system configuration error. Please contact support.";
      } else if (error.message.includes('card')) {
        errorMessage = "Card information is invalid. Please check your card details.";
      } else if (error.message.includes('amount')) {
        errorMessage = "Payment amount is invalid. Please try again.";
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = "Network error. Please check your connection and try again.";
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

  return {
    isLoading,
    paymentStatus,
    processPayment
  };
};
