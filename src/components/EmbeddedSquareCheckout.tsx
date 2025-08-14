import React, { memo } from 'react';
import useSquareSDK from '@/hooks/useSquareSDK';
import type { SDKStatus } from '@/types/SquareCheckout';

interface EmbeddedSquareCheckoutProps {
  onPaymentSuccess?: (token: string) => void;
  onPaymentError?: (error: any) => void;
}

const EmbeddedSquareCheckout = memo(({ onPaymentSuccess, onPaymentError }: EmbeddedSquareCheckoutProps) => {
  const { cardRef, sdkStatus, isSecureConnection, payments } = useSquareSDK();

  const handlePayment = async () => {
    if (!payments) return;

    try {
      const result = await payments.card().tokenize();
      if (result.status === 'OK') {
        onPaymentSuccess?.(result.token);
      } else {
        throw new Error(result.errors?.[0]?.message || 'Tokenization failed');
      }
    } catch (err) {
      onPaymentError?.(err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-sage/20 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-sage/10">
        <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
        <p className="text-sm text-gray-600 mt-1">Enter your card details below</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {sdkStatus === 'loading' && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading payment form...</p>
            </div>
          </div>
        )}

        {sdkStatus === 'error' && (
          <div className="py-8 text-center">
            <p className="text-red-600">Failed to initialize Square payment form.</p>
          </div>
        )}

        {sdkStatus === 'ready' && isSecureConnection && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div
                ref={cardRef}
                id="card-container"
                className="w-full border border-gray-300 rounded-lg p-4 bg-white min-h-[80px] focus-within:border-sage focus-within:ring-1 focus-within:ring-sage transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={handlePayment}
              className="mt-4 w-full bg-sage text-white py-3 rounded-lg hover:bg-sage-dark transition"
            >
              Pay Now
            </button>
          </>
        )}

        {!isSecureConnection && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 font-medium text-sm">Secure connection required</p>
            <p className="text-amber-700 text-sm mt-1">HTTPS connection is required for payment processing.</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default EmbeddedSquareCheckout;
