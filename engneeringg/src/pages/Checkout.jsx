import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'
import Button from '../components/Button'
import { useCart } from '../context/CartContext'

function money(n) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(n)
}

export default function Checkout() {
  const { detailedItems, subtotal } = useCart()

  const delivery = 60
  const vat = subtotal * 0.2
  const total = subtotal + delivery

  return (
    <section className="bg-white">
      <Container className="py-10">
        {/* Progress bar */}
        <div className="mb-10 flex items-center justify-between text-xs">
          {[
            'Your Account',
            'Delivery Details',
            'Order Summary',
            'Payment Details',
            'Order Complete',
          ].map((step, i) => (
            <div key={step} className="flex flex-1 items-center">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                  i === 0
                    ? 'bg-blue-700 text-white'
                    : 'border border-gray-300 text-gray-500'
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`ml-2 ${
                  i === 0 ? 'text-blue-700' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
              {i !== 4 && <div className="mx-4 h-px flex-1 bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <div className="rounded border border-gray-200">
              <div className="border-b border-gray-200 p-5">
                <h2 className="text-sm font-semibold">Secure Checkout</h2>
              </div>

              <div className="p-5 space-y-6">
                <div className="flex items-start gap-3 rounded border border-green-200 bg-green-50 p-4 text-xs">
                  <Lock className="mt-0.5 h-4 w-4 text-green-600" />
                  <p className="text-green-700">
                    <strong>Secure Checkout</strong>
                    <br />
                    Our checkout uses 128-bit encryption to keep your details
                    safe.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    <span className="text-red-500">*</span> Enter your email
                    address
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    We will send an email to confirm your order details.
                  </p>
                  <input
                    type="email"
                    placeholder="Example: john.smith@gmail.com"
                    className="mt-3 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <Link
              to="/cart"
              className="mt-6 inline-block text-xs text-blue-600 hover:underline"
            >
              ← Back to Cart
            </Link>
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
                      <p className="font-semibold text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-gray-500">
                        £{item.product.price} × {item.qty}
                      </p>
                    </div>
                    <div className="font-semibold">
                      {money(item.lineTotal)}
                    </div>
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
                  <p className="mt-1 text-[11px] text-gray-500">
                    Includes VAT of {money(vat)}
                  </p>
                </div>

                <Button
                  to="/checkout/delivery"
                  as={Link}
                  variant="blue"
                  className="mt-4 w-full text-sm"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Delivery Details →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
