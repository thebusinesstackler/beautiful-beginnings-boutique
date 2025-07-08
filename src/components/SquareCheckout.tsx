
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
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const SquareCheckout = ({ 
  customerInfo, 
  shippingAddress, 
  billingAddress, 
  sameAsShipping, 
  onSuccess, 
  onError 
}: SquareCheckoutProps) => {
  return (
    <EmbeddedSquareCheckout
      customerInfo={customerInfo}
      shippingAddress={shippingAddress}
      billingAddress={billingAddress}
      sameAsShipping={sameAsShipping}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
};

export default SquareCheckout;
