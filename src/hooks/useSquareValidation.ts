import { useState } from 'react';
import type { CustomerInfo, Address } from '@/types/SquareCheckout';

interface UseSquareValidationProps {
  customerInfo: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  sameAsShipping: boolean;
  items: any[];
}

export const useSquareValidation = ({
  customerInfo,
  shippingAddress,
  billingAddress,
  sameAsShipping,
  items
}: UseSquareValidationProps) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = () => {
    const errors: string[] = [];

    // Customer info validation
    if (!customerInfo.firstName?.trim()) errors.push("First name is required");
    if (!customerInfo.lastName?.trim()) errors.push("Last name is required");
    if (!customerInfo.email?.trim()) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.push("Please enter a valid email address");
    }
    if (!customerInfo.phone?.trim()) errors.push("Phone number is required");

    // Shipping address validation
    if (!shippingAddress.address?.trim()) errors.push("Shipping address is required");
    if (!shippingAddress.city?.trim()) errors.push("City is required");
    if (!shippingAddress.state?.trim()) errors.push("State is required");
    if (!shippingAddress.zipCode?.trim()) errors.push("ZIP code is required");
    else if (!/^\d{5}(-\d{4})?$/.test(shippingAddress.zipCode)) {
      errors.push("Please enter a valid ZIP code (e.g., 12345 or 12345-6789)");
    }

    // Billing address validation (if different from shipping)
    if (!sameAsShipping) {
      if (!billingAddress.address?.trim()) errors.push("Billing address is required");
      if (!billingAddress.city?.trim()) errors.push("Billing city is required");
      if (!billingAddress.state?.trim()) errors.push("Billing state is required");
      if (!billingAddress.zipCode?.trim()) errors.push("Billing ZIP code is required");
      else if (!/^\d{5}(-\d{4})?$/.test(billingAddress.zipCode)) {
        errors.push("Please enter a valid billing ZIP code");
      }
    }

    // Cart validation
    if (items.length === 0) errors.push("Your cart is empty");

    setValidationErrors(errors);
    return errors.length === 0;
  };

  return {
    validationErrors,
    validateForm
  };
};