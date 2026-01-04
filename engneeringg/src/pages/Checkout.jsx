import { CreditCard, Landmark, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useCart } from '../context/CartContext'
import { apiFetch } from '../lib/api'

function money(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true)
      return
    }

    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = () => resolve(true)
    s.onerror = () => reject(new Error('Failed to load payment script'))
    document.body.appendChild(s)
  })
}

function postRedirect(url, params) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = url

  Object.entries(params || {}).forEach(([k, v]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = k
    input.value = String(v)
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}

export default function Checkout() {
  const { detailedItems, subtotal, totalCount, clear } = useCart()
  const location = useLocation()
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const consultationState = location?.state?.kind === 'consultation' ? location.state : null
  const mode = consultationState ? 'consultation' : 'cart'

  const effectiveTotalCount = mode === 'consultation' ? 1 : totalCount
  const effectiveSubtotal = mode === 'consultation' ? Number(consultationState?.amount || 0) : subtotal
  const hasItems = effectiveTotalCount > 0 && effectiveSubtotal > 0

  const payload = useMemo(() => {
    if (mode === 'consultation') {
      return {
        kind: 'consultation',
        packageId: consultationState?.packageId,
        packageName: consultationState?.packageName,
        amount: Number(consultationState?.amount || 0),
        currency: consultationState?.currency || 'USD',
      }
    }

    return {
      kind: 'cart',
      items: detailedItems.map((i) => ({ productId: i.productId, qty: i.qty })),
      subtotal,
      currency: 'USD',
    }
  }, [consultationState, detailedItems, mode, subtotal])

  const startPayment = async (provider) => {
    setLoading(provider)
    setError('')
    setSuccess('')
    try {
      const res = await apiFetch(`/api/payments/${provider}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (res?.redirectUrl) {
        window.location.href = res.redirectUrl
        return
      }

       if (provider === 'razorpay') {
         await loadScript('https://checkout.razorpay.com/v1/checkout.js')

         if (!window.Razorpay) {
           throw new Error('Razorpay is unavailable')
         }

         const rzp = new window.Razorpay({
           key: res?.keyId,
           amount: res?.amount,
           currency: res?.currency,
           name: res?.name,
           description: res?.description,
           order_id: res?.orderId,
           handler: async (response) => {
             try {
               await apiFetch('/api/payments/razorpay/verify', {
                 method: 'POST',
                 body: JSON.stringify({
                   orderId: res?.orderId,
                   paymentId: response?.razorpay_payment_id,
                   signature: response?.razorpay_signature,
                 }),
               })
               setSuccess('Payment successful')
             } catch (e) {
               setError(e?.message || 'Payment verification failed')
             }
           },
           modal: {
             ondismiss: () => setLoading(''),
           },
         })

         rzp.on('payment.failed', (evt) => {
           setError(evt?.error?.description || 'Payment failed')
         })

         rzp.open()
         return
       }

       if (provider === 'paytm') {
         if (res?.payUrl && res?.params) {
           postRedirect(res.payUrl, res.params)
           return
         }
       }

      setSuccess(res?.message || 'Payment started')
    } catch (err) {
      setError(err?.message || 'Unable to start payment')
    } finally {
      setLoading('')
    }
  }

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <Breadcrumbs
            tone="light"
            items={[
              { label: 'Home', to: '/' },
              ...(mode === 'consultation'
                ? [{ label: 'Consultation', to: '/payment' }]
                : [{ label: 'Cart', to: '/cart' }]),
              { label: 'Checkout' },
            ]}
          />
        </Reveal>

        <Reveal className="mt-8">
          <div className="flex items-start justify-between gap-6">
            <SectionHeading
              eyebrow="Checkout"
              title="Choose payment method"
              subtitle="Select one provider to complete payment."
              tone="light"
            />
            <Button as={Link} to={mode === 'consultation' ? '/payment' : '/cart'} variant="light" size="sm">
              {mode === 'consultation' ? 'Back to Consultation' : 'Back to Cart'}
            </Button>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-7">
            <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Payment options</p>

              {error ? <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
              {success ? (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</div>
              ) : null}

              <div className="mt-6 grid gap-4">
                <div className="rounded-xl border border-black/10 bg-neutral-50 p-6">
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-black/10 bg-white">
                        <CreditCard className="h-5 w-5 text-gold/90" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-obsidian">Stripe</p>
                        <p className="mt-2 text-sm leading-7 text-obsidian/70">Pay with card (Visa/Mastercard).</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="blue"
                      size="sm"
                      className="w-full sm:w-auto h-auto py-3 sm:h-10 sm:py-0"
                      disabled={!hasItems || loading}
                      onClick={() => startPayment('stripe')}
                    >
                      {loading === 'stripe' ? 'Starting...' : 'Pay with Stripe'}
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 bg-neutral-50 p-6">
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-black/10 bg-white">
                        <Landmark className="h-5 w-5 text-gold/90" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-obsidian">Razorpay</p>
                        <p className="mt-2 text-sm leading-7 text-obsidian/70">Pay with UPI / cards / wallets.</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="blue"
                      size="sm"
                      className="w-full sm:w-auto h-auto py-3 sm:h-10 sm:py-0"
                      disabled={!hasItems || loading}
                      onClick={() => startPayment('razorpay')}
                    >
                      {loading === 'razorpay' ? 'Starting...' : 'Pay with Razorpay'}
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 bg-neutral-50 p-6">
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-black/10 bg-white">
                        <Wallet className="h-5 w-5 text-gold/90" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-obsidian">Paytm</p>
                        <p className="mt-2 text-sm leading-7 text-obsidian/70">Paytm wallet / UPI (requires merchant setup).</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="blue"
                      size="sm"
                      className="w-full sm:w-auto h-auto py-3 sm:h-10 sm:py-0"
                      disabled={!hasItems || loading}
                      onClick={() => startPayment('paytm')}
                    >
                      {loading === 'paytm' ? 'Starting...' : 'Pay with Paytm'}
                    </Button>
                  </div>
                </div>
              </div>

              {!hasItems ? (
                <p className="mt-6 text-xs text-obsidian/55">
                  {mode === 'consultation'
                    ? 'Select a consultation package before proceeding.'
                    : 'Your cart is empty. Add products before checkout.'}
                </p>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={130} className="lg:col-span-5">
            <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Order summary</p>

              {mode === 'consultation' ? (
                <div className="mt-6 rounded-xl border border-black/10 bg-neutral-50 p-5">
                  <p className="text-xs tracking-[0.35em] uppercase text-obsidian/60">Package</p>
                  <p className="mt-2 font-display text-2xl text-obsidian">{consultationState?.packageName || 'Consultation'}</p>
                </div>
              ) : null}

              <div className="mt-6 space-y-4 text-sm text-obsidian/70">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span className="tabular-nums">{effectiveTotalCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{money(effectiveSubtotal)}</span>
                </div>
                <div className="h-px w-full bg-black/10" />
                <div className="flex items-center justify-between">
                  <span className="text-obsidian/80">Total</span>
                  <span className="font-display text-2xl text-gold">{money(effectiveSubtotal)}</span>
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                {mode === 'cart' ? (
                  <Button type="button" size="lg" variant="light" className="w-full" onClick={clear} disabled={!totalCount}>
                    Clear Cart
                  </Button>
                ) : null}
              </div>

              <p className="mt-6 text-xs text-obsidian/55">
                Note: To enable real payments, provider API keys are required on the backend.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
