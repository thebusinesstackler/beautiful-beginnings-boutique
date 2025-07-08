
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
    return `Complete Payment • $${total.toFixed(2)}`;
  };

  const getButtonIcon = () => {
    if (isLoading) {
      return (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
      );
    }
    
    if (sdkStatus === 'error' || !isSecureConnection) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    }
    
    if (sdkStatus === 'ready' && isSecureConnection) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }
    
    return null;
  };

  const isDisabled = isLoading || sdkStatus !== 'ready' || !isSecureConnection;

  const getButtonColor = () => {
    if (sdkStatus === 'error' || !isSecureConnection) {
      return 'hsl(0 70% 50%)'; // Red for errors
    }
    if (isDisabled) {
      return 'hsl(0 0% 60%)'; // Gray for disabled
    }
    return 'hsl(140 35% 45%)'; // Green for ready
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Payment Button */}
      <div className="relative">
        <Button
          onClick={onPayment}
          disabled={isDisabled}
          className="w-full text-white text-lg font-bold py-8 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
          style={{
            backgroundColor: getButtonColor(),
            color: 'white',
            minHeight: '64px',
            fontSize: '18px',
            fontWeight: '700',
            transform: isLoading ? 'scale(0.98)' : 'scale(1)'
          }}
        >
          <div className="flex items-center justify-center gap-3 relative z-10">
            {getButtonIcon()}
            <span className="font-bold text-lg">{getButtonText()}</span>
          </div>
          
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/10 animate-pulse"></div>
          )}
        </Button>
        
        {/* Progress indicator for loading state */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-xl overflow-hidden">
            <div className="h-full bg-white/60 animate-pulse"></div>
          </div>
        )}
      </div>
      
      {/* Enhanced Status Messages */}
      {sdkStatus === 'loading' && (
        <div className="text-center p-3 bg-sage/10 border border-sage/20 rounded-lg">
          <p className="text-sage font-medium text-sm">Preparing secure payment...</p>
          <p className="text-sage/70 text-xs mt-1">Please wait while we initialize the payment system</p>
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
      
      {/* Debug info - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <details className="text-xs text-stone space-y-1 p-3 bg-stone/5 rounded-lg border">
          <summary className="font-medium text-charcoal cursor-pointer hover:text-sage">Debug Info</summary>
          <div className="mt-2 space-y-1 font-mono">
            <div>SDK Status: <span className="text-sage">{sdkStatus}</span></div>
            <div>Has Card: <span className="text-sage">{hasCard ? 'Yes' : 'No'}</span></div>
            <div>Secure: <span className="text-sage">{isSecureConnection ? 'Yes' : 'No'}</span></div>
            <div>Loading: <span className="text-sage">{isLoading ? 'Yes' : 'No'}</span></div>
            <div>Button Disabled: <span className="text-sage">{isDisabled ? 'Yes' : 'No'}</span></div>
            <div>Total: <span className="text-sage">${total.toFixed(2)}</span></div>
          </div>
        </details>
      )}
      
      {/* Enhanced Trust Indicators */}
      <div className="bg-sage/5 border border-sage/15 rounded-lg p-4">
        <div className="flex items-center justify-center gap-6 text-xs text-sage">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">PCI Compliant</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-medium">Bank-Level Security</span>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-charcoal/60 font-medium">
            🛡️ Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default SquarePaymentButton;
