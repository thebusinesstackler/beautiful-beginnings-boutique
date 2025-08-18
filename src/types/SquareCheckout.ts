
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

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  uploadedPhoto?: File;
  uploadedPhotoUrl?: string;
  willUploadLater?: boolean;
}

export interface PaymentRequest {
  token: string;
  customerInfo: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  items: CartItem[];
  amount: number;
  breakdown: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  uploadedImages?: string[];
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
  isFormValid?: boolean;
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export type SDKStatus = 'loading' | 'ready' | 'error';
