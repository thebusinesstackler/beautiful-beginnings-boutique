import React from 'react';
import { Button } from '@/components/ui/button';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquarePaymentButtonProps {
  onPayment: () => void;
  isLoading: boolean;
  hasCard: boolean;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
  total: number;
}

const SquarePaymentButton = ({ 
  onPayment, 
  isLoading, 
  hasCard, 
  sdkStatus, 
  isSecureConnection, 
  total 
}: SquarePaymentButtonProps) => {
  const getButtonText = () => {
    if (isLoading) return 'Processing Payment...';
    if (sdkStatus === 'loading') return 'Loading Payment Form...';
    if (sdkStatus === 'error') return 'Payment Form Unavailable';
    if (!isSecureConnection) return 'Secure Connection Required';
    return `Pay $${total.toFixed(2)}`;
  };

  const isDisabled = isLoading || !hasCard || sdkStatus !== 'ready' || !isSecureConnection;

  return (
    <Button
      onClick={onPayment}
      disabled={isDisabled}
      className="w-full bg-sage hover:bg-forest text-white text-lg font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
      )}
      {getButtonText()}
    </Button>
  );
};

export default SquarePaymentButton;