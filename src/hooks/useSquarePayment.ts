
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
// import { useOrderCreation } from './useOrderCreation'; // Skipping for Option A
import type { PaymentStatus, PaymentRequest } from '@/types/SquareCheckout';

interface UseSquarePaymentProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  clearCart: () => void;
}

export const useSquarePayment = ({ onSuccess, onError, clearCart }: UseSquarePaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  // const { createOrder } = useOrderCreation(); // Skipping for Option A

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
      // Square credentials are handled by backend via Supabase secrets
      console.log('Starting payment processing...');

      // Tokenize the card with buyer verification
      console.log('Starting card tokenization...');
      const tokenResult = await card.tokenize();
      
      console.log('Tokenization result:', {
        status: tokenResult.status,
        hasToken: !!tokenResult.token,
        hasVerificationToken: !!tokenResult.verificationToken,
        hasErrors: !!(tokenResult.errors && tokenResult.errors.length > 0),
        errorCount: tokenResult.errors ? tokenResult.errors.length : 0
      });
      
      if (tokenResult.status === 'OK') {
        const paymentToken = tokenResult.token;
        
        // Option A: Skip order creation and process payment directly
        // Calculate final amount in cents (amount is already in cents from frontend)
        const finalAmountInCents = Math.round(paymentRequest.amount);
        
        // Generate UUID for idempotency key
        const idempotencyKey = crypto.randomUUID();
        
        console.log('Processing direct payment - Option A:', {
          amount: finalAmountInCents,
          amountInDollars: finalAmountInCents / 100,
          idempotencyKey,
          customerEmail: paymentRequest.customerInfo.email,
          customerName: `${paymentRequest.customerInfo.firstName} ${paymentRequest.customerInfo.lastName}`,
          hasVerificationToken: !!tokenResult.verificationToken
        });

        // Use Supabase function for secure payment processing
        const { data, error } = await supabase.functions.invoke('square-payments', {
          body: {
            action: 'process_payment',
            sourceId: paymentToken,
            verificationToken: tokenResult.verificationToken,
            amount: finalAmountInCents / 100, // Convert back to dollars for backend
            idempotencyKey: idempotencyKey,
            customerEmail: paymentRequest.customerInfo.email,
            customerName: `${paymentRequest.customerInfo.firstName} ${paymentRequest.customerInfo.lastName}`
          }
        });

        console.log('Square function response:', { data, error });

        if (error) {
          console.error('Payment processing error (Supabase function error):', error);
          
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
            description: `Payment processed successfully. Payment ID: ${data.paymentId}`,
          });

          onSuccess?.();
        } else {
          setPaymentStatus('error');
          console.error('Payment failed response:', data);
          
          // Extract the specific error message from the Square API response
          let specificError = data?.error || 'Payment failed';
          
          // If there's raw Square API response data, try to extract more specific error
          if (data?.raw?.errors && Array.isArray(data.raw.errors) && data.raw.errors.length > 0) {
            const squareError = data.raw.errors[0];
            console.log('Square API error details:', squareError);
            
            // Use the Square error code or detail for more specific messaging
            if (squareError.code) {
              specificError = squareError.detail || squareError.code;
            }
          }
          
          console.log('Final processed error message:', specificError);
          throw new Error(specificError);
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
      
      console.log('Processing error for user display:', {
        errorMessage: error.message,
        errorType: typeof error,
        hasMessage: !!error.message
      });
      
      // Enhanced error handling for different Square error types
      const errorText = error.message || '';
      
      if (errorText.includes('INVALID_CARD_DATA') || errorText.includes('INVALID_VALUE')) {
        errorMessage = "Invalid card information. Please check your card number, expiration date, and CVV.";
      } else if (errorText.includes('CARD_DECLINED') || errorText.includes('DECLINED')) {
        errorMessage = "Your card was declined. Please try a different payment method or contact your bank.";
      } else if (errorText.includes('INSUFFICIENT_FUNDS')) {
        errorMessage = "Insufficient funds on your card. Please try a different payment method.";
      } else if (errorText.includes('EXPIRED_CARD') || errorText.includes('CARD_EXPIRED')) {
        errorMessage = "Your card has expired. Please use a different payment method.";
      } else if (errorText.includes('CVV_FAILURE') || errorText.includes('CVV')) {
        errorMessage = "CVV verification failed. Please check your card's security code.";
      } else if (errorText.includes('INVALID_LOCATION')) {
        errorMessage = "Payment configuration error. Please contact support.";
      } else if (errorText.includes('credentials') || errorText.includes('configuration')) {
        errorMessage = "Payment system configuration error. Please contact support.";
      } else if (errorText.includes('GENERIC_DECLINE')) {
        errorMessage = "Your payment was declined. Please contact your bank or try a different payment method.";
      } else if (errorText.includes('TRANSACTION_LIMIT')) {
        errorMessage = "Transaction limit exceeded. Please contact your bank or try a smaller amount.";
      } else if (errorText.includes('INVALID_ACCOUNT')) {
        errorMessage = "Card account is invalid. Please try a different payment method.";
      } else if (errorText.includes('CARD_NOT_SUPPORTED')) {
        errorMessage = "This card type is not supported. Please try a different payment method.";
      } else if (errorText.includes('VERIFICATION_REQUIRED')) {
        errorMessage = "Additional verification required. Please contact your bank.";
      } else if (errorText.includes('PAN_FAILURE') || errorText.includes('card')) {
        errorMessage = "Card information is invalid. Please check your card details.";
      } else if (errorText.includes('amount') || errorText.includes('INVALID_MONEY')) {
        errorMessage = "Payment amount is invalid. Please try again.";
      } else if (errorText.includes('network') || errorText.includes('timeout') || errorText.includes('NETWORK_ERROR')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message && error.message !== 'Payment failed') {
        // Use the specific error message if it's not the generic fallback
        errorMessage = error.message;
      }

      console.log('Final error message for user:', errorMessage);

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
