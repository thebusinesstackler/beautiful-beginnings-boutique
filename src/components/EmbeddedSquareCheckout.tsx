
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { useSquareSDK } from '@/hooks/useSquareSDK';
import { useSquareValidation } from '@/hooks/useSquareValidation';
import { useSquarePayment } from '@/hooks/useSquarePayment';
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
  
  // Initialize Square SDK by fetching config from edge function
  // All Square credentials are managed via Supabase secrets
  const { payments, card, sdkStatus, isSecureConnection, cardRef, squareEnvironment } = useSquareSDK({});

  // Form validation
  const { validationErrors, validateForm } = useSquareValidation({
    customerInfo,
    shippingAddress,
    billingAddress,
    sameAsShipping,
    items
  });

  // Payment processing
  const { isLoading, processPayment } = useSquarePayment({
    onSuccess,
    onError,
    clearCart
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

    // Square configuration is handled by Supabase secrets in the backend
    console.log('Processing payment with Square SDK tokenization...');

    const paymentRequest: PaymentRequest = {
      token: '', // Will be set by processPayment
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
    };

    await processPayment(card, paymentRequest);
  };

  if (items.length === 0) {
    return null;
  }

  // Square configuration is handled via Supabase secrets - no frontend validation needed

  return (
    <div className="w-full space-y-6">
      {/* Validation Errors Display */}
      <SquareValidationErrors errors={validationErrors} />

      {/* Card Input Container */}
      <SquareCardForm 
        cardRef={cardRef}
        sdkStatus={sdkStatus}
        isSecureConnection={isSecureConnection}
        squareEnvironment={squareEnvironment}
      />

      {/* Payment Button */}
      <SquarePaymentButton
        onPayment={handlePayment}
        isLoading={isLoading}
        hasCard={!!card}
        sdkStatus={sdkStatus}
        isSecureConnection={isSecureConnection}
        total={total}
      />
    </div>
  );
};

export default EmbeddedSquareCheckout;
