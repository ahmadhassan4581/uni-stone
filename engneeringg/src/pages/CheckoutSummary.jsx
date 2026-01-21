import { Lock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function CheckoutSummary() {
  const { detailedItems, subtotal, clear } = useCart()
  const { token } = useAuth()
  const navigate = useNavigate()

  const delivery = 60
  const vat = subtotal * 0.2
  const total = subtotal + delivery

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [telephone, setTelephone] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const [placingOrder, setPlacingOrder] = useState(false)
  const [placeOrderError, setPlaceOrderError] = useState('')

  const [deliveryDetails, setDeliveryDetails] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('checkout_delivery_details')
    if (!saved) return
    try {
      setDeliveryDetails(JSON.parse(saved))
    } catch {
      // ignore
    }
  }, [])

  const isValid = useMemo(() => {
    if (!acceptTerms) return false
    if (paymentMethod === 'telephone' && !telephone.trim()) return false
    return true
  }, [acceptTerms, paymentMethod, telephone])

  const ctaLabel = paymentMethod === 'telephone' ? 'Place Order →' : 'Pay For Order →'

  const addressLines = useMemo(() => {
    if (!deliveryDetails) return []
    return [
      deliveryDetails.fullName,
      deliveryDetails.company || null,
      deliveryDetails.address1,
      `${deliveryDetails.town}, ${deliveryDetails.county}, ${deliveryDetails.postcode}`,
    ].filter(Boolean)
  }, [deliveryDetails])

  return (
    <section className="bg-white">
      <Container className="py-8">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold">Marblemosaics Ltd</h1>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-between text-[11px]">
          {['Your Address', 'Delivery Details', 'Order Summary', 'Payment Details', 'Order Complete'].map(
            (step, i) => (
              <div key={step} className="flex flex-1 items-center">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                    i === 2 ? 'bg-blue-700 text-white' : 'border border-gray-300 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`ml-2 ${i === 2 ? 'text-blue-700' : 'text-gray-500'}`}>{step}</span>
                {i !== 4 && <div className="mx-4 h-px flex-1 bg-gray-200" />}
              </div>
            ),
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded border border-gray-200">
              <div className="border-b border-gray-200 p-5">
                <h2 className="text-sm font-semibold">Select Payment Method</h2>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <label className="flex items-center gap-3 rounded border border-blue-600 bg-blue-50 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Card</p>
                    <p className="mt-1 text-[11px] text-gray-600">Powered by ClearAccept</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded border border-gray-200 bg-white p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="telephone"
                    checked={paymentMethod === 'telephone'}
                    onChange={() => setPaymentMethod('telephone')}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Telephone</p>
                    <p className="mt-1 text-[11px] text-gray-600">
                      We will call you to take payment over the telephone then we will ship to the registered card holders
                      address.
                    </p>
                  </div>
                </label>

                {paymentMethod === 'telephone' ? (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700">Telephone</label>
                    <input
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="Example: 0123 4567"
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h2 className="text-sm font-semibold">Additional Information</h2>
                <p className="text-[11px] text-gray-500">
                  <span className="text-red-500">*</span> Required fields
                </p>
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
              </div>
            </div>

            <div className="rounded border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h2 className="text-sm font-semibold">Terms &amp; Conditions</h2>
                <p className="text-[11px] text-gray-500">
                  <span className="text-red-500">*</span> Required fields
                </p>
              </div>
              <div className="p-5 text-xs">
                <p className="text-gray-600">Please tick the box to confirm that you agree to our Terms &amp; Conditions</p>
                <label className="mt-3 flex items-start gap-3 text-gray-700">
                  <input type="checkbox" className="mt-0.5" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                  Yes
                </label>
              </div>
            </div>

            <div className="rounded border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h2 className="text-sm font-semibold">Order Details</h2>
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                  onClick={() => navigate('/checkout/delivery')}
                >
                  Edit
                </button>
              </div>
              <div className="p-5 text-xs">
                <p className="font-semibold text-gray-900">Delivery Details</p>
                <div className="mt-3 text-gray-700 space-y-1">
                  {addressLines.length ? addressLines.map((l) => <p key={l}>{l}</p>) : <p>—</p>}
                </div>

                <div className="mt-4 rounded border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">Standard Mainland UK</p>
                    <p className="font-semibold">{money(delivery)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5">
            <div className="rounded border border-gray-200">
              <div className="border-b border-gray-200 p-5">
                <h2 className="text-sm font-semibold">Order Summary</h2>
              </div>

              <div className="p-5 space-y-4 text-xs">
                {detailedItems.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-14 w-14 border object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.product.name}</p>
                      <p className="text-gray-500">
                        £{item.product.price} × {item.qty}
                      </p>
                    </div>
                    <div className="font-semibold">{money(item.lineTotal)}</div>
                  </div>
                ))}

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
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-sm">
                    <span>Total</span>
                    <span>{money(total)}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">Includes VAT of {money(vat)}</p>
                </div>

                <Button
                  type="button"
                  variant="blue"
                  className="mt-4 w-full text-sm"
                  disabled={!isValid}
                  onClick={async () => {
                    if (!isValid || placingOrder) return

                    setPlaceOrderError('')
                    localStorage.setItem('checkout_payment_method', paymentMethod)
                    localStorage.setItem('checkout_accept_terms', acceptTerms ? '1' : '0')
                    localStorage.setItem('checkout_telephone', telephone.trim())

                    if (paymentMethod === 'card') {
                      navigate('/checkout/payment')
                      return
                    }

                    setPlacingOrder(true)
                    try {
                      const order = await apiFetch('/api/orders', {
                        method: 'POST',
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                        body: JSON.stringify({
                          items: detailedItems.map((i) => ({ productId: i.productId, qty: i.qty })),
                        }),
                      })

                      localStorage.setItem(
                        'checkout_last_order',
                        JSON.stringify({
                          order,
                          placedAt: new Date().toISOString(),
                          paymentMethod: 'telephone',
                          telephone: telephone.trim(),
                          deliveryDetails,
                        }),
                      )
                      clear()
                      navigate('/checkout/complete')
                    } catch (err) {
                      setPlaceOrderError(err?.message || 'Failed to place order')
                    } finally {
                      setPlacingOrder(false)
                    }
                  }}
                >
                  {placingOrder ? 'Placing...' : ctaLabel}
                </Button>

                {placeOrderError ? (
                  <p className="mt-3 text-xs text-red-600">{placeOrderError}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
