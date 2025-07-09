
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
        title: "Please Complete Required Fields",
        description: `${validationErrors.length} error(s) found. Please review the form above.`,
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
        accessToken: '', // Will be handled by Edge Function
        environment: settings.square_environment || 'sandbox',
        locationId: settings.square_location_id || ''
      }
    };

    await processPayment(card, paymentRequest);
  };

  if (items.length === 0) {
    return null;
  }

  // Check if Square is configured (only need public settings)
  const isSquareConfigured = settings.square_app_id && settings.square_location_id;

  if (!isSquareConfigured) {
    return (
      <div className="w-full p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">Square Payment Setup Required</h3>
          <p className="text-blue-700 max-w-md mx-auto mb-4">
            Square checkout needs to be configured in the admin panel to enable secure payment processing.
          </p>
          <p className="text-sm text-blue-600">
            Missing: {!settings.square_app_id && 'App ID'} {!settings.square_location_id && 'Location ID'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Validation Errors Display */}
      <SquareValidationErrors errors={validationErrors} />

      {/* Professional Square Card Form */}
      <SquareCardForm 
        cardRef={cardRef}
        sdkStatus={sdkStatus}
        isSecureConnection={isSecureConnection}
      />

      {/* Enhanced Payment Button */}
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
