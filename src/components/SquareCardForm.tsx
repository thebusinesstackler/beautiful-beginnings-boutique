import React from 'react';
import { Lock } from 'lucide-react';
import type { SDKStatus } from '@/types/SquareCheckout';
interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
}
const SquareCardForm = ({
  cardRef,
  sdkStatus,
  isSecureConnection
}: SquareCardFormProps) => {
  return <div style={{
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }} className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
      {/* Header */}
      <div className="py-4 border-b border-gray-100 px-[15px] my-[34px]">
        <div className="flex items-center space-x-2">
          <Lock className="h-4 w-4 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">Your payment information is protected with SSL encryption</p>
      </div>

      {/* Content */}
      <div className="p-6 bg-white py-0 px-0">
        {sdkStatus === 'loading' && <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">Setting up secure payment...</p>
              <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
            </div>
          </div>}
        
        {sdkStatus === 'error' && <div className="py-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-red-700 font-medium mb-2">Payment system temporarily unavailable</h4>
            <p className="text-red-600 text-sm">Please refresh the page and try again</p>
          </div>}
        
        {sdkStatus === 'ready' && <div className="space-y-6">
            {/* Card Form Container */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 mx-[25px]">
                Card Information
              </label>
              <div ref={cardRef} id="card-container" data-square-container="true" style={{
            backgroundColor: '#f9f9f9',
            '--sq-input-background-color': '#f9f9f9',
            '--sq-input-border-color': 'transparent',
            '--sq-input-border-color-focus': 'transparent',
            '--sq-input-border-radius': '6px',
            '--sq-input-font-family': 'Inter, system-ui, -apple-system, sans-serif',
            '--sq-input-font-size': '16px',
            '--sq-input-font-weight': '400',
            '--sq-input-line-height': '1.5',
            '--sq-input-padding': '12px',
            '--sq-input-text-color': '#374151',
            '--sq-input-placeholder-color': '#9ca3af'
          } as React.CSSProperties} className="w-full border border-gray-300 rounded-lg p-4 min-h-[120px] transition-all-blue-600 focus-within:ring-2 focus-within:ring-blue-100 px-0 py-0" />
            </div>
          </div>}
        
        {!isSecureConnection && <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-amber-800 font-medium text-sm">Secure connection required</p>
                <p className="text-amber-700 text-sm mt-1">HTTPS connection is required for secure payment processing.</p>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
export default SquareCardForm;