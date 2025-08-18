// Force redeployment to refresh environment variables - 2025-08-18T15:47:00Z
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/** ---------- CORS ---------- */
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || '*'
const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

/** ---------- Square Credentials from Supabase Secrets ---------- */
console.log('🔧 Reading Square environment variables...')

// Try multiple possible secret names to handle any naming inconsistencies
const squareAppId = Deno.env.get('SQUARE_APP_ID') || Deno.env.get('SQAURE_APPLICATION_ID') || Deno.env.get('SQUARE_APPLICATION_ID')
const squareLocationId = Deno.env.get('SQUARE_LOCATION_ID')
const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN')
const squareEnvironment = Deno.env.get('SQUARE_ENVIRONMENT') || 'production'

// Debug: List all environment variables that contain "SQUARE"
const allEnvVars = Deno.env.toObject()
const squareEnvVars = Object.keys(allEnvVars).filter(key => key.toUpperCase().includes('SQUARE'))
console.log('🔍 All Square-related environment variables:', squareEnvVars)

console.log('🔍 Environment variable check:', {
  SQUARE_APP_ID: squareAppId ? `Present (${squareAppId.substring(0, 8)}...)` : 'MISSING',
  SQUARE_LOCATION_ID: squareLocationId ? `Present (${squareLocationId.substring(0, 8)}...)` : 'MISSING',
  SQUARE_ACCESS_TOKEN: squareAccessToken ? `Present (${squareAccessToken.substring(0, 8)}...)` : 'MISSING',
  SQUARE_ENVIRONMENT: squareEnvironment,
  ALL_SQUARE_VARS: squareEnvVars
})

// Validate required Square credentials
console.log('Square credentials check:', {
  SQUARE_APP_ID: squareAppId ? `${squareAppId.substring(0, 10)}...` : 'MISSING',
  SQUARE_LOCATION_ID: squareLocationId ? `${squareLocationId.substring(0, 10)}...` : 'MISSING', 
  SQUARE_ACCESS_TOKEN: squareAccessToken ? `${squareAccessToken.substring(0, 10)}...` : 'MISSING',
  SQUARE_ENVIRONMENT: squareEnvironment
})

console.log('Environment check - Raw values:', {
  SQUARE_LOCATION_ID_RAW: Deno.env.get('SQUARE_LOCATION_ID'),
  ALL_ENV_KEYS: Object.keys(Deno.env.toObject()).filter(key => key.includes('SQUARE'))
})

if (!squareAppId || !squareLocationId || !squareAccessToken) {
  console.error('Missing Square credentials:', {
    hasAppId: !!squareAppId,
    hasLocationId: !!squareLocationId,
    hasAccessToken: !!squareAccessToken
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

/** ---------- Helpers ---------- */
function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}), ...corsHeaders },
  })
}
function badRequest(msg: string) { return json({ success: false, error: msg }, { status: 400 }) }
function methodNotAllowed(m: string) { return new Response('Method not allowed', { status: 405, headers: corsHeaders }) }
function toCents(amount?: number | string | null) {
  const n = Number(amount)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.round(n * 100)
}

const SQUARE_VERSION = '2024-08-21'
const SQUARE_BASE = 'https://connect.squareup.com'

async function sqFetch(path: string, accessToken: string, init: RequestInit & { body?: unknown } = {}) {
  // Add timeout to prevent hanging requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
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
    
    clearTimeout(timeoutId);
    
    let json = {};
    try {
      json = await res.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      json = { error: 'Invalid JSON response from Square API' };
    }
    
    return { ok: res.ok, status: res.status, json }
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error('Square API request timeout');
      return { 
        ok: false, 
        status: 408, 
        json: { error: 'Request timeout', message: 'Square API request timed out' }
      };
    }
    
    console.error('Square API request failed:', error);
    return { 
      ok: false, 
      status: 500, 
      json: { error: 'Network error', message: error.message || 'Failed to connect to Square API' }
    };
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

/** ---------- Handler ---------- */
serve(async (req) => {
  // Add overall timeout to prevent function hanging
  const startTime = Date.now();
  const FUNCTION_TIMEOUT = 25000; // 25 seconds (less than Supabase's 30s limit)
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Function execution timeout'));
    }, FUNCTION_TIMEOUT);
  });
  
  try {
    return await Promise.race([
      processRequest(req),
      timeoutPromise
    ]);
  } catch (error) {
    console.error('Function execution failed:', error);
    
    if (error.message === 'Function execution timeout') {
      return json({ 
        success: false, 
        error: 'Request timeout - please try again',
        timeout: true 
      }, { status: 408 });
    }
    
    return json({ 
      success: false, 
      error: 'Internal server error', 
      details: error?.message ?? 'Unknown error' 
    }, { status: 500 });
  }
});

