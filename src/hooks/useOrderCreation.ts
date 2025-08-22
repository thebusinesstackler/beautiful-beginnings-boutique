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
        
        // Validate cart items structure and create order items
        const validItems = [];
        for (const item of orderRequest.items) {
          console.log('Processing cart item:', {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            product_id: item.product_id,
            id: item.id,
            uploadedPhotoUrl: item.uploadedPhotoUrl
          });

          // Check required fields - be more lenient with validation
          if (!item.name || item.price === undefined || item.price === null || !item.quantity) {
            console.warn('Skipping invalid cart item - missing required fields:', item);
            continue;
          }

          // Ensure price is a number
          let itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
          if (isNaN(itemPrice)) {
            console.warn('Skipping cart item with invalid price:', item);
            continue;
          }
          
          // Use product_id if available, otherwise use id as fallback
          const productId = item.product_id || item.id;
          if (!productId) {
            console.warn('Skipping cart item without product_id or id:', item);
            continue;
          }
          
          const orderItem = {
            order_id: order.id,
            product_id: productId,
            product_name: item.name,
            product_image: item.image || null,
            quantity: item.quantity,
            price: itemPrice,
            personalization_data: item.uploadedPhotoUrl ? { 
              uploadedPhotoUrl: item.uploadedPhotoUrl, 
              willUploadLater: item.willUploadLater || false 
            } : null
          };
          
          console.log('Valid order item created:', orderItem);
          validItems.push(orderItem);
        }
        
        console.log('Attempting to insert', validItems.length, 'valid items');

        if (validItems.length > 0) {
          const { data: insertedItems, error: itemsError } = await supabase
            .from('order_items')
            .insert(validItems)
            .select();

          if (itemsError) {
            console.error('❌ Error creating order items:', itemsError);
            console.error('Failed order items data:', validItems);
            console.error('Error details:', {
              code: itemsError.code,
              message: itemsError.message,
              details: itemsError.details,
              hint: itemsError.hint
            });
            
            // Try to update order with error status but don't fail the whole process
            await supabase
              .from('orders')
              .update({ 
                notes: `Order created but failed to save ${validItems.length} items. Error: ${itemsError.message}` 
              })
              .eq('id', order.id);
              
          } else {
            console.log('✅ Successfully created', insertedItems?.length || 0, 'order items');
            
            // Update order with success info
            await supabase
              .from('orders')
              .update({ 
                notes: `Order created successfully with ${insertedItems?.length || 0} items` 
              })
              .eq('id', order.id);
          }
        } else {
          console.warn('⚠️ No valid items to insert for order', order.id);
          
          // Update order to note the issue
          await supabase
            .from('orders')
            .update({ 
              notes: 'Order created but no valid items could be processed from cart data' 
            })
            .eq('id', order.id);
        }
      } else {
        console.warn('⚠️ No items provided in order request');
      }

      return order.id;
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  };

  return { createOrder };
};