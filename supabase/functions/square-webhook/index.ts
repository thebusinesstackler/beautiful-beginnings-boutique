import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const signature = req.headers.get('X-Square-Signature')
    const body = await req.text()
    
    console.log('Webhook received:', {
      signature: signature?.substring(0, 20) + '...',
      bodyLength: body.length,
      timestamp: new Date().toISOString()
    })

    // Parse the webhook payload
    const webhookData = JSON.parse(body)
    const { type, data } = webhookData

    console.log('Webhook event:', {
      type,
      eventId: data?.id,
      objectType: data?.object?.type
    })

    // Handle payment events
    if (type === 'payment.updated' && data?.object?.payment) {
      const payment = data.object.payment
      
      console.log('Payment webhook:', {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount_money?.amount,
        currency: payment.amount_money?.currency
      })

      // Update order status based on payment status
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .update({
          status: payment.status === 'COMPLETED' ? 'paid' : payment.status.toLowerCase(),
          square_order_id: payment.order_id,
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', payment.id)
        .select()

      if (orderError) {
        console.error('Error updating order:', orderError)
      } else {
        console.log('Order updated:', orderData)
      }

      // Send confirmation email or notification here if needed
      if (payment.status === 'COMPLETED' && orderData?.[0]) {
        console.log('Payment completed for order:', orderData[0].id)
        // Add email notification logic here
      }
    }

    // Handle order events
    if (type === 'order.updated' && data?.object?.order) {
      const order = data.object.order
      
      console.log('Order webhook:', {
        orderId: order.id,
        state: order.state,
        totalMoney: order.total_money?.amount
      })

      // Update order with Square order details
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          square_order_id: order.id,
          updated_at: new Date().toISOString(),
          personalization_data: {
            square_order_state: order.state,
            square_webhook_received: true
          }
        })
        .eq('square_order_id', order.id)

      if (updateError) {
        console.error('Error updating order from webhook:', updateError)
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({
        error: 'Webhook processing failed',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})