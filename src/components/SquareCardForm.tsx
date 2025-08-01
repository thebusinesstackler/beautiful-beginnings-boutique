
import React from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
  squareEnvironment?: string;
}

const SquareCardForm = ({
  cardRef,
  sdkStatus,
  isSecureConnection,
  squareEnvironment = 'sandbox'
}: SquareCardFormProps) => {
  return (
    <div className="bg-gradient-to-br from-cream via-pearl to-cream/50 rounded-2xl border border-sage/20 shadow-lg overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-sage/5 to-forest/5 border-b border-sage/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-charcoal font-playfair">Payment Information</h3>
            <p className="text-stone mt-2 text-base">Your transaction is protected with bank-level security</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Card Type Icons */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center font-bold">
                VISA
              </div>
              <div className="w-10 h-6 bg-gradient-to-r from-red-600 to-orange-600 rounded text-white text-xs flex items-center justify-center font-bold">
                MC
              </div>
              <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                AMEX
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Test Card Numbers Guide for Sandbox */}
        {squareEnvironment === 'sandbox' && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-800 font-playfair mb-2">Test Mode - Use These Card Numbers</h4>
                <p className="text-blue-700 text-sm mb-3">Since this is a test environment, please use one of these valid test card numbers:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                    <div className="font-mono font-bold text-blue-900">4111 1111 1111 1111</div>
                    <div className="text-blue-600 text-xs">Visa - Successful Payment</div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
                    <div className="font-mono font-bold text-blue-900">5555 5555 5555 4444</div>
                    <div className="text-blue-600 text-xs">Mastercard - Successful Payment</div>
                  </div>
                </div>
                <p className="text-blue-600 text-xs mt-2">Use any future expiration date and any 3-digit CVV</p>
              </div>
            </div>
          </div>
        )}

        {sdkStatus === 'loading' && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-sage/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h4 className="text-xl font-semibold text-charcoal mb-2 font-playfair">Setting up secure payment</h4>
              <p className="text-stone">Connecting to encrypted payment gateway...</p>
            </div>
          </div>
        )}
        
        {sdkStatus === 'error' && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-red-700 mb-3 font-playfair">Payment system temporarily unavailable</h4>
            <p className="text-red-600 max-w-md mx-auto leading-relaxed">
              We're experiencing technical difficulties. Please refresh the page and try again, or contact support if the issue persists.
            </p>
          </div>
        )}
        
        {sdkStatus === 'ready' && (
          <div className="space-y-8">
            {/* Card Form Container */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-lg font-medium text-charcoal font-playfair">
                  Card Information
                </label>
                <div className="flex items-center text-sage text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  256-bit encrypted
                </div>
              </div>
              
              <div className="relative">
                <div 
                  ref={cardRef} 
                  id="card-container" 
                  data-square-container="true" 
                  className="w-full border-2 border-sage/30 rounded-xl p-4 bg-white/80 backdrop-blur-sm min-h-[70px] transition-all duration-300 hover:border-sage/50 focus-within:border-sage focus-within:ring-4 focus-within:ring-sage/10 shadow-sm hover:shadow-md" 
                />
                
                {/* Floating elements for visual interest */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-sage/20 to-forest/20 rounded-full blur-sm"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-cream to-pearl rounded-full blur-md opacity-60"></div>
              </div>
            </div>

            {/* Enhanced Security Message */}
            <div className="relative bg-gradient-to-r from-sage/5 via-forest/5 to-sage/5 border border-sage/20 rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-sage to-forest rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-charcoal font-playfair mb-2">Your payment is completely secure</h4>
                  <p className="text-stone leading-relaxed">
                    {squareEnvironment === 'production' 
                      ? 'We protect your financial information with military-grade SSL encryption and maintain PCI DSS Level 1 compliance - the highest security standard in the payments industry.'
                      : 'Your card information is protected with bank-level SSL encryption and never stored on our servers.'
                    }
                  </p>
                  
                  {squareEnvironment === 'production' && (
                    <div className="flex items-center mt-3 space-x-4 text-sm text-sage">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        PCI DSS Level 1
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        256-bit SSL
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Fraud Protection
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Decorative background elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-sage/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-2 left-8 w-16 h-16 bg-forest/5 rounded-full blur-xl"></div>
            </div>
          </div>
        )}
        
        {!isSecureConnection && (
          <div className="mt-8 relative bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-amber-800 font-playfair mb-2">Secure connection required</h4>
                <p className="text-amber-700 leading-relaxed">
                  An HTTPS connection is required for secure payment processing. Please ensure you're accessing this page through a secure connection.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SquareCardForm;
