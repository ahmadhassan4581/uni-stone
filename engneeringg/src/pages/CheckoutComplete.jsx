import { CheckCircle2, Lock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'

function money(n) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(n)
}

export default function CheckoutComplete() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('checkout_last_order')
    if (!raw) return
    try {
      setData(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  const order = data?.order || null
  const deliveryDetails = data?.deliveryDetails || null

  const items = useMemo(() => {
    if (Array.isArray(order?.items)) return order.items
    return []
  }, [order])

  const subtotal = useMemo(() => {
    if (typeof order?.subtotal === 'number') return order.subtotal
    const sum = items.reduce((s, i) => s + (Number(i.lineTotal) || 0), 0)
    return sum
  }, [order, items])

  const delivery = 60
  const total = useMemo(() => {
    if (typeof order?.total === 'number') return order.total
    return subtotal + delivery
  }, [order, subtotal])

  const placedLabel = useMemo(() => {
    const iso = data?.placedAt
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
  }, [data])

  const addressLines = useMemo(() => {
    if (!deliveryDetails) return []
    return [
      deliveryDetails.fullName,
      deliveryDetails.company || null,
      deliveryDetails.address1,
      `${deliveryDetails.town}, ${deliveryDetails.county}, ${deliveryDetails.postcode}`,
      deliveryDetails.telephone || null,
    ].filter(Boolean)
  }, [deliveryDetails])

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
                    i === 4 ? 'bg-blue-700 text-white' : 'border border-gray-300 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`ml-2 ${i === 4 ? 'text-blue-700' : 'text-gray-500'}`}>{step}</span>
                {i !== 4 && <div className="mx-4 h-px flex-1 bg-gray-200" />}
              </div>
            ),
          )}
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="rounded border border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
              <div className="text-xs">
                <p className="font-semibold text-green-800">Congratulations! Your order has been placed</p>
                <p className="mt-2 text-green-700">
                  We sent an email to confirm your order details and receipt.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <h2 className="text-sm font-semibold">Order Details</h2>
              <p className="text-xs text-gray-500">{placedLabel ? `Placed: ${placedLabel}` : null}</p>
            </div>

            <div className="p-5 space-y-6 text-xs">
              <div className="rounded border border-gray-200 bg-gray-50 p-4">
                <p className="font-semibold text-gray-900">Delivery Details</p>
                <div className="mt-2 space-y-1 text-gray-700">
                  {addressLines.length ? addressLines.map((l) => <p key={l}>{l}</p>) : <p>—</p>}
                </div>
              </div>

              <div className="rounded border border-gray-200">
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">Your Order</p>
                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                    onClick={() => navigate('/cart')}
                  >
                    Edit
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {items.length ? (
                    items.map((item) => (
                      <div key={item.productId || item.slug || item.name} className="flex gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-14 w-14 border object-cover" />
                        ) : (
                          <div className="h-14 w-14 border bg-gray-50" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-gray-500">Quantity {item.qty}</p>
                        </div>
                        <div className="font-semibold">{money(item.lineTotal || (item.price || 0) * (item.qty || 1))}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No order items found.</p>
                  )}

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{money(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>
                        {money(delivery)} <span className="text-gray-400">(Ex Tax)</span>
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{money(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button to="/products" as={Link} variant="blue" className="w-full text-sm">
                Continue Shopping →
              </Button>
            </div>
          </div>

          <div className="mt-10 text-center text-[11px] text-gray-500">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-gray-200">
              <Lock className="h-4 w-4" />
            </div>
            <p className="mt-2 font-semibold text-gray-700">Secure Checkout</p>
            <p className="mt-1">128-bit Secure Encryption</p>
            <p className="mt-4">Terms &amp; Conditions | Privacy Policy</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
