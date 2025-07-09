
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
  
  // Initialize Square SDK with settings from database
  const { payments, card, sdkStatus, isSecureConnection, cardRef } = useSquareSDK({
    squareAppId: settings.square_app_id,
    squareLocationId: settings.square_location_id,
    squareEnvironment: settings.square_environment || 'sandbox'
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
        appId: settings.square_app_id || '',
        accessToken: '', // This will be handled by the Edge Function
        environment: settings.square_environment || 'sandbox',
        locationId: settings.square_location_id || ''
      }
    };

    await processPayment(card, paymentRequest);
  };

  if (items.length === 0) {
    return null;
  }

  // Show configuration message if Square is not properly set up
  if (!settings.square_app_id || !settings.square_location_id) {
    return (
      <div className="w-full p-6 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-amber-800 mb-2">Square Payment Setup Required</h3>
            <p className="text-sm text-amber-700 mb-4">
              Square checkout is not fully configured. Please complete the setup in the admin panel.
            </p>
            <div className="text-xs text-amber-600 space-y-1">
              <p>Missing configuration:</p>
              {!settings.square_app_id && <p>• Square Application ID</p>}
              {!settings.square_location_id && <p>• Square Location ID</p>}
            </div>
          </div>
        </div>
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
