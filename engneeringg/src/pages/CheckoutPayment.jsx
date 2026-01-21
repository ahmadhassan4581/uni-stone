import { Lock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Button from '../components/Button'
import Container from '../components/Container'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'

function money(n) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(n)
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

function CardPaymentForm({ total }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { detailedItems, clear } = useCart()
  const { token } = useAuth()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = Boolean(stripe && elements)

  const onPay = async () => {
    if (!canSubmit || submitting) return

    setSubmitting(true)
    setError('')

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/complete`,
        },
        redirect: 'if_required',
      })

      if (result?.error) {
        setError(result.error.message || 'Payment failed')
        setSubmitting(false)
        return
      }

      const order = await apiFetch('/api/orders', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: JSON.stringify({
          items: detailedItems.map((i) => ({ productId: i.productId, qty: i.qty })),
        }),
      })

      const deliveryDetailsRaw = localStorage.getItem('checkout_delivery_details')
      const deliveryDetails = deliveryDetailsRaw ? JSON.parse(deliveryDetailsRaw) : null

      localStorage.setItem(
        'checkout_last_order',
        JSON.stringify({
          order,
          placedAt: new Date().toISOString(),
          paymentMethod: 'card',
          deliveryDetails,
          total,
        }),
      )

      clear()
      navigate('/checkout/complete')
    } catch (err) {
      setError(err?.message || 'Payment failed')
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded border border-gray-200">
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <h2 className="text-sm font-semibold">Card Payment</h2>
        <p className="text-xs text-gray-500">ClearAccept</p>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3 rounded border border-green-200 bg-green-50 p-4 text-xs">
          <Lock className="mt-0.5 h-4 w-4 text-green-600" />
          <p className="text-green-700">
            <strong>Secure Checkout</strong>
            <br />
            Our checkout uses 128-bit encryption to keep your details safe.
          </p>
        </div>

        <div className="mt-5 rounded border border-gray-200 p-4">
          <PaymentElement />
        </div>

        {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}

        <Button
          type="button"
          variant="blue"
          className="mt-5 w-full text-sm"
          disabled={!canSubmit || submitting}
          onClick={onPay}
        >
          {submitting ? `Paying ${money(total)}...` : `Pay ${money(total)} →`}
        </Button>
      </div>
    </div>
  )
}

export default function CheckoutPayment() {
  const { subtotal } = useCart()
  const navigate = useNavigate()

  const delivery = 60
  const total = subtotal + delivery

  const paymentMethod = localStorage.getItem('checkout_payment_method') || 'card'

  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (paymentMethod !== 'card') {
      navigate('/checkout/summary')
      return
    }

    async function startPayment() {
      try {
        setLoading(true)
        setError('')

        const publishable = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
        if (!publishable) {
          setError('Missing Stripe publishable key (VITE_STRIPE_PUBLISHABLE_KEY).')
          setLoading(false)
          return
        }

        const resp = await apiFetch('/api/payments/stripe/intent', {
          method: 'POST',
          body: JSON.stringify({ amount: total, currency: 'gbp', kind: 'cart' }),
        })
        setClientSecret(resp?.clientSecret || '')
      } catch (err) {
        setError(err?.message || 'Failed to start payment')
      } finally {
        setLoading(false)
      }
    }

    startPayment()
  }, [navigate, paymentMethod, total])

  const options = useMemo(() => {
    if (!clientSecret) return null
    return {
      clientSecret,
      appearance: { theme: 'stripe' },
    }
  }, [clientSecret])

  return (
    <section className="bg-white">
      <Container className="py-8">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold">Marblemosaics Ltd</h1>
        </div>

        <div className="mb-8 flex items-center justify-between text-[11px]">
          {['Your Address', 'Delivery Details', 'Order Summary', 'Payment Details', 'Order Complete'].map(
            (step, i) => (
              <div key={step} className="flex flex-1 items-center">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                    i === 3 ? 'bg-blue-700 text-white' : 'border border-gray-300 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`ml-2 ${i === 3 ? 'text-blue-700' : 'text-gray-500'}`}>{step}</span>
                {i !== 4 && <div className="mx-4 h-px flex-1 bg-gray-200" />}
              </div>
            ),
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {loading ? (
              <div className="rounded border border-gray-200 p-5 text-xs text-gray-600">Loading payment...</div>
            ) : error ? (
              <div className="rounded border border-red-200 bg-red-50 p-5 text-xs text-red-700">{error}</div>
            ) : options ? (
              <Elements stripe={stripePromise} options={options}>
                <CardPaymentForm total={total} />
              </Elements>
            ) : (
              <div className="rounded border border-gray-200 p-5 text-xs text-gray-600">
                Unable to start payment.
              </div>
            )}

            <Link to="/checkout/summary" className="mt-6 inline-block text-xs text-blue-600 hover:underline">
              ← Back to Order Summary
            </Link>

            <div className="mt-10 text-center text-[11px] text-gray-500">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-gray-200">
                <Lock className="h-4 w-4" />
              </div>
              <p className="mt-2 font-semibold text-gray-700">Secure Checkout</p>
              <p className="mt-1">128-bit Secure Encryption</p>
              <p className="mt-4">Terms &amp; Conditions | Privacy Policy</p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded border border-gray-200">
              <div className="border-b border-gray-200 p-5">
                <h2 className="text-sm font-semibold">Order Summary</h2>
              </div>
              <div className="p-5 text-xs">
                <p className="text-gray-600">
                  Your order total has been locked; please ensure you provide us with your card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
