
import React from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
}

const SquareCardForm = ({ cardRef, sdkStatus, isSecureConnection }: SquareCardFormProps) => {
  return (
    <div className="bg-white rounded-xl border border-sage/20 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-sage/10">
        <h3 className="text-lg font-semibold text-charcoal">Payment</h3>
        <p className="text-sm text-charcoal/60 mt-1">All transactions are secure and encrypted</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {sdkStatus === 'loading' && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
              <p className="text-charcoal/70 font-medium">Setting up secure payment...</p>
              <p className="text-charcoal/50 text-sm mt-1">Please wait a moment</p>
            </div>
          </div>
        )}
        
        {sdkStatus === 'error' && (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-red-700 font-medium mb-2">Payment system temporarily unavailable</h4>
            <p className="text-red-600 text-sm">Please refresh the page and try again</p>
          </div>
        )}
        
        {sdkStatus === 'ready' && (
          <div className="space-y-4">
            {/* Google Pay Button Placeholder */}
            <div className="w-full">
              <button 
                type="button"
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                disabled
              >
                <span className="text-lg">G</span>
                <span>Pay</span>
              </button>
              <p className="text-xs text-charcoal/50 text-center mt-2">Or pay with card</p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sage/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-charcoal/50">or</span>
              </div>
            </div>

            {/* Card Form Container */}
            <div className="space-y-4">
              <div 
                ref={cardRef} 
                id="card-container"
                data-square-container="true"
                className="w-full border border-sage/30 rounded-lg p-4 bg-white min-h-[120px] focus-within:border-sage focus-within:ring-2 focus-within:ring-sage/20 transition-all"
                style={{
                  '--sq-input-background-color': '#ffffff',
                  '--sq-input-border-color': '#e5e7eb',
                  '--sq-input-border-color-focus': '#6b7280',
                  '--sq-input-border-radius': '6px',
                  '--sq-input-font-family': 'system-ui, -apple-system, sans-serif',
                  '--sq-input-font-size': '16px',
                  '--sq-input-font-weight': '400',
                  '--sq-input-line-height': '1.5',
                  '--sq-input-padding': '12px',
                  '--sq-input-text-color': '#374151',
                  '--sq-input-placeholder-color': '#9ca3af'
                } as React.CSSProperties}
              />
            </div>

            {/* Security Message */}
            <div className="flex items-center space-x-2 text-sm text-charcoal/60">
              <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your payment information is protected with SSL encryption</span>
            </div>
          </div>
        )}
        
        {!isSecureConnection && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-amber-800 font-medium text-sm">Secure connection required</p>
                <p className="text-amber-700 text-sm mt-1">HTTPS connection is required for secure payment processing.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SquareCardForm;
