// Enhanced Square Payments Function v3.0 - Complete Credential Validation & Debugging
// Force redeployment: 2025-08-18T17:45:00Z - Complete credential validation overhaul
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/** ---------- CORS Configuration ---------- */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

/** ---------- Enhanced Secret Validation System ---------- */
console.log('🚀 Enhanced Square Payments Function v3.0 - Starting comprehensive validation')

// Character-by-character debugging function
function debugSecret(name: string, value: string | undefined): void {
  if (!value) {
    console.log(`❌ ${name}: UNDEFINED/NULL`)
    return
  }
  
  console.log(`🔍 ${name} detailed analysis:`)
  console.log(`  Raw value type: ${typeof value}`)
  console.log(`  Raw length: ${value.length}`)
  console.log(`  First 10 chars: "${value.substring(0, 10)}${value.length > 10 ? '...' : ''}"`)
  console.log(`  Last 5 chars: "${value.length > 5 ? '...' + value.substring(value.length - 5) : value}"`)
  console.log(`  Contains spaces: ${value.includes(' ')}`)
  console.log(`  Contains newlines: ${value.includes('\n')}`)
  console.log(`  Contains tabs: ${value.includes('\t')}`)
  console.log(`  Trimmed length: ${value.trim().length}`)
  
  // Character code analysis for hidden characters
  const firstFewChars = value.substring(0, 5).split('').map((char, i) => 
    `[${i}]="${char}" (${char.charCodeAt(0)})`
  ).join(' ')
  console.log(`  First 5 char codes: ${firstFewChars}`)
}

// Get all environment variables first
const allEnvKeys = Object.keys(Deno.env.toObject())
const squareRelatedKeys = allEnvKeys.filter(key => key.includes('SQUARE'))
console.log('🔍 All environment keys containing "SQUARE":', squareRelatedKeys)
console.log('🔍 Total environment variables found:', allEnvKeys.length)

// Get raw values
const rawSquareApplicationId = Deno.env.get('SQUARE_APPLICATION_ID')
const rawSquareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN') 
const rawSquareLocationId = Deno.env.get('SQUARE_LOCATION_ID')
const rawSquareEnvironment = Deno.env.get('SQUARE_ENVIRONMENT')

console.log('\n🔍 ===== RAW SECRET ANALYSIS =====')
debugSecret('SQUARE_APPLICATION_ID', rawSquareApplicationId)
debugSecret('SQUARE_ACCESS_TOKEN', rawSquareAccessToken)
debugSecret('SQUARE_LOCATION_ID', rawSquareLocationId)
debugSecret('SQUARE_ENVIRONMENT', rawSquareEnvironment)

// Clean and validate
const SQUARE_APPLICATION_ID = rawSquareApplicationId?.trim()
const SQUARE_ACCESS_TOKEN = rawSquareAccessToken?.trim()
const SQUARE_LOCATION_ID = rawSquareLocationId?.trim()
let SQUARE_ENVIRONMENT = (rawSquareEnvironment || 'production').trim()

// Handle encrypted/hashed environment values
if (SQUARE_ENVIRONMENT && SQUARE_ENVIRONMENT.length > 20) {
  console.log('⚠️ SQUARE_ENVIRONMENT appears to be encrypted/hashed, defaulting to production')
  SQUARE_ENVIRONMENT = 'production'
}

/** ---------- Format Validation ---------- */
function validateSquareCredentialFormats() {
  console.log('\n🔍 ===== FORMAT VALIDATION =====')
  
  const validation = {
    applicationId: {
      present: Boolean(SQUARE_APPLICATION_ID && SQUARE_APPLICATION_ID.length > 0),
      hasValue: !!SQUARE_APPLICATION_ID,
      length: SQUARE_APPLICATION_ID?.length || 0,
      startsCorrectly: SQUARE_APPLICATION_ID?.startsWith('sq0idp-') || false,
      expectedLength: SQUARE_APPLICATION_ID ? (SQUARE_APPLICATION_ID.length >= 20 && SQUARE_APPLICATION_ID.length <= 50) : false,
      validFormat: false
    },
    accessToken: {
      present: Boolean(SQUARE_ACCESS_TOKEN && SQUARE_ACCESS_TOKEN.length > 0),
      hasValue: !!SQUARE_ACCESS_TOKEN,
      length: SQUARE_ACCESS_TOKEN?.length || 0,
      startsCorrectly: SQUARE_ACCESS_TOKEN?.startsWith('EAAAl') || false,
      expectedLength: SQUARE_ACCESS_TOKEN ? SQUARE_ACCESS_TOKEN.length >= 60 : false,
      validFormat: false
    },
    locationId: {
      present: Boolean(SQUARE_LOCATION_ID && SQUARE_LOCATION_ID.length > 0),
      hasValue: !!SQUARE_LOCATION_ID,
      length: SQUARE_LOCATION_ID?.length || 0,
      expectedLength: SQUARE_LOCATION_ID ? SQUARE_LOCATION_ID.length >= 10 : false,
      validFormat: false
    },
    environment: {
      present: Boolean(SQUARE_ENVIRONMENT),
      hasValue: !!SQUARE_ENVIRONMENT,
      isValidValue: ['production', 'sandbox'].includes(SQUARE_ENVIRONMENT),
      value: SQUARE_ENVIRONMENT
    }
  }
  
  // Determine valid formats
  validation.applicationId.validFormat = validation.applicationId.present && 
                                       validation.applicationId.startsCorrectly && 
                                       validation.applicationId.expectedLength
                                       
  validation.accessToken.validFormat = validation.accessToken.present && 
                                      validation.accessToken.startsCorrectly && 
                                      validation.accessToken.expectedLength
                                      
  validation.locationId.validFormat = validation.locationId.present && 
                                    validation.locationId.expectedLength
  
  console.log('📊 Validation Results:')
  console.log('  SQUARE_APPLICATION_ID:', {
    present: validation.applicationId.present ? '✅' : '❌',
    format: validation.applicationId.validFormat ? '✅' : '❌',
    details: `Length: ${validation.applicationId.length}, Starts with sq0idp-: ${validation.applicationId.startsCorrectly}`
  })
  
  console.log('  SQUARE_ACCESS_TOKEN:', {
    present: validation.accessToken.present ? '✅' : '❌', 
    format: validation.accessToken.validFormat ? '✅' : '❌',
    details: `Length: ${validation.accessToken.length}, Starts with EAAAl: ${validation.accessToken.startsCorrectly}`
  })
  
  console.log('  SQUARE_LOCATION_ID:', {
    present: validation.locationId.present ? '✅' : '❌',
    format: validation.locationId.validFormat ? '✅' : '❌',
    details: `Length: ${validation.locationId.length}`
  })
  
  console.log('  SQUARE_ENVIRONMENT:', {
    present: validation.environment.present ? '✅' : '❌',
    valid: validation.environment.isValidValue ? '✅' : '❌',
    value: validation.environment.value
  })
  
  return validation
}

