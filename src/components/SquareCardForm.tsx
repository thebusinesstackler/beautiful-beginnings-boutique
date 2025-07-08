
import React from 'react';
import { CreditCard, Shield, Lock } from 'lucide-react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquareCardFormProps {
  cardRef: React.RefObject<HTMLDivElement>;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
}

const SquareCardForm = ({ cardRef, sdkStatus, isSecureConnection }: SquareCardFormProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sage/10 to-forest/10 px-6 py-4 border-b border-sage/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">4</div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal font-playfair">Payment Details</h3>
              <p className="text-sm text-charcoal/60 flex items-center mt-1">
                <Shield className="h-3 w-3 mr-1" />
                Secure & encrypted
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <img src="https://logos-world.net/wp-content/uploads/2020/09/Visa-Logo.png" alt="Visa" className="h-5 opacity-60" />
            <img src="https://logoeps.com/wp-content/uploads/2013/03/mastercard-vector-logo.png" alt="Mastercard" className="h-5 opacity-60" />
            <img src="https://logos-world.net/wp-content/uploads/2020/09/American-Express-Logo.png" alt="Amex" className="h-5 opacity-60" />
            <img src="https://logos-world.net/wp-content/uploads/2020/09/Discover-Logo.png" alt="Discover" className="h-5 opacity-60" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {sdkStatus === 'loading' && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-sage/20 border-t-sage mx-auto mb-4"></div>
                <CreditCard className="h-6 w-6 text-sage absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-charcoal font-medium text-lg">Setting up secure payment</p>
              <p className="text-charcoal/60 text-sm mt-1">Please wait a moment...</p>
            </div>
          </div>
        )}
        
        {sdkStatus === 'error' && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-red-700 font-semibold text-lg mb-2">Payment system temporarily unavailable</h4>
            <p className="text-red-600 text-sm">Please refresh the page and try again</p>
          </div>
        )}
        
        {sdkStatus === 'ready' && (
          <div className="space-y-6">
            {/* Card Form Container */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-3 flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-sage" />
                Card Information
              </label>
              <div 
                ref={cardRef} 
                id="card-container"
                data-square-container="true"
                className="w-full border-2 border-sage/20 rounded-xl p-4 bg-white min-h-[60px] focus-within:border-sage transition-colors"
              />
            </div>

            {/* Security Message */}
            <div className="bg-sage/5 border border-sage/20 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Lock className="w-5 h-5 text-sage mt-0.5" />
                </div>
                <div className="flex-1">
                  <p className="text-sage font-semibold text-sm">Your payment is secure</p>
                  <p className="text-sage/80 text-sm mt-1">
                    We protect your card information with SSL encryption and never store your payment details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!isSecureConnection && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
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
