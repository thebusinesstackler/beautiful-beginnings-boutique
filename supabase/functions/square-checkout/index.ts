
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Square checkout function started');

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body parsed successfully');
    } catch {
      throw new Error('Invalid JSON in request body');
    }

    // Get Square credentials from Supabase settings
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching Square credentials from settings...');
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['square_app_id', 'square_location_id', 'square_access_token', 'square_environment']);

    if (settingsError) {
      console.error('Settings fetch error:', settingsError);
      throw new Error('Failed to fetch Square configuration');
    }

    // Convert settings array to object
    const settings: Record<string, string> = {};
    settingsData?.forEach(setting => {
      settings[setting.key] = setting.value;
    });

    console.log('Square settings loaded:', {
      hasAppId: !!settings.square_app_id,
      hasLocationId: !!settings.square_location_id,
      hasAccessToken: !!settings.square_access_token,
      environment: settings.square_environment || 'sandbox'
    });

    // Validate Square credentials
    if (!settings.square_app_id || !settings.square_location_id || !settings.square_access_token) {
      throw new Error('Square credentials not properly configured in settings');
    }

    // Comprehensive input validation and sanitization
    const {
      token,
      customerInfo,
      shippingAddress,
      billingAddress,
      items,
      amount,
      breakdown
    } = requestBody;

    if (!token || typeof token !== 'string') {
      throw new Error('Payment token is required');
    }

    // Validate and sanitize all inputs
    const sanitizedCustomerInfo = validateAndSanitizeCustomerInfo(customerInfo);
    const sanitizedShippingAddress = validateAndSanitizeAddress(shippingAddress);
    const sanitizedBillingAddress = validateAndSanitizeAddress(billingAddress);
    const sanitizedItems = validateAndSanitizeItems(items);
    const sanitizedAmount = sanitizeAmount(amount);

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

    console.log('All inputs validated and sanitized successfully');

    // Create Square API client
    const squareApiUrl = settings.square_environment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';

    // Process payment with Square - Simplified approach for debugging
    const paymentData = {
      source_id: token,
      idempotency_key: crypto.randomUUID(),
      amount_money: {
        amount: sanitizedAmount,
        currency: 'USD'
      },
      location_id: settings.square_location_id
    };

    // Only add optional fields if they have valid data
    if (sanitizedCustomerInfo.email) {
      paymentData.buyer_email_address = sanitizedCustomerInfo.email;
    }

    // Add note if we have customer name
    if (sanitizedCustomerInfo.firstName && sanitizedCustomerInfo.lastName) {
      paymentData.note = `Order for ${sanitizedCustomerInfo.firstName} ${sanitizedCustomerInfo.lastName}`;
    }

    console.log('Processing payment with Square...');
    console.log('Square API URL:', squareApiUrl);
    console.log('Payment data amount:', sanitizedAmount);
    console.log('Full payment data being sent to Square:', JSON.stringify(paymentData, null, 2));
    
    // Validate required fields before sending
    if (!token || !settings.square_access_token || !settings.square_location_id) {
      console.error('Missing required Square data:', {
        hasToken: !!token,
        hasAccessToken: !!settings.square_access_token,
        hasLocationId: !!settings.square_location_id
      });
      throw new Error('Missing required Square configuration or payment token');
    }

    const squareResponse = await fetch(`${squareApiUrl}/v2/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.square_access_token}`,
        'Content-Type': 'application/json',
        'Square-Version': '2022-02-16',
        'Accept': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const responseText = await squareResponse.text();
    console.log('Square API Response Status:', squareResponse.status);
    console.log('Square API Response Headers:', Object.fromEntries(squareResponse.headers.entries()));
    console.log('Square API Response Body:', responseText);

    if (!squareResponse.ok) {
      let errorMessage = 'Payment processing failed';
      try {
        const errorData = JSON.parse(responseText);
        console.error('Square API Error Details:', errorData);
        if (errorData.errors && errorData.errors.length > 0) {
          const firstError = errorData.errors[0];
          errorMessage = firstError.detail || firstError.code || errorMessage;
          console.error('First Square error:', firstError);
        }
      } catch (e) {
        console.error('Error parsing Square error response:', e);
        errorMessage = `Square API returned ${squareResponse.status}: ${responseText.slice(0, 200)}`;
      }
      throw new Error(errorMessage);
    }

    const paymentResult = JSON.parse(responseText);
    
    if (!paymentResult.payment) {
      console.error('Invalid payment result:', paymentResult);
      throw new Error('Invalid payment response from Square');
    }

    console.log('Payment processed successfully:', paymentResult.payment.id);
    
    // Store order in database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_email: sanitizedCustomerInfo.email,
        customer_name: `${sanitizedCustomerInfo.firstName} ${sanitizedCustomerInfo.lastName}`,
        customer_phone: sanitizedCustomerInfo.phone,
        total_amount: sanitizedAmount / 100,
        shipping_address: sanitizedShippingAddress,
        billing_address: sanitizedBillingAddress,
        payment_id: paymentResult.payment.id,
        status: 'paid'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      throw new Error('Failed to create order record');
    }

    // Store order items
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
      // Don't throw here as payment was successful
    }

    console.log('Order created successfully:', orderData.id);

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: paymentResult.payment.id,
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
