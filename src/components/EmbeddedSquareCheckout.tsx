import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';
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
  const { settings } = useSettings();
  
  // Initialize Square SDK
  const { payments, card, sdkStatus, isSecureConnection, cardRef } = useSquareSDK({
    squareAppId: settings.square_app_id,
    squareLocationId: settings.square_location_id,
    squareEnvironment: settings.square_environment
  });

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
      },
      squareCredentials: {
        appId: settings.square_app_id,
        accessToken: settings.square_access_token,
        environment: settings.square_environment || 'sandbox',
        locationId: settings.square_location_id
      }
    };

    await processPayment(card, paymentRequest);
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
    <div className="w-full space-y-6">
      {/* Validation Errors Display */}
      <SquareValidationErrors errors={validationErrors} />

      {/* Card Input Container */}
      <SquareCardForm 
        cardRef={cardRef}
        sdkStatus={sdkStatus}
        isSecureConnection={isSecureConnection}
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

      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-charcoal/60">
          <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="font-medium">Secure payment powered by Square</span>
        </div>
        <p className="text-xs text-charcoal/50 max-w-md mx-auto leading-relaxed">
          Your payment information is protected with industry-standard encryption and never stored on our servers
        </p>
      </div>
    </div>
  );
};

export default EmbeddedSquareCheckout;