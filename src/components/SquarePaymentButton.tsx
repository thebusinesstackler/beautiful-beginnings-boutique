
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Shield, CreditCard } from 'lucide-react';
import type { SDKStatus } from '@/types/SquareCheckout';

interface SquarePaymentButtonProps {
  onPayment: () => void;
  isLoading: boolean;
  hasCard: boolean;
  sdkStatus: SDKStatus;
  isSecureConnection: boolean;
  total: number;
}

const SquarePaymentButton = ({ 
  onPayment, 
  isLoading, 
  hasCard, 
  sdkStatus, 
  isSecureConnection, 
  total 
}: SquarePaymentButtonProps) => {
  const getButtonText = () => {
    if (isLoading) return 'Processing Payment...';
    if (sdkStatus === 'loading') return 'Loading Payment Form...';
    if (sdkStatus === 'error') return 'Payment Form Unavailable';
    if (!isSecureConnection) return 'Secure Connection Required';
    return `Complete Order • $${total.toFixed(2)}`;
  };

  const getButtonIcon = () => {
    if (isLoading) return (
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
    );
    if (sdkStatus === 'ready' && isSecureConnection) return <Lock className="w-5 h-5" />;
    return <CreditCard className="w-5 h-5" />;
  };

  const isDisabled = isLoading || sdkStatus !== 'ready' || !isSecureConnection;

  return (
    <div className="space-y-4">
      {/* Main Payment Button */}
      <Button
        onClick={onPayment}
        disabled={isDisabled}
        className={`w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
          isDisabled 
            ? 'bg-stone/40 text-stone cursor-not-allowed' 
            : 'bg-gradient-to-r from-sage to-forest hover:from-sage/90 hover:to-forest/90 text-white'
        }`}
      >
        <div className="flex items-center justify-center space-x-3">
          {getButtonIcon()}
          <span>{getButtonText()}</span>
        </div>
      </Button>
      
      {/* Status Messages */}
      {sdkStatus === 'loading' && (
        <div className="text-center p-3 bg-sage/5 border border-sage/20 rounded-xl">
          <p className="text-sage text-sm font-medium">Initializing secure payment system...</p>
        </div>
      )}
      
      {sdkStatus === 'error' && (
        <div className="text-center p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 font-medium text-sm">Unable to load payment system</p>
          <p className="text-red-600 text-xs mt-1">Please refresh the page and try again</p>
        </div>
      )}
      
      {!isSecureConnection && (
        <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-800 font-medium text-sm">Secure connection required</p>
          <p className="text-amber-700 text-xs mt-1">HTTPS is required for payment processing</p>
        </div>
      )}

      {/* Trust Indicators */}
      {sdkStatus === 'ready' && isSecureConnection && (
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-6 text-xs text-charcoal/60">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-sage" />
              <span className="font-medium">256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lock className="w-4 h-4 text-sage" />
              <span className="font-medium">PCI Compliant</span>
            </div>
          </div>
          <p className="text-xs text-charcoal/50">
            Powered by Square • Your data is never stored on our servers
          </p>
        </div>
      )}
    </div>
  );
};

export default SquarePaymentButton;
