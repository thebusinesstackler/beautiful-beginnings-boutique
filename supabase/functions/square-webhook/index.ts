
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-square-signature',
}

const verifyWebhookSignature = async (body: string, signature: string, webhookSignatureKey: string): Promise<boolean> => {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(webhookSignatureKey);
    const bodyData = encoder.encode(body);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, bodyData);
    const computedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

    return computedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

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

    const webhookSignatureKey = Deno.env.get('SQUARE_WEBHOOK_SIGNATURE_KEY');
    const body = await req.text();
    const signature = req.headers.get('x-square-signature');

    // Verify webhook signature if configured
    if (webhookSignatureKey && signature) {
      const isValid = await verifyWebhookSignature(body, signature, webhookSignatureKey);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }
    } else {
      console.warn('Webhook signature verification not configured');
    }

    const event = JSON.parse(body);
    console.log('Received webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'payment.updated':
        await handlePaymentUpdate(supabaseClient, event.data);
        break;
      case 'order.updated':
        await handleOrderUpdate(supabaseClient, event.data);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response('OK', { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
  }
});

async function handlePaymentUpdate(supabaseClient: any, data: any) {
  try {
    const payment = data.object?.payment;
    if (!payment) return;

    const orderId = payment.order_id;
    const status = payment.status;

    console.log(`Payment update: ${orderId} -> ${status}`);

    // Update order status based on payment status
    let orderStatus = 'pending';
    if (status === 'COMPLETED') {
      orderStatus = 'paid';
    } else if (status === 'FAILED' || status === 'CANCELED') {
      orderStatus = 'cancelled';
    }

    const { error } = await supabaseClient
      .from('orders')
      .update({ 
        status: orderStatus,
        payment_id: payment.id,
        updated_at: new Date().toISOString()
      })
      .eq('square_order_id', orderId);

    if (error) {
      console.error('Failed to update order:', error);
    } else {
      console.log(`Order ${orderId} status updated to ${orderStatus}`);
    }

  } catch (error) {
    console.error('Payment update error:', error);
  }
}

async function handleOrderUpdate(supabaseClient: any, data: any) {
  try {
    const order = data.object?.order;
    if (!order) return;

    console.log(`Order update: ${order.id} -> ${order.state}`);

    // Extract shipping and billing addresses if available
    const fulfillments = order.fulfillments || [];
    const shippingAddress = fulfillments.length > 0 ? fulfillments[0].shipment_details?.recipient : null;

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (shippingAddress) {
      updateData.shipping_address = {
        name: shippingAddress.display_name,
        address_line_1: shippingAddress.address?.address_line_1,
        address_line_2: shippingAddress.address?.address_line_2,
        locality: shippingAddress.address?.locality,
        administrative_district_level_1: shippingAddress.address?.administrative_district_level_1,
        postal_code: shippingAddress.address?.postal_code,
        country: shippingAddress.address?.country
      };
    }

    const { error } = await supabaseClient
      .from('orders')
      .update(updateData)
      .eq('square_order_id', order.id);

    if (error) {
      console.error('Failed to update order with shipping info:', error);
    }

  } catch (error) {
    console.error('Order update error:', error);
  }
}
