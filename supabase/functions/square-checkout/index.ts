
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

    const { order, redirectUrl, note, squareCredentials } = await req.json()

    console.log('Received checkout request:', {
      hasOrder: !!order,
      hasCredentials: !!squareCredentials,
      lineItemsCount: order?.lineItems?.length || 0
    })

    // Use Square credentials from the request (from database settings)
    const squareAppId = squareCredentials?.appId
    const squareAccessToken = squareCredentials?.accessToken
    const squareEnvironment = squareCredentials?.environment || 'sandbox'
    const locationId = squareCredentials?.locationId || order?.locationId

    if (!squareAppId || !squareAccessToken || !locationId) {
      throw new Error('Square credentials not properly configured')
    }

    console.log('Using Square environment:', squareEnvironment)
    console.log('Location ID:', locationId)

    // Calculate total amount
    const totalAmount = order.lineItems.reduce((sum: number, item: any) => {
      return sum + (item.basePriceMoney.amount * parseInt(item.quantity))
    }, 0)

    console.log('Total amount calculated:', totalAmount)

    // Create Square checkout request
    const squareApiUrl = squareEnvironment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com'

    const checkoutRequest = {
      idempotency_key: `checkout-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      order: {
        location_id: locationId,
        line_items: order.lineItems.map((item: any) => ({
          quantity: item.quantity.toString(),
          name: item.name,
          note: item.note,
          base_price_money: {
            amount: item.basePriceMoney.amount,
            currency: item.basePriceMoney.currency || 'USD'
          }
        }))
      },
      checkout_options: {
        redirect_url: redirectUrl || `${req.headers.get('origin')}/checkout/success`
      },
      payment_note: note || 'Online order'
    }

    console.log('Square API request:', JSON.stringify(checkoutRequest, null, 2))

    const squareResponse = await fetch(`${squareApiUrl}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${squareAccessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify(checkoutRequest)
    })

    const squareData = await squareResponse.json()
    
    console.log('Square API response status:', squareResponse.status)
    console.log('Square API response:', JSON.stringify(squareData, null, 2))
    
    if (!squareResponse.ok) {
      console.error('Square API error:', squareData)
      throw new Error(`Square API error: ${squareData.errors?.[0]?.detail || squareData.message || 'Unknown error'}`)
    }

    // Store order in database for tracking
    const { data: orderRecord, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_email: 'pending@example.com', // Will be updated after payment
        total_amount: totalAmount / 100, // Convert back to dollars
        status: 'pending',
        payment_id: squareData.payment_link.id,
        personalization_data: { square_checkout: true },
        notes: note
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order record:', orderError)
    } else {
      console.log('Order record created:', orderRecord)
    }

    return new Response(
      JSON.stringify({
        checkoutUrl: squareData.payment_link.url,
        paymentLinkId: squareData.payment_link.id,
        orderId: orderRecord?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Square checkout error:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create Square checkout',
        details: error
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
