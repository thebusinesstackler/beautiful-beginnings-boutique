import React, { memo, useState } from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';
import { supabase } from '@/lib/supabaseClient';

interface EmbeddedSquareCheckoutProps {
  cardRef: React.MutableRefObject<HTMLDivElement | null>;
  card: any; // Square's Card instance
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
  squareEnvironment?: string;
}

const EmbeddedSquareCheckout = memo(({
  cardRef,
  card,
  sdkStatus,
  isSecureConnection,
  squareEnvironment
}: EmbeddedSquareCheckoutProps) => {

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
          <div className="text-center py-8 text-red-600">
            Payment system initialization failed. Please check console logs.
          </div>
        )}

        {sdkStatus === 'ready' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Card Information</label>
            <div
              ref={cardRef}
              id="card-container"
              className="w-full border border-gray-300 rounded-lg p-4 bg-white min-h-[80px]"
            />
            <button
              onClick={handlePayment}
              disabled={isPaying}
              className="w-full bg-sage text-white py-2 rounded-lg hover:bg-sage/90 transition disabled:opacity-50"
            >
              {isPaying ? 'Processing...' : 'Pay Now'}
            </button>

            {paymentResult && (
              <p className={`text-sm mt-2 ${paymentResult.success ? 'text-green-600' : 'text-red-600'}`}>
                {paymentResult.message}
              </p>
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
