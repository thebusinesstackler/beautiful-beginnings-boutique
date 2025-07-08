
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

  const isDisabled = isLoading || sdkStatus !== 'ready' || !isSecureConnection;

  return (
    <div className="space-y-4">
      <Button
        onClick={onPayment}
        disabled={isDisabled}
        className="w-full h-14 text-lg font-semibold"
        style={{
          backgroundColor: isDisabled ? '#9ca3af' : '#10b981',
          color: 'white'
        }}
      >
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
        )}
        {getButtonText()}
      </Button>
      
      {/* Status Messages */}
      {sdkStatus === 'loading' && (
        <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 font-medium text-sm">Preparing secure payment...</p>
        </div>
      )}
      
      {sdkStatus === 'error' && (
        <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium text-sm">Payment system unavailable</p>
          <p className="text-red-600 text-xs mt-1">Please refresh the page and try again</p>
        </div>
      )}
      
      {!isSecureConnection && (
        <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium text-sm">Secure connection required</p>
          <p className="text-amber-700 text-xs mt-1">HTTPS is required for payment processing</p>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500">🔒 Secure payment powered by Square</p>
      </div>
    </div>
  );
};

export default SquarePaymentButton;
