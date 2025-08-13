
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
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

    // Process payment using edge function directly (no database settings needed)
    try {
      const response = await fetch('/functions/v1/square-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* Validation Errors Display */}
      <SquareValidationErrors errors={validationErrors} />

      {/* Simple Payment Button - Edge Function handles all Square configuration */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Complete Payment - ${total.toFixed(2)}
        </button>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Secure payment processing powered by Square
        </p>
      </div>
    </div>
  );
};

export default EmbeddedSquareCheckout;
