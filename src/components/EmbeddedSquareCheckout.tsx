import React, { memo, useState } from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';
import { supabase } from '@/integrations/supabase/client';

import type { EmbeddedSquareCheckoutProps } from '@/types/SquareCheckout';

interface Props extends EmbeddedSquareCheckoutProps {
  cardRef?: React.MutableRefObject<HTMLDivElement | null>;
  card?: any; // Square's Card instance
  sdkStatus?: SDKStatus;
  isSecureConnection?: boolean;
  squareEnvironment?: string;
}

const EmbeddedSquareCheckout = memo(({
  customerInfo,
  shippingAddress,
  billingAddress,
  sameAsShipping,
  total,
  subtotal,
  shippingCost,
  tax,
  onSuccess,
  onError,
  cardRef,
  card,
  sdkStatus = 'loading',
  isSecureConnection = false,
  squareEnvironment
}: Props) => {

  const [isPaying, setIsPaying] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);

  const handlePayment = async () => {
    if (!card) {
      setPaymentResult({ success: false, message: 'Payment form is not ready yet.' });
      return;
    }

    try {
      setIsPaying(true);
      setPaymentResult(null);

      // 1️⃣ Tokenize the card
      const result = await card.tokenize();
      if (result.status !== 'OK') {
        setPaymentResult({ success: false, message: 'Failed to tokenize card. Please check your details.' });
        setIsPaying(false);
        return;
      }

      // 2️⃣ Send token to Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('square-payments', {
        body: { token: result.token }
      });

      if (error || !data?.success) {
        setPaymentResult({ success: false, message: data?.error || 'Payment failed. Please try again.' });
      } else {
        setPaymentResult({ success: true, message: `Payment successful! ID: ${data.paymentId}` });
      }

    } catch (err: any) {
      setPaymentResult({ success: false, message: err.message || 'Unexpected error during payment.' });
    } finally {
      setIsPaying(false);
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
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading payment form...</p>
          </div>
        )}

        {sdkStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Payment System Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Unable to initialize the payment system. This could be due to:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Network connectivity issues</li>
                    <li>Square service temporarily unavailable</li>
                    <li>Invalid payment configuration</li>
                  </ul>
                  <p className="mt-2 font-medium">Please try refreshing the page or contact support if the issue persists.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {sdkStatus === 'ready' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Card Information</label>
            
            {/* Ensure card container exists and is properly configured */}
            <div className="relative">
              {cardRef ? (
                <div
                  ref={cardRef}
                  id="card-container"
                  className="w-full border border-gray-300 rounded-lg p-4 bg-white min-h-[80px] focus-within:ring-2 focus-within:ring-sage focus-within:border-sage"
                  style={{ minHeight: '80px' }}
                />
              ) : (
                <div className="w-full border border-red-300 rounded-lg p-4 bg-red-50 min-h-[80px] flex items-center justify-center">
                  <div className="text-center">
                    <svg className="h-8 w-8 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 6.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-red-600 font-medium text-sm">Payment form container error</p>
                    <p className="text-red-500 text-xs mt-1">Please refresh the page</p>
                  </div>
                </div>
              )}
              
              {/* Loading overlay for card container */}
              {cardRef && !card && (
                <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-sage border-t-transparent mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Loading card form...</p>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handlePayment}
              disabled={isPaying || !card || !cardRef}
              className="w-full bg-sage text-white py-3 px-4 rounded-lg hover:bg-sage/90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isPaying ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Complete Payment - $${total?.toFixed(2) || '0.00'}`
              )}
            </button>

            {paymentResult && (
              <div className={`p-3 rounded-lg ${paymentResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={`text-sm font-medium ${paymentResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {paymentResult.success ? '✓ ' : '✗ '}
                  {paymentResult.message}
                </p>
              </div>
            )}
          </div>
        )}

        {!isSecureConnection && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 font-medium">Secure connection required</p>
            <p className="text-amber-700 text-sm mt-1">HTTPS connection is required for payment processing.</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default EmbeddedSquareCheckout;
