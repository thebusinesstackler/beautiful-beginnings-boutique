
import React, { memo } from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
  squareEnvironment?: string;
}

const SquareCardForm = memo(({
  cardRef,
  sdkStatus,
  isSecureConnection,
  squareEnvironment
}: SquareCardFormProps) => {
  
  return (
    <div className="bg-white rounded-xl border border-sage/20 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-sage/10">
        <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
        <p className="text-sm text-gray-600 mt-1">Enter your card details below</p>
      </div>

      {/* Content */}
      <div className="p-6">

        {sdkStatus === 'loading' && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading payment form...</p>
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
            <h4 className="text-red-700 font-medium mb-2">Payment system unavailable</h4>
            <p className="text-red-600 text-sm">Please refresh the page and try again</p>
          </div>
        )}
        
        {sdkStatus === 'ready' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div 
                ref={cardRef} 
                id="card-container"
                className="w-full border border-gray-300 rounded-lg p-4 bg-white min-h-[80px] focus-within:border-sage focus-within:ring-1 focus-within:ring-sage transition-colors" 
              />
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
                <p className="text-amber-700 text-sm mt-1">HTTPS connection is required for payment processing.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default SquareCardForm;
