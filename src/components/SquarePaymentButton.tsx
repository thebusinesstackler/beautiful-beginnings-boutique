
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
  const isDisabled = isLoading || !hasCard || sdkStatus !== 'ready' || !isSecureConnection;

  return (
    <Button
      onClick={onPayment}
      disabled={isDisabled}
      className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-200 disabled:hover:bg-pink-200 text-white font-semibold py-4 text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          <span>Processing...</span>
        </div>
      ) : (
        `Place Your Order - $${total.toFixed(2)}`
      )}
    </Button>
  );
};

export default SquarePaymentButton;
