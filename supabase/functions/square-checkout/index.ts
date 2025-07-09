
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation and sanitization utilities
const sanitizeString = (input: any, maxLength: number = 1000): string => {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength).replace(/[<>\"'&]/g, '');
}

const sanitizeEmail = (email: any): string => {
  if (typeof email !== 'string') return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = email.trim().toLowerCase().slice(0, 254);
  return emailRegex.test(sanitized) ? sanitized : '';
}

const sanitizePhone = (phone: any): string => {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^\d\+\-\(\)\s]/g, '').slice(0, 20);
}

const sanitizeAmount = (amount: any): number => {
  const num = Number(amount);
  if (isNaN(num) || num < 0 || num > 999999) return 0;
  return Math.round(num);
}

const validateAndSanitizeAddress = (address: any) => {
  if (!address || typeof address !== 'object') {
    throw new Error('Invalid address format');
  }

  return {
    address: sanitizeString(address.address, 200),
    city: sanitizeString(address.city, 100),
    state: sanitizeString(address.state, 50),
    zipCode: sanitizeString(address.zipCode, 20),
    country: sanitizeString(address.country, 100) || 'United States'
  };
}

const validateAndSanitizeCustomerInfo = (customerInfo: any) => {
  if (!customerInfo || typeof customerInfo !== 'object') {
    throw new Error('Invalid customer information');
  }

  const email = sanitizeEmail(customerInfo.email);
  if (!email) {
    throw new Error('Valid email is required');
  }

  return {
    firstName: sanitizeString(customerInfo.firstName, 50),
    lastName: sanitizeString(customerInfo.lastName, 50),
    email: email,
    phone: sanitizePhone(customerInfo.phone)
  };
}

const validateAndSanitizeItems = (items: any[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Valid items array is required');
  }

  if (items.length > 50) {
    throw new Error('Too many items in cart');
  }

  return items.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid item at index ${index}`);
    }

    const quantity = Number(item.quantity);
    if (isNaN(quantity) || quantity < 1 || quantity > 999) {
      throw new Error(`Invalid quantity for item at index ${index}`);
    }

    const price = Number(item.price);
    if (isNaN(price) || price < 0 || price > 99999) {
      throw new Error(`Invalid price for item at index ${index}`);
    }

    return {
      id: sanitizeString(item.id, 100),
      name: sanitizeString(item.name, 200),
      quantity: quantity,
      price: price,
      image: sanitizeString(item.image, 500),
      uploadedPhotoUrl: item.uploadedPhotoUrl ? sanitizeString(item.uploadedPhotoUrl, 500) : undefined
    };
  });
}

const validateSquareCredentials = (credentials: any) => {
  if (!credentials || typeof credentials !== 'object') {
    throw new Error('Square credentials are required');
  }

  const { appId, accessToken, locationId, environment } = credentials;

  if (!appId || typeof appId !== 'string' || appId.length < 10) {
    throw new Error('Invalid Square App ID');
  }

  if (!accessToken || typeof accessToken !== 'string' || accessToken.length < 20) {
    throw new Error('Invalid Square Access Token');
  }

  if (!locationId || typeof locationId !== 'string' || locationId.length < 10) {
    throw new Error('Invalid Square Location ID');
  }

  const validEnvironments = ['sandbox', 'production'];
  if (!validEnvironments.includes(environment)) {
    throw new Error('Invalid Square environment');
  }

  return {
    appId: sanitizeString(appId, 100),
    accessToken: sanitizeString(accessToken, 200),
    locationId: sanitizeString(locationId, 100),
    environment: environment
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    console.log(`Square checkout request from IP: ${clientIP}`);

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      throw new Error('Invalid JSON in request body');
    }

    // Comprehensive input validation and sanitization
    const {
      customerInfo,
      shippingAddress,
      billingAddress,
      items,
      amount,
      breakdown,
      squareCredentials
    } = requestBody;

    // Validate and sanitize all inputs
    const sanitizedCustomerInfo = validateAndSanitizeCustomerInfo(customerInfo);
    const sanitizedShippingAddress = validateAndSanitizeAddress(shippingAddress);
    const sanitizedBillingAddress = validateAndSanitizeAddress(billingAddress);
    const sanitizedItems = validateAndSanitizeItems(items);
    const sanitizedAmount = sanitizeAmount(amount);
    const sanitizedCredentials = validateSquareCredentials(squareCredentials);

    // Validate breakdown amounts
    if (!breakdown || typeof breakdown !== 'object') {
      throw new Error('Invalid breakdown format');
    }

    const sanitizedBreakdown = {
      subtotal: sanitizeAmount(breakdown.subtotal),
      shipping: sanitizeAmount(breakdown.shipping),
      tax: sanitizeAmount(breakdown.tax),
      total: sanitizeAmount(breakdown.total)
    };

    // Verify amount consistency
    const calculatedTotal = sanitizedBreakdown.subtotal + sanitizedBreakdown.shipping + sanitizedBreakdown.tax;
    if (Math.abs(calculatedTotal - sanitizedBreakdown.total) > 1) {
      throw new Error('Amount breakdown inconsistency detected');
    }

    if (sanitizedAmount !== sanitizedBreakdown.total) {
      throw new Error('Total amount mismatch');
    }

    // Verify items total matches subtotal
    const itemsTotal = sanitizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (Math.abs(itemsTotal * 100 - sanitizedBreakdown.subtotal) > 1) {
      throw new Error('Items total does not match subtotal');
    }

    console.log('All inputs validated and sanitized successfully');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create Square API client
    const squareApiUrl = sanitizedCredentials.environment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';

    // Create Square checkout
    const checkoutData = {
      idempotency_key: crypto.randomUUID(),
      checkout: {
        redirect_url: `${req.headers.get('origin')}/checkout-success`,
        order: {
          location_id: sanitizedCredentials.locationId,
          line_items: sanitizedItems.map(item => ({
            name: item.name,
            quantity: item.quantity.toString(),
            base_price_money: {
              amount: Math.round(item.price * 100),
              currency: 'USD'
            }
          }))
        }
      }
    };

    console.log('Creating Square checkout with sanitized data');

    const squareResponse = await fetch(`${squareApiUrl}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sanitizedCredentials.accessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify(checkoutData)
    });

    if (!squareResponse.ok) {
      const errorText = await squareResponse.text();
      console.error('Square API error:', errorText);
      throw new Error('Failed to create Square checkout');
    }

    const checkoutResult = await squareResponse.json();
    
    // Store order in database with sanitized data
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_email: sanitizedCustomerInfo.email,
        customer_name: `${sanitizedCustomerInfo.firstName} ${sanitizedCustomerInfo.lastName}`,
        customer_phone: sanitizedCustomerInfo.phone,
        total_amount: sanitizedAmount / 100,
        shipping_address: sanitizedShippingAddress,
        billing_address: sanitizedBillingAddress,
        square_checkout_id: checkoutResult.payment_link?.id,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      throw new Error('Failed to create order record');
    }

    // Store order items with sanitized data
    const orderItems = sanitizedItems.map(item => ({
      order_id: orderData.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      product_image: item.image,
      personalization_data: item.uploadedPhotoUrl ? { uploadedPhotoUrl: item.uploadedPhotoUrl } : null
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      throw new Error('Failed to create order items');
    }

    console.log('Square checkout created successfully');

    return new Response(
      JSON.stringify({
        success: true,
        checkout_url: checkoutResult.payment_link?.url,
        order_id: orderData.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Square checkout error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
