import { supabase } from '@/integrations/supabase/client';
import type { CustomerInfo, Address, CartItem } from '@/types/SquareCheckout';

interface OrderCreationRequest {
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

export const useOrderCreation = () => {
  const createOrder = async (orderRequest: OrderCreationRequest): Promise<string> => {
    try {
      // Always use guest checkout (customer_id = NULL) since users aren't logged in
      const customerId = null;

      // Create order in database
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId, // NULL for guest users, auth.uid() for authenticated users
          customer_email: orderRequest.customerInfo.email,
          customer_name: `${orderRequest.customerInfo.firstName} ${orderRequest.customerInfo.lastName}`,
          customer_phone: orderRequest.customerInfo.phone || null,
          total_amount: orderRequest.amount / 100, // Convert cents to dollars
          status: 'pending',
          shipping_address: {
            address: orderRequest.shippingAddress.address,
            city: orderRequest.shippingAddress.city,
            state: orderRequest.shippingAddress.state,
            zipCode: orderRequest.shippingAddress.zipCode,
            country: orderRequest.shippingAddress.country
          },
          billing_address: {
            address: orderRequest.billingAddress.address,
            city: orderRequest.billingAddress.city,
            state: orderRequest.billingAddress.state,
            zipCode: orderRequest.billingAddress.zipCode,
            country: orderRequest.billingAddress.country
          },
          uploaded_images: orderRequest.uploadedImages || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
      }

      // Create order items
      if (orderRequest.items && orderRequest.items.length > 0) {
        const orderItems = orderRequest.items.map((item: any) => ({
          order_id: order.id,
          product_id: item.product_id || item.id, // Use product_id first, fallback to id
          product_name: item.name,
          product_image: item.image,
          quantity: item.quantity,
          price: item.price,
          personalization_data: item.uploadedPhotoUrl ? { uploadedPhotoUrl: item.uploadedPhotoUrl, willUploadLater: item.willUploadLater || false } : null
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Error creating order items:', itemsError);
          // Don't throw here as the order is already created
        }
      }

      return order.id;
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  };

  return { createOrder };
};