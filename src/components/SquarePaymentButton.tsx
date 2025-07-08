
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

  // Simplified button enabling logic - only require basic conditions
  const isDisabled = isLoading || sdkStatus !== 'ready' || !isSecureConnection;

  return (
    <div className="space-y-4">
      <Button
        onClick={onPayment}
        disabled={isDisabled}
        className="w-full text-white text-lg font-semibold py-6 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: isDisabled ? 'hsl(0 0% 60%)' : 'hsl(140 30% 45%)',
          color: 'white',
          minHeight: '60px',
          fontSize: '18px',
          fontWeight: '600'
        }}
      >
        <div className="flex items-center justify-center gap-3">
          {isLoading && (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          )}
          <span className="font-semibold text-lg">{getButtonText()}</span>
          {!isLoading && sdkStatus === 'ready' && isSecureConnection && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
        </div>
      </Button>
      
      {/* Debug info - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-stone space-y-1 p-3 bg-stone/5 rounded-lg border">
          <div className="font-medium text-charcoal">Debug Info:</div>
          <div>SDK Status: <span className="font-mono">{sdkStatus}</span></div>
          <div>Has Card: <span className="font-mono">{hasCard ? 'Yes' : 'No'}</span></div>
          <div>Secure: <span className="font-mono">{isSecureConnection ? 'Yes' : 'No'}</span></div>
          <div>Loading: <span className="font-mono">{isLoading ? 'Yes' : 'No'}</span></div>
          <div>Button Disabled: <span className="font-mono">{isDisabled ? 'Yes' : 'No'}</span></div>
          <div>Total: <span className="font-mono">${total.toFixed(2)}</span></div>
        </div>
      )}
      
      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-4 text-xs text-stone">
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>PCI Compliant</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>SSL Secured</span>
        </div>
      </div>
    </div>
  );
};

export default SquarePaymentButton;
