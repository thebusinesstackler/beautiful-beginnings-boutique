
import React from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
}

const SquareCardForm = ({ cardRef, sdkStatus, isSecureConnection }: SquareCardFormProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Payment method</h3>
            <p className="text-sm text-gray-500 mt-1">All transactions are secure and encrypted</p>
          </div>
          <div className="flex items-center space-x-2">
            <img src="https://logos-world.net/wp-content/uploads/2020/09/Visa-Logo.png" alt="Visa" className="h-6" />
            <img src="https://logoeps.com/wp-content/uploads/2013/03/mastercard-vector-logo.png" alt="Mastercard" className="h-6" />
            <img src="https://logos-world.net/wp-content/uploads/2020/09/American-Express-Logo.png" alt="Amex" className="h-6" />
            <img src="https://logos-world.net/wp-content/uploads/2020/09/Discover-Logo.png" alt="Discover" className="h-6" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* SDK Status Sections */}
        {sdkStatus === 'loading' && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Setting up secure payment...</p>
              <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
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
          <div className="space-y-6">
            {/* Card Form Container */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Card information
              </label>
              <div className="relative">
                <div 
                  ref={cardRef} 
                  id="card-container"
                  className="w-full p-4 border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors"
                  style={{
                    minHeight: '56px',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>

            {/* Billing Address Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-blue-800 text-sm font-medium">Billing address</p>
                  <p className="text-blue-700 text-sm mt-1">Your billing address will be the same as your shipping address.</p>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="flex-1">
                  <p className="text-green-800 text-sm font-medium">Your payment is secure</p>
                  <p className="text-green-700 text-sm">We use SSL encryption to protect your card information.</p>
                </div>
                <div className="text-green-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Security Warning for Non-HTTPS */}
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
