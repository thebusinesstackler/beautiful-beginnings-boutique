
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
    if (isLoading) return 'Processing...';
    if (sdkStatus === 'loading') return 'Loading...';
    if (sdkStatus === 'error') return 'Payment unavailable';
    if (!isSecureConnection) return 'Secure connection required';
    return `Pay $${total.toFixed(2)}`;
  };

  const isDisabled = isLoading || sdkStatus !== 'ready' || !isSecureConnection;

  return (
    <div className="space-y-3">
      {/* Main Payment Button */}
      <Button
        onClick={onPayment}
        disabled={isDisabled}
        className="w-full h-12 text-base font-semibold rounded-lg transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white border-none disabled:bg-gray-400 disabled:text-gray-600"
      >
        <div className="flex items-center justify-center space-x-2">
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          )}
          <span>{getButtonText()}</span>
        </div>
      </Button>
      
      {/* Status Messages */}
      {sdkStatus === 'loading' && (
        <div className="text-center p-2 text-sm text-charcoal/60">
          <p>Initializing secure payment system...</p>
        </div>
      )}
      
      {sdkStatus === 'error' && (
        <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium text-sm">Unable to load payment system</p>
          <p className="text-red-600 text-xs mt-1">Please refresh the page and try again</p>
        </div>
      )}
      
      {!isSecureConnection && (
        <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium text-sm">Secure connection required</p>
          <p className="text-amber-700 text-xs mt-1">HTTPS is required for payment processing</p>
        </div>
      )}
    </div>
  );
};

export default SquarePaymentButton;
