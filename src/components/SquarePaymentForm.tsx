import React from 'react';
import { useSquareSDK } from '@/hooks/useSquareSDK';
import EmbeddedSquareCheckout from './EmbeddedSquareCheckout';
import type { EmbeddedSquareCheckoutProps } from '@/types/SquareCheckout';

const SquarePaymentForm = (props: EmbeddedSquareCheckoutProps) => {
  const { cardRef, card, sdkStatus, isSecureConnection, squareEnvironment } = useSquareSDK({});

  return (
    <EmbeddedSquareCheckout
      {...props}
      cardRef={cardRef}
      card={card}
      sdkStatus={sdkStatus}
      isSecureConnection={isSecureConnection}
      squareEnvironment={squareEnvironment}
    />
  );
};

export default SquarePaymentForm;