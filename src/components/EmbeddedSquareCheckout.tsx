'use client';

import React, { memo, useState } from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';
import { supabase } from '@/integrations/supabase/client';
import type { EmbeddedSquareCheckoutProps } from '@/types/SquareCheckout';
import { useOrderCreation } from '@/hooks/useOrderCreation';
import { useCart } from '@/contexts/CartContext';

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
  squareEnvironment,
  isFormValid = true
}: Props) => {

  const [isPaying, setIsPaying] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);
  const { createOrder } = useOrderCreation();
  const { items: cartItems, clearCart } = useCart();

  const handlePayment = async () => {
    if (!card) {
      setPaymentResult({ success: false, message: 'Payment form is not ready yet.' });
      return;
    }

    try {
      setIsPaying(true);
      setPaymentResult(null);

      console.log('🚀 Starting embedded checkout payment processing...');

      // 1️⃣ Create order in database FIRST
      console.log('📝 Creating order in database...');
      let orderId: string;
      try {
        // Gather uploaded image URLs from cart items
        const uploadedImages = cartItems
          .filter(item => item.uploadedPhotoUrl)
          .map(item => item.uploadedPhotoUrl!)
          .filter(Boolean);

        orderId = await createOrder({
          customerInfo,
          shippingAddress,
          billingAddress,
          items: cartItems,
          amount: total * 100, // Convert to cents
          breakdown: {
            subtotal: subtotal * 100,
            shipping: shippingCost * 100,
            tax: tax * 100,
            total: total * 100
          },
          uploadedImages
        });
        console.log('✅ Order created with ID:', orderId);
      } catch (orderError) {
        console.error('❌ Failed to create order:', orderError);
        setPaymentResult({ success: false, message: 'Failed to create order. Please try again.' });
        setIsPaying(false);
        return;
      }

      // 2️⃣ Tokenize the card
      console.log('💳 Tokenizing card...');
      const result = await card.tokenize();
      if (result.status !== 'OK') {
        console.error('❌ Card tokenization failed:', result);
        setPaymentResult({ success: false, message: 'Failed to tokenize card. Please check your details.' });
        setIsPaying(false);
        return;
      }
      console.log('✅ Card tokenization successful');

      // 3️⃣ Send payment data to Supabase Edge Function with orderId
      console.log('💰 Processing payment with Square...');
      const { data, error } = await supabase.functions.invoke('square-payments', {
        body: {
          action: 'process_payment',
          sourceId: result.token,
          verificationToken: result.verificationToken,
          amount: total, // Amount in dollars
          orderId: orderId, // Pass the created order ID
          idempotencyKey: crypto.randomUUID(),
          customerEmail: customerInfo.email,
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customerPhone: customerInfo.phone,
          billingAddress: {
            addressLine1: billingAddress.address,
            locality: billingAddress.city,
            administrativeDistrictLevel1: billingAddress.state,
            postalCode: billingAddress.zipCode,
            country: billingAddress.country
          }
        }
      });

      console.log('📊 Square payment function response:', { data, error });

      if (error) {
        console.error('❌ Payment processing error:', error);
        
        // Enhanced error logging with response text
        let errorMessage = error.message || 'Payment failed. Please try again.';
        if (error.context?.response) {
          try {
            const responseText = await error.context.response.text();
            console.error('❌ Payment function response body:', responseText);
            
            // Try to parse JSON error response
            try {
              const errorData = JSON.parse(responseText);
              if (errorData.error) {
                errorMessage = errorData.error;
              }
            } catch (e) {
              // Not JSON, use the raw text if it's meaningful
              if (responseText && responseText.trim() !== '') {
                errorMessage = responseText;
              }
            }
          } catch (e) {
            console.error('❌ Could not read payment error response:', e);
          }
        }
        
        setPaymentResult({ success: false, message: errorMessage });
      } else if (data?.success) {
        console.log('✅ Payment successful! Order ID:', orderId, 'Payment ID:', data.paymentId);
        setPaymentResult({ success: true, message: `Payment successful! Order: ${orderId.substring(0, 8)}...` });
        
        // Clear the cart since payment was successful
        clearCart();
        
        // Redirect to success page with customer name and order ID
        const firstName = customerInfo.firstName || '';
        const lastName = customerInfo.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        const successParams = new URLSearchParams();
        if (fullName) {
          successParams.set('customerName', fullName);
        }
        successParams.set('orderId', orderId);
        
        window.location.href = `/checkout/success?${successParams.toString()}`;
        
        onSuccess?.();
      } else {
        const errorMsg = data?.error || 'Payment failed. Please try again.';
        console.error('❌ Payment failed:', errorMsg);
        setPaymentResult({ success: false, message: errorMsg });
      }

    } catch (err: any) {
      console.error('Payment error:', err);
      setPaymentResult({ success: false, message: err.message || 'Unexpected error during payment.' });
      onError?.(err);
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
            
            {/* Card container - always render when SDK is ready */}
            <div className="relative">
              <div
                ref={cardRef}
                id="sq-card-container"
                className="w-full border border-gray-300 rounded-lg p-4 bg-white min-h-[80px] focus-within:ring-2 focus-within:ring-sage focus-within:border-sage"
                style={{ minHeight: '80px' }}
              />
              
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
              disabled={isPaying || !card || !cardRef?.current || !isFormValid}
              className="w-full bg-sage text-white py-3 px-4 rounded-lg hover:bg-sage/90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {!isFormValid ? (
                'Complete Required Fields First'
              ) : isPaying ? (
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
