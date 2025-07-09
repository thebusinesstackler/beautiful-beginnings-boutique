
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CheckoutRequest {
  orderData: {
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      product_id?: string;
    }>;
    total: number;
    customer_email: string;
    customer_name?: string;
    customer_phone?: string;
    personalization_data?: any;
    uploaded_images?: string[];
  };
  redirectUrl: string;
}

const validateCheckoutRequest = (data: any): CheckoutRequest | null => {
  if (!data.orderData || !data.redirectUrl) {
    return null;
  }

  const { orderData } = data;
  
  // Validate required fields
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    return null;
  }

  if (!orderData.customer_email || typeof orderData.customer_email !== 'string') {
    return null;
  }

  if (typeof orderData.total !== 'number' || orderData.total <= 0) {
    return null;
  }

  // Validate items
  for (const item of orderData.items) {
    if (!item.name || typeof item.name !== 'string') return null;
    if (typeof item.price !== 'number' || item.price <= 0) return null;
    if (typeof item.quantity !== 'number' || item.quantity <= 0) return null;
  }

  // Validate total matches sum of items
  const calculatedTotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (Math.abs(calculatedTotal - orderData.total) > 0.01) {
    return null;
  }

  return data as CheckoutRequest;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get Square credentials from secrets
    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
    const squareLocationId = Deno.env.get('SQUARE_LOCATION_ID');
    const squareEnvironment = Deno.env.get('SQUARE_ENVIRONMENT') || 'sandbox';

    if (!squareAccessToken || !squareLocationId) {
      console.error('Missing Square credentials');
      return new Response(
        JSON.stringify({ error: 'Payment system configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const requestData = await req.json();
    const validatedData = validateCheckoutRequest(requestData);

    if (!validatedData) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { orderData, redirectUrl } = validatedData;

    // Create order in database first
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        customer_email: orderData.customer_email,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        total_amount: orderData.total,
        personalization_data: orderData.personalization_data,
        uploaded_images: orderData.uploaded_images,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create checkout with Square
    const squareApiUrl = squareEnvironment === 'production' 
      ? 'https://connect.squareup.com/v2/online-checkout/payment-links'
      : 'https://connect.squareupsandbox.com/v2/online-checkout/payment-links';

    const checkoutRequest = {
      quick_pay: {
        name: `Order #${order.id.slice(0, 8)}`,
        price_money: {
          amount: Math.round(orderData.total * 100), // Convert to cents
          currency: 'USD'
        },
        location_id: squareLocationId
      },
      checkout_options: {
        redirect_url: `${redirectUrl}?order_id=${order.id}`,
        ask_for_shipping_address: true
      }
    };

    const squareResponse = await fetch(squareApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify(checkoutRequest)
    });

    const squareData = await squareResponse.json();

    if (!squareResponse.ok) {
      console.error('Square API error:', squareData);
      
      // Delete the order if Square checkout failed
      await supabaseClient
        .from('orders')
        .delete()
        .eq('id', order.id);

      return new Response(
        JSON.stringify({ error: 'Payment system error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update order with Square checkout ID
    await supabaseClient
      .from('orders')
      .update({ 
        square_checkout_id: squareData.payment_link?.id,
        square_order_id: squareData.payment_link?.order_id 
      })
      .eq('id', order.id);

    return new Response(
      JSON.stringify({
        checkout_url: squareData.payment_link?.url,
        order_id: order.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
