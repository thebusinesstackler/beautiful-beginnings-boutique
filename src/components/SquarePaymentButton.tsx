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
    if (isLoading) return 'Processing your payment...';
    if (sdkStatus === 'loading') return 'Loading payment form...';
    if (sdkStatus === 'error') return 'Payment form unavailable';
    if (!isSecureConnection) return 'Secure connection required';
    return `Place your order - $${total.toFixed(2)}`;
  };
  const isDisabled = isLoading || sdkStatus !== 'ready' || !isSecureConnection;
  return <div className="space-y-4">
      {/* Main Payment Button */}
      <Button onClick={onPayment} disabled={isDisabled} className="w-full h-12 text-base font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md bg-sage hover:bg-forest text-white border-none disabled:bg-gray-400 disabled:text-gray-600">
        <div className="flex items-center justify-center space-x-3">
          {isLoading && <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>}
          <span>{getButtonText()}</span>
          {!isLoading && sdkStatus === 'ready' && isSecureConnection && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>}
        </div>
      </Button>
      
      {/* Status Messages */}
      {sdkStatus === 'loading'}
      
      {sdkStatus === 'error' && <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium text-sm">Unable to load payment system</p>
          <p className="text-red-600 text-xs mt-1">Please refresh the page and try again</p>
        </div>}
      
      {!isSecureConnection && <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium text-sm">Secure connection required</p>
          <p className="text-amber-700 text-xs mt-1">HTTPS is required for payment processing</p>
        </div>}

      {/* Trust Indicators */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>PCI Compliant</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          🔒 Secure payment powered by Square
        </p>
      </div>
    </div>;
};
export default SquarePaymentButton;