
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

    const { order, locationId, redirectUrl, note, squareCredentials } = await req.json()

    console.log('Received request with Square credentials:', {
      hasCredentials: !!squareCredentials,
      environment: squareCredentials?.environment
    })

    // Use Square credentials from the request (from database settings)
    let squareAppId = squareCredentials?.appId
    let squareAccessToken = squareCredentials?.accessToken
    let squareEnvironment = squareCredentials?.environment || 'sandbox'

    // Fall back to environment variables if not provided in request
    if (!squareAppId || !squareAccessToken) {
      console.log('Falling back to environment variables for Square credentials')
      squareAppId = squareAppId || Deno.env.get('SQUARE_APP_ID')
      squareAccessToken = squareAccessToken || Deno.env.get('SQUARE_ACCESS_TOKEN')
      squareEnvironment = squareEnvironment || Deno.env.get('SQUARE_ENVIRONMENT') || 'sandbox'
    }

    if (!squareAppId || !squareAccessToken) {
      throw new Error('Square API credentials not configured')
    }

    console.log('Using Square environment:', squareEnvironment)

    // Calculate total amount
    const totalAmount = order.lineItems.reduce((sum: number, item: any) => {
      return sum + (item.basePriceMoney.amount * parseInt(item.quantity))
    }, 0)

    // Create Square checkout request
    const squareApiUrl = squareEnvironment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com'

    const checkoutRequest = {
      idempotency_key: `checkout-${Date.now()}-${Math.random()}`,
      checkout_page_url: redirectUrl || `${req.headers.get('origin')}/checkout/success`,
      order: {
        location_id: locationId,
        line_items: order.lineItems.map((item: any) => ({
          quantity: item.quantity,
          name: item.name,
          note: item.note,
          base_price_money: {
            amount: item.basePriceMoney.amount,
            currency: item.basePriceMoney.currency || 'USD'
          }
        }))
      },
      payment_note: note || 'Online order',
      merchant_support_email: 'support@example.com',
      pre_populate_buyer_email: '',
      redirect_url: redirectUrl || `${req.headers.get('origin')}/checkout/success`
    }

    console.log('Creating Square checkout with request:', JSON.stringify(checkoutRequest, null, 2))

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
    
    if (!squareResponse.ok) {
      console.error('Square API error:', squareData)
      throw new Error(`Square API error: ${squareData.errors?.[0]?.detail || 'Unknown error'}`)
    }

    console.log('Square checkout created successfully:', squareData)

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
