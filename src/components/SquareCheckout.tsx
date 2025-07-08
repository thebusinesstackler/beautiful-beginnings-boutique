
import React from 'react';
import EmbeddedSquareCheckout from './EmbeddedSquareCheckout';

interface SquareCheckoutProps {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  sameAsShipping: boolean;
  total: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const SquareCheckout = ({ 
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
}: SquareCheckoutProps) => {
  return (
    <EmbeddedSquareCheckout
      customerInfo={customerInfo}
      shippingAddress={shippingAddress}
      billingAddress={billingAddress}
      sameAsShipping={sameAsShipping}
      total={total}
      subtotal={subtotal}
      shippingCost={shippingCost}
      tax={tax}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
};

export default SquareCheckout;