async function processRequest(req: Request) {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return methodNotAllowed(req.method)

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    let bodyText = ''
    try { bodyText = await req.text() } catch { return badRequest('Unable to read request body') }

    let body: PaymentRequest
    try { body = JSON.parse(bodyText) } catch { return badRequest('Request body must be valid JSON') }

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

    if (!action) return badRequest('Missing "action"')

    if (action === 'test_connection') {
      console.log('Testing Square connection...')
      
      // Validate credentials are available
      if (!squareAppId || !squareLocationId || !squareAccessToken) {
        console.error('Square credentials missing for test_connection')
        return badRequest('Square credentials not configured properly')
      }
      
      console.log('Square credentials validated successfully')
      return json({ success: true, applicationId: squareAppId, locationId: squareLocationId, environment: squareEnvironment })
    }

    if (action === 'process_payment') {
      console.log('Processing payment request...')
      
      // Validate credentials
      if (!squareAppId || !squareLocationId || !squareAccessToken) {
        console.error('Square credentials missing for process_payment')
        return badRequest('Square credentials not configured properly')
      }
      
      const cents = toCents(amount)
      if (!cents) return badRequest('Invalid "amount". Must be a positive number (USD).')
      
      console.log(`Processing payment for ${cents} cents`)

      const { customerId: ensuredCustomerId } = await ensureCustomer({
        customerId,
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
        address: billingAddress,
        accessToken: squareAccessToken,
      })

      let paymentSourceId: string | undefined = sourceId || token
      let savedCardId: string | undefined

      if (saveCard) {
        if (!ensuredCustomerId) {
          return badRequest('Cannot save card: missing customer context.')
        }
        const oneTimeToken = token || sourceId
        if (!oneTimeToken) return badRequest('Cannot save card: provide a one-time token.')
        const cardRes = await createCardOnFile({
          customerId: ensuredCustomerId,
          sourceId: oneTimeToken,
          verificationToken,
          cardholderName: customerName,
          billingAddress,
          accessToken: squareAccessToken,
        })
        if (!cardRes.ok) return json({ success: false, error: cardRes.error, raw: cardRes.raw }, { status: 400 })
        savedCardId = cardRes.cardId
        paymentSourceId = savedCardId
      }

      if (!paymentSourceId) return badRequest('Missing payment source.')

      const paymentBody: Record<string, unknown> = {
        source_id: paymentSourceId,
        amount_money: { amount: cents, currency: 'USD' },
        location_id: squareLocationId,
        idempotency_key: idempotencyKey || crypto.randomUUID(),
        autocomplete: true,
        reference_id: orderId || undefined,
        buyer_email_address: customerEmail || undefined,
        note: customerName ? `Customer: ${customerName}` : undefined,
        ...(verificationToken && !saveCard ? { verification_token: verificationToken } : {}),
        customer_id: ensuredCustomerId || undefined,
      }

      console.log('Sending payment request to Square API:', {
        amount: cents,
        locationId: squareLocationId,
        sourceId: paymentSourceId,
        hasVerificationToken: !!verificationToken
      })

      const payRes = await sqFetch('/v2/payments', squareAccessToken, { method: 'POST', body: paymentBody })
      
      console.log('Square API response:', {
        ok: payRes.ok,
        status: payRes.status,
        hasErrors: !!(payRes.json?.errors),
        errorCount: Array.isArray(payRes.json?.errors) ? payRes.json.errors.length : 0
      })

      if (!payRes.ok) {
        const firstErr = Array.isArray(payRes.json?.errors) ? payRes.json.errors[0] : null
        const detail = firstErr?.detail || firstErr?.code || payRes.json?.message || 'Payment processing failed'

        console.error('Square payment failed:', {
          status: payRes.status,
          firstError: firstErr,
          allErrors: payRes.json?.errors,
          detail
        })

        if (orderId) {
          await supabase.from('orders')
            .update({ status: 'failed', notes: `Payment failed: ${detail}` })
            .eq('id', orderId)
        }

        // Return the complete error response with raw Square API data
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

      if (orderId) {
        const { error: updateError } = await supabase.from('orders')
          .update({ status: 'completed', square_order_id: paymentId, payment_id: paymentId })
          .eq('id', orderId)
        if (updateError) console.error('Order update failed:', updateError)
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

    return badRequest('Invalid "action"')
  } catch (e) {
    const err = e as Error
    console.error('Square payments function error:', err?.message, err?.stack)
    return json({ success: false, error: 'Internal server error', details: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
