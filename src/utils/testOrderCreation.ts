import { supabase } from '@/integrations/supabase/client';
import { useOrderCreation } from '@/hooks/useOrderCreation';
import type { CustomerInfo, Address, CartItem } from '@/types/SquareCheckout';

export const createTestOrder = async () => {
  try {
    console.log('Creating test order with product details and images...');

    // Sample customer info
    const customerInfo: CustomerInfo = {
      firstName: 'Test',
      lastName: 'Customer',
      email: 'test@example.com',
      phone: '555-123-4567'
    };

    // Sample addresses
    const shippingAddress: Address = {
      address: '123 Test Street',
      city: 'Cincinnati',
      state: 'OH',
      zipCode: '45202',
      country: 'US'
    };

    const billingAddress: Address = {
      address: '123 Test Street',
      city: 'Cincinnati',
      state: 'OH',
      zipCode: '45202',
      country: 'US'
    };

    // Sample uploaded images
    const uploadedImages = [
      'https://ibdjzzgvxlscmwlbuewd.supabase.co/storage/v1/object/public/customer-uploads/test-image-1.jpg',
      'https://ibdjzzgvxlscmwlbuewd.supabase.co/storage/v1/object/public/customer-uploads/test-image-2.jpg'
    ];

    // Get real products from database
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(3);

    if (productsError || !products || products.length === 0) {
      throw new Error('No products found to create test order');
    }

    console.log('Found products for test order:', products.map(p => ({ id: p.id, name: p.name, price: p.price })));

    // Create cart items using real products
    const items: CartItem[] = [
      {
        id: `cart-item-${Date.now()}-1`,
        product_id: products[0].id, // Real product UUID
        name: products[0].name,
        price: products[0].price,
        quantity: 1,
        image: products[0].image_url || '',
        uploadedPhotoUrl: uploadedImages[0],
        willUploadLater: false
      },
      {
        id: `cart-item-${Date.now()}-2`, 
        product_id: products[1].id, // Real product UUID
        name: products[1].name,
        price: products[1].price,
        quantity: 2,
        image: products[1].image_url || '',
        uploadedPhotoUrl: uploadedImages[1],
        willUploadLater: false
      }
    ];

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.00;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    const amount = Math.round(total * 100); // Convert to cents

    const orderRequest = {
      customerInfo,
      shippingAddress,
      billingAddress,
      items,
      amount,
      breakdown: {
        subtotal,
        shipping,
        tax,
        total
      },
      uploadedImages
    };

    console.log('Test order request created:', {
      ...orderRequest,
      items: orderRequest.items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        hasUploadedPhoto: !!item.uploadedPhotoUrl
      }))
    });

    // Use the order creation hook
    const { createOrder } = useOrderCreation();
    const orderId = await createOrder(orderRequest);

    console.log('✅ Test order created successfully:', orderId);
    
    return {
      success: true,
      orderId,
      message: `Test order ${orderId} created with ${items.length} products and ${uploadedImages.length} uploaded images`
    };

  } catch (error) {
    console.error('❌ Failed to create test order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create test order'
    };
  }
};

// Utility to check order items in database
export const verifyOrderItems = async (orderId: string) => {
  try {
    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select(`
        *,
        products:product_id (
          name,
          image_url,
          price
        )
      `)
      .eq('order_id', orderId);

    if (error) {
      console.error('Error fetching order items:', error);
      return { success: false, error: error.message };
    }

    console.log('Order items verification:', {
      orderId,
      itemCount: orderItems?.length || 0,
      items: orderItems?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        hasPersonalizationData: !!item.personalization_data
      })) || []
    });

    return {
      success: true,
      itemCount: orderItems?.length || 0,
      items: orderItems || []
    };

  } catch (error) {
    console.error('Error verifying order items:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};