// Force redeployment: 2025-08-18T17:30:00Z - Picking up updated Supabase secrets
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/** ---------- CORS Configuration ---------- */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

/** ---------- Square Credentials from Environment Variables ---------- */
console.log('🔧 Reading Square environment variables...')

const SQUARE_APPLICATION_ID = Deno.env.get('SQUARE_APPLICATION_ID')
const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN')
const SQUARE_LOCATION_ID = Deno.env.get('SQUARE_LOCATION_ID')
const SQUARE_ENVIRONMENT = Deno.env.get('SQUARE_ENVIRONMENT') || 'production'

console.log('🔍 Square credentials check:', {
  SQUARE_APPLICATION_ID: SQUARE_APPLICATION_ID ? `Present (${SQUARE_APPLICATION_ID.substring(0, 8)}...)` : 'MISSING',
  SQUARE_ACCESS_TOKEN: SQUARE_ACCESS_TOKEN ? `Present (${SQUARE_ACCESS_TOKEN.substring(0, 8)}...)` : 'MISSING',
  SQUARE_LOCATION_ID: SQUARE_LOCATION_ID ? `Present (${SQUARE_LOCATION_ID.substring(0, 8)}...)` : 'MISSING',
  SQUARE_ENVIRONMENT: SQUARE_ENVIRONMENT
})

// Validate required Square credentials
const hasAllCredentials = !!(SQUARE_APPLICATION_ID && SQUARE_ACCESS_TOKEN && SQUARE_LOCATION_ID)
if (!hasAllCredentials) {
  console.error('❌ Missing Square credentials:', {
    hasAppId: !!SQUARE_APPLICATION_ID,
    hasAccessToken: !!SQUARE_ACCESS_TOKEN,
    hasLocationId: !!SQUARE_LOCATION_ID
  })
}

/** ---------- Types ---------- */
interface BillingAddress {
  addressLine1?: string
  addressLine2?: string
  locality?: string
  administrativeDistrictLevel1?: string
  postalCode?: string
  country?: string
}

interface PaymentRequest {
  action: 'test_connection' | 'process_payment'
  token?: string
  sourceId?: string
  verificationToken?: string
  amount?: number
  orderId?: string
  idempotencyKey?: string
  customerId?: string
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  billingAddress?: BillingAddress
  saveCard?: boolean
}

/** ---------- Helper Functions ---------- */
function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 
      'Content-Type': 'application/json', 
      ...(init.headers || {}), 
      ...corsHeaders 
    },
  })
}

function badRequest(msg: string) { 
  return json({ success: false, error: msg }, { status: 400 }) 
}

function methodNotAllowed(method: string) { 
  return json({ success: false, error: `Method ${method} not allowed` }, { status: 405 }) 
}

function toCents(amount?: number | string | null) {
  const n = Number(amount)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.round(n * 100)
}

const SQUARE_VERSION = '2024-08-21'
const SQUARE_BASE = 'https://connect.squareup.com'

