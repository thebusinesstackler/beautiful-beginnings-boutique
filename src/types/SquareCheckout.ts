export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmbeddedSquareCheckoutProps {
  customerInfo: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  sameAsShipping: boolean;
  total: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';
export type SDKStatus = 'loading' | 'ready' | 'error';

export interface PaymentBreakdown {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface SquareCredentials {
  appId: string;
  accessToken: string;
  environment: string;
  locationId: string;
}

export interface PaymentRequest {
  token: string;
  customerInfo: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  items: any[];
  amount: number;
  breakdown: PaymentBreakdown;
  squareCredentials: SquareCredentials;
}