const validation = validateSquareCredentialFormats()

// Overall credential status
const hasAllCredentials = validation.applicationId.validFormat && 
                         validation.accessToken.validFormat && 
                         validation.locationId.validFormat &&
                         validation.environment.isValidValue

console.log('\n🎯 ===== OVERALL STATUS =====')
console.log(`All credentials valid: ${hasAllCredentials ? '✅ YES' : '❌ NO'}`)

if (!hasAllCredentials) {
  console.error('❌ CREDENTIAL ISSUES DETECTED:')
  if (!validation.applicationId.validFormat) {
    console.error('  - SQUARE_APPLICATION_ID: Invalid or missing')
  }
  if (!validation.accessToken.validFormat) {
    console.error('  - SQUARE_ACCESS_TOKEN: Invalid or missing')  
  }
  if (!validation.locationId.validFormat) {
    console.error('  - SQUARE_LOCATION_ID: Invalid or missing')
  }
  if (!validation.environment.isValidValue) {
    console.error('  - SQUARE_ENVIRONMENT: Invalid value')
  }
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
  action: 'test_connection' | 'process_payment' | 'validate_secrets'
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
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)
  
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

    const { action } = body || {}

    if (!action) {
      return badRequest('Missing "action" parameter')
    }

    // NEW: Dedicated secret validation endpoint
    if (action === 'validate_secrets') {
      console.log('🔍 Secret validation endpoint called')
      
      return json({
        success: true,
        validation,
        hasAllCredentials,
        environment: SQUARE_ENVIRONMENT,
        timestamp: new Date().toISOString(),
        debug: {
          rawAppIdExists: !!rawSquareApplicationId,
          rawAccessTokenExists: !!rawSquareAccessToken, 
          rawLocationIdExists: !!rawSquareLocationId,
          rawEnvironmentExists: !!rawSquareEnvironment,
          allSquareKeys: squareRelatedKeys
        }
      })
    }

    // Handle test_connection action
    if (action === 'test_connection') {
      console.log('🔍 Testing Square connection...')
      
      if (!hasAllCredentials) {
        console.error('❌ Square credentials missing for test_connection')
        
        const missingCredentials = []
        if (!validation.applicationId.validFormat) missingCredentials.push('SQUARE_APPLICATION_ID (invalid format)')
        if (!validation.accessToken.validFormat) missingCredentials.push('SQUARE_ACCESS_TOKEN (invalid format)')
        if (!validation.locationId.validFormat) missingCredentials.push('SQUARE_LOCATION_ID (invalid format)')
        
        return badRequest(`Square credentials not configured properly. Issues: ${missingCredentials.join(', ')}`)
      }
      
      console.log('✅ Square credentials validated successfully')
      return json({ 
        success: true, 
        applicationId: SQUARE_APPLICATION_ID, 
        locationId: SQUARE_LOCATION_ID, 
        environment: SQUARE_ENVIRONMENT 
      })
    }

    // Handle process_payment action - keep existing logic
    if (action === 'process_payment') {
      console.log('💳 Processing payment request...')
      
      if (!hasAllCredentials) {
        console.error('❌ Square credentials missing for process_payment')
        return badRequest('Square payment system not configured properly')
      }
      
      const {
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

      console.log('📡 Sending payment request to Square API')

      const payRes = await sqFetch('/v2/payments', SQUARE_ACCESS_TOKEN!, { 
        method: 'POST', 
        body: paymentBody 
      })
      
      console.log('📊 Square API response:', {
        ok: payRes.ok,
        status: payRes.status,
        hasErrors: !!(payRes.json?.errors)
      })

      if (!payRes.ok) {
        const firstErr = Array.isArray(payRes.json?.errors) ? payRes.json.errors[0] : null
        const detail = firstErr?.detail || firstErr?.code || payRes.json?.message || 'Payment processing failed'

        console.error('❌ Square payment failed:', detail)

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

      console.log('✅ Payment successful:', paymentId?.substring(0, 10) + '...')

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

    return badRequest(`Invalid action: "${action}". Supported actions: test_connection, process_payment, validate_secrets`)
    
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
