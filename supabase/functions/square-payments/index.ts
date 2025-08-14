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

/** ---------- Types ---------- */
interface BillingAddress {
  addressLine1?: string
  addressLine2?: string
  locality?: string // city
  administrativeDistrictLevel1?: string // state/province
  postalCode?: string
  country?: string // ISO 3166-1 alpha-2, e.g., "US"
}

interface PaymentRequest {
  action: 'test_connection' | 'process_payment'
  // payment source (Web Payments SDK token or existing card_id)
  token?: string
  sourceId?: string
  verificationToken?: string // from Web Payments SDK (3DS). Required when tokenizing a new card.
  amount?: number
  orderId?: string
  idempotencyKey?: string

  // customer fields
  customerId?: string
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  billingAddress?: BillingAddress

  // set true to save a card on file BEFORE paying (uses the one-time token)
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

// Square HTTP wrapper (production only)
const SQUARE_VERSION = '2024-08-21'
const SQUARE_BASE = 'https://connect.squareup.com'

async function sqFetch(path: string, accessToken: string, init: RequestInit & { body?: unknown } = {}) {
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
  })
  const json = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, json }
}

// Try to find an existing customer by email; else create one.
// If customerId is provided, we trust and return it.
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

  // If no email and no name, we can’t upsert — return empty (caller can proceed without a customer)
  if (!email && !name) return {}

  // Prefer search by email when available
  if (email) {
    const searchBody = { query: { filter: { email_address: { exact: email } } } }
    const search = await sqFetch('/v2/customers/search', accessToken, { method: 'POST', body: searchBody })
    if (search.ok && Array.isArray(search.json?.customers) && search.json.customers.length > 0) {
      return { customerId: search.json.customers[0].id as string }
    }
  }

  // Create new customer
  const createBody: Record<string, unknown> = {
    idempotency_key: crypto.randomUUID(),
    email_address: email,
    given_name: name, // you can split first/last on your end if needed
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
  if (!created.ok) {
    // If creation fails, just proceed without a customer instead of hard-failing the payment
    return {}
  }
  return { customerId: created.json?.customer?.id as string }
}

// Save a card on file to a customer using a one-time token from Web Payments SDK.
// Requires verification_token when your account mandates SCA (recommended).
async function createCardOnFile(params: {
  customerId: string
  sourceId: string // one-time token from Web Payments SDK
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
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return methodNotAllowed(req.method)

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const squareAppId = Deno.env.get('SQUARE_APP_ID')
    const squareLocationId = Deno.env.get('SQUARE_LOCATION_ID')
    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN')
    const squareEnvironment = 'production'

    if (!squareAppId || !squareLocationId || !squareAccessToken) {
      return json(
        { success: false, error: 'Square configuration not found. Set SQUARE_APP_ID, SQUARE_LOCATION_ID, SQUARE_ACCESS_TOKEN.' },
        { status: 500 },
      )
    }

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
      return json({ success: true, applicationId: squareAppId, locationId: squareLocationId, environment: squareEnvironment })
    }

    if (action === 'process_payment') {
      const cents = toCents(amount)
      if (!cents) return badRequest('Invalid "amount". Must be a positive number (USD).')

      // Figure out customer (optional but recommended when saving card or associating payment history)
      const { customerId: ensuredCustomerId } = await ensureCustomer({
        customerId,
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
        address: billingAddress,
        accessToken: squareAccessToken,
      })

      // Determine payment source:
      // - If saveCard is true and we have a one-time token, first create a card on file, then pay with that card_id.
      // - Else if caller passes a card_id directly in sourceId, use it.
      // - Else use the one-time token directly for a one-off payment.
      let paymentSourceId: string | undefined = sourceId || token
      let savedCardId: string | undefined

      if (saveCard) {
        if (!ensuredCustomerId) {
          return badRequest('Cannot save card: missing customer context. Provide "customerId" or at least "customerEmail" or "customerName".')
        }
        const oneTimeToken = token || sourceId
        if (!oneTimeToken) return badRequest('Cannot save card: provide a one-time token in "sourceId" or "token".')
        // Strongly recommended to pass verificationToken when creating the card
        const cardRes = await createCardOnFile({
          customerId: ensuredCustomerId,
          sourceId: oneTimeToken,
          verificationToken,
          cardholderName: customerName,
          billingAddress,
          accessToken: squareAccessToken,
        })
        if (!cardRes.ok) {
          // Do not update DB order here; we haven’t attempted payment yet
          return json({ success: false, error: cardRes.error, raw: cardRes.raw }, { status: 400 })
        }
        savedCardId = cardRes.cardId
        paymentSourceId = savedCardId
      }

      if (!paymentSourceId) return badRequest('Missing payment source. Provide "sourceId" (or "token").')

      const paymentBody: Record<string, unknown> = {
        source_id: paymentSourceId,
        amount_money: { amount: cents, currency: 'USD' },
        location_id: squareLocationId,
        idempotency_key: idempotencyKey || crypto.randomUUID(),
        autocomplete: true,
        reference_id: orderId || undefined,
        buyer_email_address: customerEmail || undefined,
        note: customerName ? `Customer: ${customerName}` : undefined,
        // If charging a newly-tokenized card directly (not card on file), include verification token
        ...(verificationToken && !saveCard ? { verification_token: verificationToken } : {}),
        customer_id: ensuredCustomerId || undefined,
      }

      const payRes = await sqFetch('/v2/payments', squareAccessToken, { method: 'POST', body: paymentBody })
      if (!payRes.ok) {
        const firstErr = Array.isArray(payRes.json?.errors) ? payRes.json.errors[0] : null
        const detail = firstErr?.detail || firstErr?.code || payRes.json?.message || 'Payment processing failed'

        if (orderId) {
          await supabase.from('orders')
            .update({ status: 'failed', notes: `Payment failed: ${detail}` })
            .eq('id', orderId)
        }
        return json({ success: false, error: detail, raw: payRes.json }, { status: 400 })
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
        savedCardId, // present if saveCard=true
      })
    }

    return badRequest('Invalid "action"')
  } catch (e) {
    const err = e as Error
    console.error('Square payments function error:', err?.message, err?.stack)
    return json({ success: false, error: 'Internal server error', details: err?.message ?? 'Unknown error' }, { status: 500 })
  }
})
