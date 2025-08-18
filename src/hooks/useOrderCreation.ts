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
      // Get current user session to determine if guest or authenticated
      const { data: { user } } = await supabase.auth.getUser();
      const customerId = user ? user.id : null;
      
      console.log('Creating order for:', customerId ? 'authenticated user' : 'guest user');
      console.log('Order request:', { ...orderRequest, uploadedImages: orderRequest.uploadedImages?.length || 0 });

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
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Failed to create order: ${error.message}`);
      }

      console.log('Order created successfully:', order.id);

      // Validate and create order items
      if (orderRequest.items && orderRequest.items.length > 0) {
        console.log('Processing', orderRequest.items.length, 'cart items');
        
        // Validate cart items structure
        const validItems = [];
        for (const item of orderRequest.items) {
          if (!item.name || !item.price || !item.quantity) {
            console.warn('Skipping invalid cart item:', item);
            continue;
          }
          
          if (!item.product_id && !item.id) {
            console.warn('Cart item missing product_id and id:', item);
            continue;
          }
          
          validItems.push({
            order_id: order.id,
            product_id: item.product_id || item.id,
            product_name: item.name,
            product_image: item.image,
            quantity: item.quantity,
            price: item.price,
            personalization_data: item.uploadedPhotoUrl ? { 
              uploadedPhotoUrl: item.uploadedPhotoUrl, 
              willUploadLater: item.willUploadLater || false 
            } : null
          });
        }
        
        console.log('Valid items to insert:', validItems.length);

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(validItems);

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