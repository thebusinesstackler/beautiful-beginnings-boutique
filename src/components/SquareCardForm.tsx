
import React from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
}

const SquareCardForm = ({ cardRef, sdkStatus, isSecureConnection }: SquareCardFormProps) => {
  return (
    <div className="bg-white rounded-xl border-2 border-sage/20 shadow-lg p-6">
      {/* Enhanced Header with Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage/15 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-charcoal">Payment Information</h3>
            <p className="text-sm text-stone">Secure payment processing</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {sdkStatus === 'ready' && (
            <div className="flex items-center gap-1 text-sage text-sm font-medium">
              <div className="w-2 h-2 bg-sage rounded-full animate-pulse"></div>
              Ready
            </div>
          )}
          {sdkStatus === 'loading' && (
            <div className="flex items-center gap-1 text-stone text-sm">
              <div className="w-2 h-2 bg-stone rounded-full animate-pulse"></div>
              Loading
            </div>
          )}
          {sdkStatus === 'error' && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Error
            </div>
          )}
        </div>
      </div>
      
      {/* SDK Status Sections */}
      {sdkStatus === 'loading' && (
        <div className="flex items-center justify-center min-h-[120px] p-6 border-2 border-dashed border-sage/30 rounded-xl bg-sage/5">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-sage border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-3 border-sage/20"></div>
            </div>
            <p className="text-stone font-medium">Initializing secure payment form...</p>
            <p className="text-stone/70 text-sm mt-1">This may take a few moments</p>
          </div>
        </div>
      )}
      
      {sdkStatus === 'error' && (
        <div className="min-h-[120px] p-6 border-2 border-red-200 rounded-xl bg-red-50 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-700 font-semibold text-sm mb-2">Payment System Unavailable</p>
            <p className="text-red-600 text-xs leading-relaxed">
              Unable to load secure payment form. Please refresh the page or try again in a few moments.
            </p>
          </div>
        </div>
      )}
      
      {sdkStatus === 'ready' && (
        <div className="space-y-4">
          {/* Enhanced Card Container */}
          <div className="relative">
            <div 
              ref={cardRef} 
              id="card-container"
              className="square-card-container min-h-[120px] p-5 border-2 border-sage/40 rounded-xl bg-white transition-all duration-300 focus-within:border-sage focus-within:ring-4 focus-within:ring-sage/10 hover:border-sage/60"
              style={{
                minHeight: '120px',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid hsl(140 20% 65%)',
                backgroundColor: 'white',
                position: 'relative'
              }}
            />
            
            {/* Floating Label */}
            <div className="absolute -top-2 left-4 px-2 bg-white text-xs font-medium text-sage">
              Card Details
            </div>
          </div>
          
          {/* Enhanced Security Indicators */}
          <div className="bg-sage/8 border border-sage/20 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2 text-sage">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-medium">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sage">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">PCI DSS Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sage">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium">Instant Processing</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal/70">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="font-medium">Powered by Square</span>
              </div>
            </div>
          </div>
          
          {/* Payment Methods Accepted */}
          <div className="text-center py-2">
            <p className="text-xs text-stone mb-2 font-medium">Accepted Payment Methods</p>
            <div className="flex justify-center items-center gap-3">
              <div className="px-3 py-1 bg-stone/10 rounded text-xs font-medium text-stone">Visa</div>
              <div className="px-3 py-1 bg-stone/10 rounded text-xs font-medium text-stone">Mastercard</div>
              <div className="px-3 py-1 bg-stone/10 rounded text-xs font-medium text-stone">Amex</div>
              <div className="px-3 py-1 bg-stone/10 rounded text-xs font-medium text-stone">Discover</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Security Warning for Non-HTTPS */}
      {!isSecureConnection && (
        <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="text-amber-800 font-semibold text-sm">Secure Connection Required</p>
            <p className="text-amber-700 text-xs mt-1 leading-relaxed">
              HTTPS connection is required for secure payment processing. Please ensure you're using a secure connection.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SquareCardForm;
