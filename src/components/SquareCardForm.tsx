import React from 'react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
}

const SquareCardForm = ({ cardRef, sdkStatus, isSecureConnection }: SquareCardFormProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-sage/10 p-6">
      <h3 className="text-lg font-semibold text-charcoal mb-4">Payment Information</h3>
      
      {/* SDK Status Indicator */}
      {sdkStatus === 'loading' && (
        <div className="flex items-center justify-center min-h-[60px] p-4 border border-stone/20 rounded-lg bg-white">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-sage border-t-transparent mr-3"></div>
          <span className="text-charcoal/60">Loading payment form...</span>
        </div>
      )}
      
      {sdkStatus === 'error' && (
        <div className="min-h-[60px] p-4 border border-red-200 rounded-lg bg-red-50 flex items-center justify-center">
          <span className="text-red-700">Payment form failed to load. Please refresh the page.</span>
        </div>
      )}
      
      {sdkStatus === 'ready' && (
        <div 
          ref={cardRef} 
          id="card-container"
          data-square-container="true"
          className="min-h-[60px] p-4 border border-stone/20 rounded-lg bg-white transition-opacity duration-300"
        />
      )}
      
      {!isSecureConnection && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
          ⚠️ Secure connection (HTTPS) required for payment processing
        </div>
      )}
    </div>
  );
};

export default SquareCardForm;