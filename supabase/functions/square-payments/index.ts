import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  action: 'test_connection' | 'process_payment';
  token?: string;
  verificationToken?: string;
  amount?: number;
  orderId?: string;
  customerEmail?: string;
  customerName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, token, verificationToken, amount, orderId, customerEmail, customerName }: PaymentRequest = await req.json();

    // Get Square credentials from environment
    const squareAppId = Deno.env.get('SQUARE_APP_ID');
    const squareLocationId = Deno.env.get('SQUARE_LOCATION_ID');
    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN');
    const squareEnvironment = Deno.env.get('SQUARE_ENVIRONMENT') || 'production';

    if (!squareAppId || !squareLocationId || !squareAccessToken) {
      console.error('Missing Square credentials');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Square configuration not found' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (action === 'test_connection') {
      // Return the application ID and location ID for frontend initialization
      return new Response(
        JSON.stringify({
          success: true,
          applicationId: squareAppId,
          locationId: squareLocationId,
          environment: squareEnvironment
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (action === 'process_payment') {
      if (!token || !amount || !orderId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Missing required payment parameters' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`Processing Square payment for order ${orderId}, amount: $${amount}`);

      // Determine Square API base URL based on environment
      const baseUrl = squareEnvironment === 'sandbox' 
        ? 'https://connect.squareupsandbox.com'
        : 'https://connect.squareup.com';

      // Create payment request to Square
      const paymentRequest = {
        source_id: token,
        verification_token: verificationToken,
        amount_money: {
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'USD'
        },
        location_id: squareLocationId,
        idempotency_key: `${orderId}-${Date.now()}` // Unique key for this payment
      };

      console.log('Sending payment request to Square:', JSON.stringify(paymentRequest, null, 2));

      // Send payment to Square
      const squareResponse = await fetch(`${baseUrl}/v2/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${squareAccessToken}`,
          'Square-Version': '2023-10-18',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
      });

      const squareResult = await squareResponse.json();
      console.log('Square API response:', JSON.stringify(squareResult, null, 2));

      if (!squareResponse.ok) {
        console.error('Square payment failed:', squareResult);
        const errorMessage = squareResult.errors?.[0]?.detail || 'Payment processing failed';
        
        // Update order status to failed
        if (orderId) {
          await supabaseClient
            .from('orders')
            .update({ 
              status: 'failed',
              notes: `Payment failed: ${errorMessage}`
            })
            .eq('id', orderId);
        }

        return new Response(
          JSON.stringify({ 
            success: false, 
            error: errorMessage 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Payment successful
      const payment = squareResult.payment;
      console.log('Payment successful:', payment.id);

      // Update order with payment details
      if (orderId) {
        const { error: updateError } = await supabaseClient
          .from('orders')
          .update({ 
            status: 'completed',
            square_order_id: payment.id,
            payment_id: payment.id
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Error updating order:', updateError);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          paymentId: payment.id,
          receiptUrl: payment.receipt_url,
          status: payment.status
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Invalid action' 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Square payments function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});