import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('🔄 Starting Square orders sync...');

    // Get Square credentials
    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
    const squareEnvironment = Deno.env.get('SQUARE_ENVIRONMENT') || 'production';
    const squareLocationId = Deno.env.get('SQUARE_LOCATION_ID');

    if (!squareAccessToken || !squareLocationId) {
      throw new Error('Missing Square credentials');
    }

    // Determine Square API base URL
    const squareApiBase = squareEnvironment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com';

    // Get existing orders from database to avoid duplicates
    const { data: existingOrders, error: ordersError } = await supabase
      .from('orders')
      .select('payment_id, square_order_id')
      .not('payment_id', 'is', null);

    if (ordersError) {
      console.error('Error fetching existing orders:', ordersError);
      throw ordersError;
    }

    const existingPaymentIds = new Set(existingOrders.map(o => o.payment_id));
    const existingSquareOrderIds = new Set(existingOrders.map(o => o.square_order_id));

    // Fetch recent payments from Square (last 30 days)
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 30);
    
    console.log(`📅 Fetching Square payments since: ${startTime.toISOString()}`);

    const paymentsResponse = await fetch(`${squareApiBase}/v2/payments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Square-Version': '2024-07-17',
        'Content-Type': 'application/json'
      }
    });

    if (!paymentsResponse.ok) {
      const errorText = await paymentsResponse.text();
      console.error('Square API error:', errorText);
      throw new Error(`Square API error: ${paymentsResponse.status}`);
    }

    const paymentsData = await paymentsResponse.json();
    console.log(`💳 Found ${paymentsData.payments?.length || 0} payments from Square`);

    let syncedCount = 0;
    const missingOrders = [];

    // Process each payment
    for (const payment of paymentsData.payments || []) {
      if (payment.status !== 'COMPLETED') continue;
      
      // Skip if we already have this payment
      if (existingPaymentIds.has(payment.id)) continue;

      console.log(`🔍 Processing missing payment: ${payment.id}`);

      // Extract customer info from payment
      const customerEmail = payment.buyer_email_address || 'unknown@email.com';
      const amountMoney = payment.amount_money;
      const totalAmount = amountMoney ? (amountMoney.amount / 100) : 0; // Convert from cents

      // Create customer record if needed
      let customerId = null;
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            email: customerEmail,
            name: payment.receipt_number || 'Square Customer',
            newsletter_subscribed: false
          })
          .select('id')
          .single();

        if (!customerError && newCustomer) {
          customerId = newCustomer.id;
        }
      }

      // Create order record
      const orderData = {
        customer_id: customerId,
        customer_email: customerEmail,
        customer_name: payment.receipt_number || 'Square Customer',
        total_amount: totalAmount,
        status: 'completed',
        payment_id: payment.id,
        square_order_id: payment.order_id,
        created_at: payment.created_at,
        updated_at: payment.updated_at || payment.created_at,
        notes: `Synced from Square - Original payment: ${payment.created_at}`,
        shipping_address: {
          address: 'Address not available from Square',
          city: 'Unknown',
          state: 'Unknown',
          zipCode: 'Unknown',
          country: 'US'
        },
        billing_address: {
          address: 'Address not available from Square',
          city: 'Unknown', 
          state: 'Unknown',
          zipCode: 'Unknown',
          country: 'US'
        }
      };

      const { error: insertError } = await supabase
        .from('orders')
        .insert(orderData);

      if (insertError) {
        console.error(`❌ Error inserting order for payment ${payment.id}:`, insertError);
      } else {
        console.log(`✅ Synced order for payment ${payment.id}`);
        syncedCount++;
        missingOrders.push({
          paymentId: payment.id,
          amount: totalAmount,
          createdAt: payment.created_at
        });
      }
    }

    console.log(`🎉 Sync completed! Created ${syncedCount} new orders`);

    return new Response(
      JSON.stringify({
        success: true,
        syncedCount,
        missingOrders,
        message: `Successfully synced ${syncedCount} missing orders from Square`
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('❌ Sync error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
        status: 500 
      }
    );
  }
});