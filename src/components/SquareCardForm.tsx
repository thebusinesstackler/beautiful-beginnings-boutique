import React, { useEffect, useRef, useState } from 'react'

type SDKStatus = 'loading' | 'ready' | 'error'

// --- Your Supabase project + function URL ---
const PROJECT_REF = 'ibdjzzgvxlscmwlbuewd'
const FUNCTION_URL = 'https://ibdjzzgvxlscmwlbuewd.functions.supabase.co/square-payments';

export default function SquareCardForm() {
  const [sdkStatus, setSdkStatus] = useState<SDKStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const cardContainerRef = useRef<HTMLDivElement>(null)
  const cardInstanceRef = useRef<any>(null)

  async function loadSquareSdkOnce(): Promise<void> {
    if (document.querySelector('script[data-square-sdk]')) return
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://web.squarecdn.com/v1/square.js'
      s.async = true
      s.setAttribute('data-square-sdk', '1')
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('Failed to load Square SDK'))
      document.head.appendChild(s)
    })
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // 1) Get credentials from your edge function
        const resp = await fetch(FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'test_connection' }),
        })
        if (!resp.ok) throw new Error(`test_connection failed: ${await resp.text()}`)
        const data = await resp.json()
        if (!data?.success || !data.applicationId || !data.locationId) {
          throw new Error('Missing credentials in test_connection response')
        }

        // 2) Load Square SDK
        await loadSquareSdkOnce()

        // 3) Create payments + card
        // @ts-ignore
        if (!window.Square) throw new Error('Square SDK not available')
        // @ts-ignore
        const payments = window.Square.payments(data.applicationId, data.locationId)
        const card = await payments.card()
        cardInstanceRef.current = card

        if (!cardContainerRef.current) throw new Error('Card container not mounted')
        await card.attach('#card-container') // must match the id below

        if (!cancelled) setSdkStatus('ready')
      } catch (e: any) {
        console.error('[Square init error]', e)
        if (!cancelled) {
          setError(e?.message || 'Failed to initialize Square')
          setSdkStatus('error')
        }
      }
    })()
    return () => { cancelled = true }
  }, [])

  async function handlePay() {
    try {
      setSubmitting(true)
      if (!cardInstanceRef.current) throw new Error('Card not ready')
      const result = await cardInstanceRef.current.tokenize()
      if (result.status !== 'OK') {
        const msg = result?.errors?.[0]?.message || 'Tokenization failed'
        throw new Error(msg)
      }

      // 4) Charge via your edge function
      const resp = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process_payment',
          sourceId: result.token,
          verificationToken: result.verificationToken, // may be undefined
          amount: 18.95, // <-- set your price (USD)
          // Optional:
          // orderId: 'your-order-id',
          // customerEmail: 'person@example.com',
          // customerName: 'Person Example',
          // saveCard: false,
        }),
      })

      const json = await resp.json()
      if (!resp.ok || !json?.success) throw new Error(json?.error || 'Payment failed')

      alert(`Success! Payment ID: ${json.paymentId}`)
    } catch (e: any) {
      console.error('[Payment submit error]', e)
      alert(e?.message || 'Payment failed')
    } finally {
      setSubmitting(false)
    }
  }

  const isSecure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'

  return (
    <div className="bg-white rounded-xl border border-sage/20 shadow-sm">
      <div className="px-6 py-4 border-b border-sage/10">
        <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
        <p className="text-sm text-gray-600 mt-1">Enter your card details below</p>
      </div>

      <div className="p-6">
        {sdkStatus === 'loading' && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading payment form...</p>
            </div>
          </div>
        )}

        {sdkStatus === 'error' && (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-red-700 font-medium mb-2">Payment System Initialization Failed</h4>
            <p className="text-red-600 text-sm mb-3">Square SDK failed to initialize properly</p>
            <p className="text-xs text-red-500">Details: {error}</p>
          </div>
        )}

        {sdkStatus === 'ready' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div
                ref={cardContainerRef}
                id="card-container"
                className="w-full border border-gray-300 rounded-lg p-4 bg-white min-h-[80px] focus-within:border-sage focus-within:ring-1 focus-within:ring-sage transition-colors"
              />
            </div>

            <button
              onClick={handlePay}
              disabled={submitting}
              className="w-full rounded-lg px-4 py-3 bg-sage text-white disabled:opacity-50"
            >
              {submitting ? 'Processing…' : 'Place Your Order – $18.95'}
            </button>
          </div>
        )}

        {!isSecure && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 font-medium text-sm">Secure connection required</p>
            <p className="text-amber-700 text-sm mt-1">
              HTTPS connection is required for payment processing.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
