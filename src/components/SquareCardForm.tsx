
import React from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
}

const SquareCardForm = ({ cardRef, sdkStatus, isSecureConnection }: SquareCardFormProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Information</h3>
        <p className="text-sm text-gray-600">Enter your card details below</p>
      </div>
      
      {/* SDK Status Sections */}
      {sdkStatus === 'loading' && (
        <div className="flex items-center justify-center min-h-[120px] p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-600 font-medium">Loading payment form...</p>
            <p className="text-gray-500 text-sm mt-1">Please wait</p>
          </div>
        </div>
      )}
      
      {sdkStatus === 'error' && (
        <div className="min-h-[120px] p-6 border-2 border-red-200 rounded-lg bg-red-50 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-700 font-semibold text-sm mb-2">Payment System Unavailable</p>
            <p className="text-red-600 text-xs">Unable to load payment form. Please refresh the page.</p>
          </div>
        </div>
      )}
      
      {sdkStatus === 'ready' && (
        <div className="space-y-4">
          {/* Simple Card Container */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div 
              ref={cardRef} 
              id="card-container"
              className="min-h-[80px] p-4 border border-gray-300 rounded-lg bg-white"
              style={{
                minHeight: '80px',
                padding: '16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}
            />
          </div>
          
          {/* Security Note */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">Secure Payment Processing</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Security Warning for Non-HTTPS */}
      {!isSecureConnection && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="text-amber-800 font-semibold text-sm">Secure Connection Required</p>
            <p className="text-amber-700 text-xs mt-1">HTTPS connection is required for payment processing.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SquareCardForm;