async function sqFetch(path: string, accessToken: string, init: RequestInit & { body?: unknown } = {}) {
  // Add timeout to prevent hanging requests
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
  
  try {
    const res = await fetch(`${SQUARE_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Square-Version': SQUARE_VERSION,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(init.headers || {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    let json = {}
    try {
      json = await res.json()
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError)
      json = { error: 'Invalid JSON response from Square API' }
    }
    
    return { ok: res.ok, status: res.status, json }
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error.name === 'AbortError') {
      console.error('Square API request timeout')
      return { 
        ok: false, 
        status: 408, 
        json: { error: 'Request timeout', message: 'Square API request timed out' }
      }
    }
    
    console.error('Square API request failed:', error)
    return { 
      ok: false, 
      status: 500, 
      json: { error: 'Network error', message: error.message || 'Failed to connect to Square API' }
    }
  }
}

async function ensureCustomer(params: {
  customerId?: string
  email?: string
  name?: string
  phone?: string
  address?: BillingAddress
  accessToken: string
}) {
  const { customerId, email, name, phone, address, accessToken } = params
  if (customerId) return { customerId }
  if (!email && !name) return {}

  if (email) {
    const searchBody = { query: { filter: { email_address: { exact: email } } } }
    const search = await sqFetch('/v2/customers/search', accessToken, { method: 'POST', body: searchBody })
    if (search.ok && Array.isArray(search.json?.customers) && search.json.customers.length > 0) {
      return { customerId: search.json.customers[0].id as string }
    }
  }

  const createBody: Record<string, unknown> = {
    idempotency_key: crypto.randomUUID(),
    email_address: email,
    given_name: name,
    phone_number: phone,
    address: address && {
      address_line_1: address.addressLine1,
      address_line_2: address.addressLine2,
      locality: address.locality,
      administrative_district_level_1: address.administrativeDistrictLevel1,
      postal_code: address.postalCode,
      country: address.country,
    },
  }
  const created = await sqFetch('/v2/customers', accessToken, { method: 'POST', body: createBody })
  if (!created.ok) return {}
  return { customerId: created.json?.customer?.id as string }
}

async function createCardOnFile(params: {
  customerId: string
  sourceId: string
  verificationToken?: string
  cardholderName?: string
  billingAddress?: BillingAddress
  accessToken: string
}) {
  const { customerId, sourceId, verificationToken, cardholderName, billingAddress, accessToken } = params
  const body: Record<string, unknown> = {
    idempotency_key: crypto.randomUUID(),
    source_id: sourceId,
    customer_id: customerId,
    card: {
      cardholder_name: cardholderName,
      billing_address: billingAddress && {
        address_line_1: billingAddress.addressLine1,
        address_line_2: billingAddress.addressLine2,
        locality: billingAddress.locality,
        administrative_district_level_1: billingAddress.administrativeDistrictLevel1,
        postal_code: billingAddress.postalCode,
        country: billingAddress.country,
      },
    },
    ...(verificationToken ? { verification_token: verificationToken } : {}),
  }

  const res = await sqFetch('/v2/cards', accessToken, { method: 'POST', body })
  if (!res.ok) {
    const firstErr = Array.isArray(res.json?.errors) ? res.json.errors[0] : null
    const detail = firstErr?.detail || firstErr?.code || res.json?.message || 'Failed to save card'
    return { ok: false, error: detail, raw: res.json }
  }
  return { ok: true, cardId: res.json?.card?.id as string, raw: res.json }
}

/** ---------- Main Handler ---------- */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return methodNotAllowed(req.method)
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    let bodyText = ''
    try { 
      bodyText = await req.text() 
    } catch { 
      return badRequest('Unable to read request body') 
    }

    let body: PaymentRequest
    try { 
      body = JSON.parse(bodyText) 
    } catch { 
      return badRequest('Request body must be valid JSON') 
    }

    const {
      action,
      token,
      sourceId,
      verificationToken,
      amount,
      orderId,
      idempotencyKey,
      customerId,
      customerEmail,
      customerName,
      customerPhone,
      billingAddress,
      saveCard,
    } = body || {}

    if (!action) {
      return badRequest('Missing "action" parameter')
    }

    // Handle test_connection action
    if (action === 'test_connection') {
      console.log('🔍 Testing Square connection...')
      
      if (!hasAllCredentials) {
        console.error('❌ Square credentials missing for test_connection')
        return badRequest('Square credentials not configured properly. Missing: ' + 
          [
            !SQUARE_APPLICATION_ID && 'SQUARE_APPLICATION_ID',
            !SQUARE_ACCESS_TOKEN && 'SQUARE_ACCESS_TOKEN', 
            !SQUARE_LOCATION_ID && 'SQUARE_LOCATION_ID'
          ].filter(Boolean).join(', ')
        )
      }
      
      console.log('✅ Square credentials validated successfully')
      return json({ 
        success: true, 
        applicationId: SQUARE_APPLICATION_ID, 
        locationId: SQUARE_LOCATION_ID, 
        environment: SQUARE_ENVIRONMENT 
      })
    }

    // Handle process_payment action
    if (action === 'process_payment') {
      console.log('💳 Processing payment request...')
      
      // Validate credentials are available
      if (!hasAllCredentials) {
        console.error('❌ Square credentials missing for process_payment')
        return badRequest('Square payment system not configured properly')
      }
      
      const cents = toCents(amount)
      if (!cents) {
        return badRequest('Invalid "amount". Must be a positive number (USD)')
      }
      
      console.log(`💰 Processing payment for ${cents} cents ($${(cents/100).toFixed(2)})`)

      const { customerId: ensuredCustomerId } = await ensureCustomer({
        customerId,
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
        address: billingAddress,
        accessToken: SQUARE_ACCESS_TOKEN!,
      })

      let paymentSourceId: string | undefined = sourceId || token
      let savedCardId: string | undefined

      if (saveCard) {
        if (!ensuredCustomerId) {
          return badRequest('Cannot save card: missing customer context')
        }
        const oneTimeToken = token || sourceId
        if (!oneTimeToken) {
          return badRequest('Cannot save card: provide a one-time token')
        }
        
        const cardRes = await createCardOnFile({
          customerId: ensuredCustomerId,
          sourceId: oneTimeToken,
          verificationToken,
          cardholderName: customerName,
          billingAddress,
          accessToken: SQUARE_ACCESS_TOKEN!,
        })
        
        if (!cardRes.ok) {
          return json({ 
            success: false, 
            error: cardRes.error, 
            raw: cardRes.raw 
          }, { status: 400 })
        }
        
        savedCardId = cardRes.cardId
        paymentSourceId = savedCardId
      }

      if (!paymentSourceId) {
        return badRequest('Missing payment source (token or sourceId)')
      }

      const paymentBody: Record<string, unknown> = {
        source_id: paymentSourceId,
        amount_money: { amount: cents, currency: 'USD' },
        location_id: SQUARE_LOCATION_ID,
        idempotency_key: idempotencyKey || crypto.randomUUID(),
        autocomplete: true,
        reference_id: orderId || undefined,
        buyer_email_address: customerEmail || undefined,
        note: customerName ? `Customer: ${customerName}` : undefined,
        ...(verificationToken && !saveCard ? { verification_token: verificationToken } : {}),
        customer_id: ensuredCustomerId || undefined,
      }

      console.log('📡 Sending payment request to Square API:', {
        amount: cents,
        locationId: SQUARE_LOCATION_ID,
        sourceId: paymentSourceId?.substring(0, 10) + '...',
        hasVerificationToken: !!verificationToken
      })

      const payRes = await sqFetch('/v2/payments', SQUARE_ACCESS_TOKEN!, { 
        method: 'POST', 
        body: paymentBody 
      })
      
      console.log('📊 Square API response:', {
        ok: payRes.ok,
        status: payRes.status,
        hasErrors: !!(payRes.json?.errors),
        errorCount: Array.isArray(payRes.json?.errors) ? payRes.json.errors.length : 0
      })

      if (!payRes.ok) {
        const firstErr = Array.isArray(payRes.json?.errors) ? payRes.json.errors[0] : null
        const detail = firstErr?.detail || firstErr?.code || payRes.json?.message || 'Payment processing failed'

        console.error('❌ Square payment failed:', {
          status: payRes.status,
          firstError: firstErr,
          allErrors: payRes.json?.errors,
          detail
        })

        // Update order status if orderId provided
        if (orderId) {
          try {
            await supabase.from('orders')
              .update({ status: 'failed', notes: `Payment failed: ${detail}` })
              .eq('id', orderId)
          } catch (orderUpdateError) {
            console.error('Failed to update order status:', orderUpdateError)
          }
        }

        return json({ 
          success: false, 
          error: detail, 
          raw: payRes.json,
          squareStatus: payRes.status,
          squareErrors: payRes.json?.errors || []
        }, { status: 400 })
      }

      const payment = payRes.json?.payment
      const paymentId = payment?.id as string | undefined

      console.log('✅ Payment successful:', {
        paymentId: paymentId?.substring(0, 10) + '...',
        status: payment?.status
      })

      // Update order status if orderId provided
      if (orderId) {
        try {
          const { error: updateError } = await supabase.from('orders')
            .update({ 
              status: 'completed', 
              square_order_id: paymentId, 
              payment_id: paymentId 
            })
            .eq('id', orderId)
          
          if (updateError) {
            console.error('Order update failed:', updateError)
          } else {
            console.log('✅ Order updated successfully')
          }
        } catch (orderUpdateError) {
          console.error('Failed to update order:', orderUpdateError)
        }
      }

      return json({
        success: true,
        paymentId,
        receiptUrl: payment?.receipt_url,
        status: payment?.status,
        customerId: ensuredCustomerId,
        savedCardId,
      })
    }

    return badRequest(`Invalid action: "${action}". Supported actions: test_connection, process_payment`)
    
  } catch (error) {
    const err = error as Error
    console.error('💥 Square payments function error:', err?.message, err?.stack)
    
    return json({ 
      success: false, 
      error: 'Internal server error', 
      details: err?.message ?? 'Unknown error' 
    }, { status: 500 })
  }
})