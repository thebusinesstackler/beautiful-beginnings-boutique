import React from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
}

const SquareCardForm = ({ cardRef, sdkStatus, isSecureConnection }: SquareCardFormProps) => {
  return (
    <div className="bg-gradient-to-br from-white to-stone-50/50 backdrop-blur-sm rounded-2xl border border-sage/20 shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-charcoal">Payment Information</h3>
          <p className="text-sm text-charcoal/60">Enter your card details securely</p>
        </div>
      </div>
      
      {/* SDK Status Indicator */}
      {sdkStatus === 'loading' && (
        <div className="relative">
          <div className="flex items-center justify-center min-h-[80px] p-6 border-2 border-dashed border-sage/20 rounded-xl bg-sage/5">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-3"></div>
              <p className="text-charcoal/60 text-sm font-medium">Loading secure payment form...</p>
              <p className="text-charcoal/40 text-xs mt-1">This may take a few seconds</p>
            </div>
          </div>
        </div>
      )}
      
      {sdkStatus === 'error' && (
        <div className="min-h-[80px] p-6 border-2 border-red-200 rounded-xl bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-700 font-medium text-sm">Payment form failed to load</p>
            <p className="text-red-600 text-xs mt-1">Please refresh the page and try again</p>
          </div>
        </div>
      )}
      
      {sdkStatus === 'ready' && (
        <div className="space-y-4">
          <div 
            ref={cardRef} 
            id="card-container"
            data-square-container="true"
            className="min-h-[80px] p-6 border-2 border-stone/15 rounded-xl bg-white shadow-sm transition-all duration-300 hover:border-sage/30 focus-within:border-sage/50 focus-within:shadow-md"
          />
          
          <div className="flex items-center justify-between text-xs text-charcoal/50 bg-stone/5 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Powered by</span>
              <span className="font-semibold text-charcoal/70">Square</span>
            </div>
          </div>
        </div>
      )}
      
      {!isSecureConnection && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="text-amber-800 font-medium text-sm">Secure connection required</p>
            <p className="text-amber-700 text-xs mt-1">HTTPS is required for payment processing</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SquareCardForm;