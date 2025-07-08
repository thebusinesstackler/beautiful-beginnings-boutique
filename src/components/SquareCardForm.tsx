
import React from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
}

const SquareCardForm = ({ cardRef, sdkStatus, isSecureConnection }: SquareCardFormProps) => {
  return (
    <div className="bg-white rounded-xl border border-stone/20 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-sage/10 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-charcoal">Payment Information</h3>
          <p className="text-sm text-stone">Enter your card details</p>
        </div>
      </div>
      
      {/* SDK Status Indicator */}
      {sdkStatus === 'loading' && (
        <div className="flex items-center justify-center min-h-[60px] p-4 border border-stone/20 rounded-lg bg-sage/5">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-sage border-t-transparent mx-auto mb-2"></div>
            <p className="text-stone text-sm">Loading payment form...</p>
          </div>
        </div>
      )}
      
      {sdkStatus === 'error' && (
        <div className="min-h-[60px] p-4 border border-red-200 rounded-lg bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-700 font-medium text-sm">Payment form failed to load</p>
            <p className="text-red-600 text-xs mt-1">Please refresh and try again</p>
          </div>
        </div>
      )}
      
      {sdkStatus === 'ready' && (
        <div className="space-y-3">
          <div 
            ref={cardRef} 
            id="card-container"
            className="min-h-[60px] p-4 border border-stone/30 rounded-lg bg-white transition-colors focus-within:border-sage/50"
            style={{
              minHeight: '60px',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid hsl(0 0% 80%)',
              backgroundColor: 'white'
            }}
          />
          
          <div className="flex items-center justify-between text-xs text-stone bg-sage/5 rounded-lg p-2">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>SSL Secured</span>
            </div>
            <span className="font-medium text-charcoal/70">Powered by Square</span>
          </div>
        </div>
      )}
      
      {!isSecureConnection && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="text-amber-800 font-medium text-sm">Secure connection required</p>
            <p className="text-amber-700 text-xs">HTTPS is required for payments</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SquareCardForm;
