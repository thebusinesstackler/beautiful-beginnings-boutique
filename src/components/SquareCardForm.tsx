
import React from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
}

const SquareCardForm = ({ cardRef, sdkStatus, isSecureConnection }: SquareCardFormProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
      {/* Square Branded Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.01 6.03l7.51 3.22-7.52-8.21L4.01 6.03zm7.52 8.21L4.02 17.46 4 12.47l7.53 1.77zm0-4.67L4.02 6.75 4 11.53l7.53-2.96zm7.51-8.21l-7.52 8.21 7.51-3.22-.01-4.99zm0 9.67l-7.51 3.22 7.52 8.21-.01-11.43zm-7.52-1.77L18.02 6.03 18 1.04l-7.48 8.22z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Secure Payment</h3>
              <p className="text-blue-100 text-sm">Powered by Square</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-blue-100 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {sdkStatus === 'loading' && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Setting up secure payment</h4>
              <p className="text-gray-600">Connecting to Square's secure servers...</p>
            </div>
          </div>
        )}
        
        {sdkStatus === 'error' && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-red-700 mb-2">Payment system temporarily unavailable</h4>
            <p className="text-red-600 mb-4">We're working to restore service quickly</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Try again
            </button>
          </div>
        )}
        
        {sdkStatus === 'ready' && (
          <div className="space-y-8">
            {/* Payment Methods Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Payment Method</h4>
              <div className="flex items-center space-x-2">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iIzAwNTFBNSIvPgo8cGF0aCBkPSJNMTMuMzc5NiAxNC44NDQ4SDExLjMxMzNMMTIuNjI4OSA2LjI1SDE0LjY5NTJMMTMuMzc5NiAxNC44NDQ4WiIgZmlsbD0id2hpdGUiLz4KPHA+" alt="Visa" className="w-8 h-5" />
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI3IiBmaWxsPSIjRkY1RjAwIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMTAiIHI9IjciIGZpbGw9IiNGRkY1RjAiLz4KPC9zdmc+" alt="Mastercard" className="w-8 h-5" />
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iIzAwNjFBNyIvPgo8cGF0aCBkPSJNOC41IDZIMjMuNUMyNC4zIDYgMjUgNi43IDI1IDcuNVYxMi41QzI1IDEzLjMgMjQuMyAxNCAyMy41IDE0SDguNUM3LjcgMTQgNyAxMy4zIDcgMTIuNVY3LjVDNyA2LjcgNy43IDYgOC41IDZaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjAuNSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=" alt="American Express" className="w-8 h-5" />
                <span className="text-xs text-gray-500 ml-2">+ more</span>
              </div>
            </div>

            {/* Square Card Form Container */}
            <div className="space-y-4">
              <div 
                ref={cardRef} 
                id="card-container"
                data-square-container="true"
                className="w-full border-2 border-gray-200 rounded-xl p-6 bg-gray-50/50 hover:border-blue-300 transition-colors duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 min-h-[80px] flex items-center"
                style={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              />
              
              {/* Security Features */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">PCI DSS Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm font-medium">End-to-end encrypted</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Powered by Square
                </div>
              </div>
            </div>

            {/* Collapsible Test Information (for sandbox only) */}
            <details className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
              <summary className="px-6 py-4 cursor-pointer bg-blue-100 hover:bg-blue-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="font-semibold text-blue-800">Test Card Numbers</span>
                    <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full">Sandbox Mode</span>
                  </div>
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-6 py-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span className="font-mono text-sm">4111 1111 1111 1111</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Success</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span className="font-mono text-sm">4000 0000 0000 0002</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Declined</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span className="font-mono text-sm">4000 0000 0000 9995</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Insufficient Funds</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span className="font-mono text-sm">4000 0000 0000 0069</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Expired</span>
                  </div>
                </div>
                <p className="text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
                  <strong>For testing:</strong> Use any future expiration date (e.g., 12/25) and any 3-digit CVV (e.g., 123)
                </p>
              </div>
            </details>

            {/* Trust Indicators */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-green-800 mb-2">Your payment is protected</h5>
                  <p className="text-green-700 text-sm leading-relaxed">
                    Square's advanced fraud protection and PCI Level 1 compliance ensure your payment information is secure. 
                    Your card details are encrypted and never stored on our servers.
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-1 text-green-600 text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      <span>Monitored 24/7</span>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600 text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                      <span>Bank-level security</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!isSecureConnection && (
          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h5 className="text-lg font-semibold text-amber-800 mb-2">Secure connection required</h5>
                <p className="text-amber-700 text-sm">HTTPS connection is required for secure payment processing. Please ensure you're using a secure connection.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SquareCardForm;
