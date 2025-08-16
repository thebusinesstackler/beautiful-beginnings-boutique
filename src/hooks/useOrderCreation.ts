import { supabase } from '@/integrations/supabase/client';
import type { PaymentRequest } from '@/types/SquareCheckout';

export const useOrderCreation = () => {
  const createOrder = async (paymentRequest: PaymentRequest): Promise<string> => {
    try {
      // Get the current authenticated user (optional for guest checkout)
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // For guest checkout, user can be null
      // For authenticated users, use their ID as customer_id
      const customerId = user?.id || null;

      // Create order in database
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId, // NULL for guest users, auth.uid() for authenticated users
          customer_email: paymentRequest.customerInfo.email,
          customer_name: `${paymentRequest.customerInfo.firstName} ${paymentRequest.customerInfo.lastName}`,
          customer_phone: paymentRequest.customerInfo.phone || null,
          total_amount: paymentRequest.amount / 100, // Convert cents to dollars
          status: 'pending',
          shipping_address: {
            address: paymentRequest.shippingAddress.address,
            city: paymentRequest.shippingAddress.city,
            state: paymentRequest.shippingAddress.state,
            zipCode: paymentRequest.shippingAddress.zipCode,
            country: paymentRequest.shippingAddress.country
          },
          billing_address: {
            address: paymentRequest.billingAddress.address,
            city: paymentRequest.billingAddress.city,
            state: paymentRequest.billingAddress.state,
            zipCode: paymentRequest.billingAddress.zipCode,
            country: paymentRequest.billingAddress.country
          },
          uploaded_images: paymentRequest.uploadedImages || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
      }

      // Create order items
      if (paymentRequest.items && paymentRequest.items.length > 0) {
        const orderItems = paymentRequest.items.map((item: any) => ({
          order_id: order.id,
          product_id: item.id,
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