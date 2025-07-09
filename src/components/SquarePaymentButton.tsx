
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
    if (sdkStatus === 'loading') return 'Loading Payment System...';
    if (sdkStatus === 'error') return 'Payment System Unavailable';
    if (!isSecureConnection) return 'Secure Connection Required';
    return `Complete Payment • $${total.toFixed(2)}`;
  };

  const isDisabled = isLoading || sdkStatus !== 'ready' || !isSecureConnection;

  return (
    <div className="space-y-6">
      {/* Main Payment Button */}
      <div className="relative">
        <Button
          onClick={onPayment}
          disabled={isDisabled}
          className={`
            w-full h-16 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl
            ${isDisabled 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transform hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
        >
          <div className="flex items-center justify-center space-x-4">
            {isLoading && (
              <div className="relative">
                <div className="w-6 h-6 border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
              </div>
            )}
            
            {!isLoading && sdkStatus === 'ready' && isSecureConnection && (
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            )}
            
            <span className="tracking-wide">{getButtonText()}</span>
            
            {!isLoading && sdkStatus === 'ready' && isSecureConnection && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </div>
        </Button>
        
        {!isDisabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl blur-xl opacity-20 -z-10 animate-pulse"></div>
        )}
      </div>

      {/* Status Messages */}
      {sdkStatus === 'loading' && (
        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-800 font-medium">Connecting to Square's secure payment system...</p>
          </div>
        </div>
      )}
      
      {sdkStatus === 'error' && (
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-800 font-semibold">Payment system temporarily unavailable</p>
          </div>
          <p className="text-red-700 text-sm">Please refresh the page or try again in a few moments</p>
        </div>
      )}
      
      {!isSecureConnection && (
        <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-amber-800 font-semibold">Secure connection required</p>
          </div>
          <p className="text-amber-700 text-sm">HTTPS is required for payment processing</p>
        </div>
      )}

      {/* Square Branding & Trust Indicators */}
      <div className="text-center space-y-4">
        {/* Payment Security Features */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-medium">SSL Secured</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-medium">PCI Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="font-medium">Encrypted</span>
          </div>
        </div>

        {/* Square Branding */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.01 6.03l7.51 3.22-7.52-8.21L4.01 6.03zm7.52 8.21L4.02 17.46 4 12.47l7.53 1.77zm0-4.67L4.02 6.75 4 11.53l7.53-2.96zm7.51-8.21l-7.52 8.21 7.51-3.22-.01-4.99zm0 9.67l-7.51 3.22 7.52 8.21-.01-11.43zm-7.52-1.77L18.02 6.03 18 1.04l-7.48 8.22z"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">Secure Payment by Square</p>
              <p className="text-sm text-gray-600">Trusted by millions of businesses worldwide</p>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          Your payment information is protected with industry-standard encryption. 
          Square never stores your card details on our servers.
        </p>
      </div>
    </div>
  );
};

export default SquarePaymentButton;
