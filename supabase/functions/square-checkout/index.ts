
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handler for embedded payments using Web Payments SDK
async function handleEmbeddedPayment(requestBody: any, supabase: any) {
  const { token, customerInfo, shippingAddress, billingAddress, items, amount, squareCredentials } = requestBody

  console.log('Processing embedded payment:', {
    hasToken: !!token,
    customerEmail: customerInfo?.email,
    itemCount: items?.length,
    amount
  })

  // Use Square credentials from the request
  const squareAccessToken = squareCredentials?.accessToken
  const squareEnvironment = squareCredentials?.environment || 'sandbox'
  const locationId = squareCredentials?.locationId

  if (!squareAccessToken || !locationId) {
    throw new Error('Square credentials not properly configured')
  }

  // Create Square payment request
  const squareApiUrl = squareEnvironment === 'production' 
    ? 'https://connect.squareup.com' 
    : 'https://connect.squareupsandbox.com'

  const paymentRequest = {
    source_id: token,
    idempotency_key: `payment-${Date.now()}-${Math.random().toString(36).substring(2)}`,
    amount_money: {
      amount: amount,
      currency: 'USD'
    },
    app_fee_money: {
      amount: 0,
      currency: 'USD'
    },
    location_id: locationId,
    note: `Online order for ${customerInfo.firstName} ${customerInfo.lastName}`
  }

  console.log('Square payment request:', JSON.stringify(paymentRequest, null, 2))

  const squareResponse = await fetch(`${squareApiUrl}/v2/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${squareAccessToken}`,
      'Content-Type': 'application/json',
      'Square-Version': '2023-10-18'
    },
    body: JSON.stringify(paymentRequest)
  })

  const squareData = await squareResponse.json()
  
  console.log('Square payment response status:', squareResponse.status)
  console.log('Square payment response:', JSON.stringify(squareData, null, 2))
  
  if (!squareResponse.ok) {
    console.error('Square payment error:', squareData)
    throw new Error(`Square payment error: ${squareData.errors?.[0]?.detail || squareData.message || 'Payment failed'}`)
  }

  // Store order in database
  const { data: orderRecord, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_email: customerInfo.email,
      customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customer_phone: customerInfo.phone,
      total_amount: amount / 100, // Convert back to dollars
      status: squareData.payment.status === 'COMPLETED' ? 'paid' : 'pending',
      payment_id: squareData.payment.id,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      personalization_data: { 
        square_embedded_payment: true,
        items: items.map((item: any) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          hasPhoto: !!item.uploadedPhoto
        }))
      },
      notes: `Payment processed via embedded Square checkout`
    })
    .select()
    .single()

  if (orderError) {
    console.error('Error creating order record:', orderError)
    throw new Error('Failed to save order record')
  }

  console.log('Order record created:', orderRecord)

  return new Response(
    JSON.stringify({
      success: true,
      paymentId: squareData.payment.id,
      orderId: orderRecord.id,
      status: squareData.payment.status
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}

// Handler for redirect payments using Payment Links (legacy)
async function handleRedirectPayment(requestBody: any, supabase: any) {
  const { order, redirectUrl, note, squareCredentials } = requestBody

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
      redirect_url: redirectUrl || `${Deno.env.get('SUPABASE_URL')}/checkout/success`
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

    const requestBody = await req.json()
    
    // Check if this is the new embedded payment flow (has token) or old redirect flow (has order)
    const isEmbeddedPayment = !!requestBody.token
    
    console.log('Received checkout request:', {
      isEmbeddedPayment,
      hasToken: !!requestBody.token,
      hasOrder: !!requestBody.order,
      hasCredentials: !!requestBody.squareCredentials,
      itemsCount: requestBody.items?.length || requestBody.order?.lineItems?.length || 0
    })

    if (isEmbeddedPayment) {
      return await handleEmbeddedPayment(requestBody, supabase)
    } else {
      return await handleRedirectPayment(requestBody, supabase)
    }

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
