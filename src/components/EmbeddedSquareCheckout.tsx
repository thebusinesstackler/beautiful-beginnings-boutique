
import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { useSquareValidation } from '@/hooks/useSquareValidation';
import { useSquareSDK } from '@/hooks/useSquareSDK';
import SquareValidationErrors from './SquareValidationErrors';
import SquareCardForm from './SquareCardForm';
import SquarePaymentButton from './SquarePaymentButton';
import type { EmbeddedSquareCheckoutProps, PaymentRequest } from '@/types/SquareCheckout';

// Declare Square types
declare global {
  interface Window {
    Square: any;
  }
}

const EmbeddedSquareCheckout = ({
  customerInfo,
  shippingAddress,
  billingAddress,
  sameAsShipping,
  total,
  subtotal,
  shippingCost,
  tax,
  onSuccess,
  onError
}: EmbeddedSquareCheckoutProps) => {
  const { items, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize Square SDK with hardcoded values since we're using edge function
  const { payments, card, sdkStatus, isSecureConnection, cardRef } = useSquareSDK({
    squareAppId: 'sandbox-sq0idb-lrxmeewb9r0km', // This matches your location ID prefix
    squareLocationId: 'LRXMEEWB9R0KM',
    squareEnvironment: 'sandbox'
  });

  // Form validation
  const { validationErrors, validateForm } = useSquareValidation({
    customerInfo,
    shippingAddress,
    billingAddress,
    sameAsShipping,
    items
  });

  const handlePayment = async () => {
    // Comprehensive form validation
    if (!validateForm()) {
      toast({
        title: "Please Fix Form Errors",
        description: `${validationErrors.length} error(s) found: ${validationErrors.slice(0, 2).join(', ')}${validationErrors.length > 2 ? '...' : ''}`,
        variant: "destructive",
      });
      return;
    }

    if (!card) {
      toast({
        title: "Payment Form Not Ready",
        description: "Please wait for the payment form to load completely.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // First, tokenize the card using Square SDK
      console.log('Tokenizing card...');
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status !== 'OK') {
        console.error('Tokenization failed:', tokenResult);
        throw new Error(tokenResult.errors?.[0]?.message || 'Card tokenization failed');
      }

      console.log('Card tokenized successfully:', tokenResult.token);

      // Then send the token and order data to our edge function
      const response = await fetch('/functions/v1/square-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: tokenResult.token,
          customerInfo,
          shippingAddress,
          billingAddress: sameAsShipping ? shippingAddress : billingAddress,
          items,
          amount: Math.round(total * 100), // Convert total to cents
          breakdown: {
            subtotal: Math.round(subtotal * 100),
            shipping: Math.round(shippingCost * 100),
            tax: Math.round(tax * 100),
            total: Math.round(total * 100)
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Payment processing failed');
      }

      const result = await response.json();
      
      toast({
        title: "Payment Successful!",
        description: `Order #${result.order_id} has been placed successfully.`,
      });

      clearCart();
      onSuccess?.();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Payment processing failed. Please try again.",
        variant: "destructive",
      });
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* Validation Errors Display */}
      <SquareValidationErrors errors={validationErrors} />

      {/* Square Card Form */}
      <SquareCardForm
        cardRef={cardRef}
        sdkStatus={sdkStatus}
        isSecureConnection={isSecureConnection}
        squareEnvironment="sandbox"
      />

      {/* Payment Button */}
      <SquarePaymentButton
        onPayment={handlePayment}
        isLoading={isProcessing}
        hasCard={!!card}
        sdkStatus={sdkStatus}
        isSecureConnection={isSecureConnection}
        total={total}
      />
    </div>
  );
};

export default EmbeddedSquareCheckout;
