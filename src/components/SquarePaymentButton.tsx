
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
    <div className="space-y-4" style={{ margin: '16px 0' }}>
      {/* Main Payment Button */}
      <button
        onClick={onPayment}
        disabled={isDisabled}
        className={`
          w-full h-12 text-base font-bold rounded-lg transition-all duration-200 cursor-pointer
          ${isDisabled 
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
          }
        `}
        style={{
          padding: '12px 24px',
          borderRadius: '6px',
          border: 'none',
          boxShadow: isDisabled ? 'none' : '0 2px 4px rgba(34,197,94,0.2)'
        }}
      >
        <div className="flex items-center justify-center space-x-2">
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          )}
          <span>{getButtonText()}</span>
        </div>
      </button>
      
      {/* Status Messages */}
      {sdkStatus === 'loading' && (
        <div className="text-center p-2 text-sm text-gray-600">
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
        <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium text-sm">Secure connection required</p>
          <p className="text-red-700 text-xs mt-1">HTTPS is required for payment processing</p>
        </div>
      )}

      {/* Powered by Square - visually separated */}
      <div className="pt-4 border-t border-gray-100">
        <div className="text-center text-xs text-gray-500">
          <p>🔒 Powered by Square</p>
          <p className="mt-1">Your payment information is never stored on our servers</p>
        </div>
      </div>
    </div>
  );
};

export default SquarePaymentButton;
