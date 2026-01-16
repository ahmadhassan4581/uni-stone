import { ChevronRight, Lock, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
import QuantityControl from '../components/QuantityControl'
import Reveal from '../components/Reveal'
import { useCart } from '../context/CartContext'

function money(n) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'GBP',
  }).format(n)
}

export default function Cart() {
  const { detailedItems, subtotal, setQty, removeItem } = useCart()
  const vat = subtotal - subtotal / 1.2

  return (
    <section className="bg-white">
      <Container className="py-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <h1 className="text-sm font-semibold text-gray-900">Your Shopping Cart</h1>

          {detailedItems.length > 0 && (
            <Button
              as={Link}
              to="/checkout"
              variant="blue"
              size="sm"
              className="h-8 gap-1.5 px-3 text-xs"
            >
              <Lock className="h-3.5 w-3.5" />
              Checkout Securely
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Empty state */}
        {!detailedItems.length ? (
          <div className="py-16 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-4 text-sm text-gray-500">
              Your cart is currently empty.
            </p>
            <Button as={Link} to="/products" size="sm" variant="blue" className="mt-6">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 py-3 text-[11px] font-semibold uppercase text-gray-500">
              <div className="col-span-7">Items</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
            </div>

            <div className="border-t border-black/10">
              {detailedItems.map((item) => (
                <div
                  key={item.productId}
                  className="grid grid-cols-12 gap-4 border-b border-black/10 py-4"
                >
                  {/* Item */}
                  <div className="col-span-7 flex gap-4">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="h-14 w-14 shrink-0 overflow-hidden border border-black/10"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="text-xs">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="font-semibold text-gray-900 hover:underline"
                      >
                        {item.product.name}
                      </Link>

                      <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-500">
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="hover:text-red-600"
                        >
                          Remove
                        </button>
                        <span className="h-3 w-px bg-gray-300" />
                        <button className="hover:text-blue-600">
                          Save For Later
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-3 flex justify-center">
                    <QuantityControl
                      value={item.qty}
                      onChange={(v) => setQty(item.productId, v)}
                      size="sm"
                      tone="light"
                    />
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-right text-xs">
                    <div className="font-semibold text-gray-900">
                      {money(item.lineTotal)}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Inc. VAT
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {money(item.product.price)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex justify-end border-t border-black/10 py-6">
              <div className="w-full max-w-xs text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>

                <div className="mt-2 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{money(subtotal)}</span>
                </div>

                <p className="mt-1 text-[11px] text-gray-500">
                  Includes VAT of {money(vat)}
                </p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <Link
                to="/products"
                className="text-xs text-blue-600 hover:underline"
              >
                Continue Shopping
              </Link>

              <Button
                as={Link}
                to="/checkout"
                variant="blue"
                size="sm"
                className="h-8 gap-1.5 px-3 text-xs"
              >
                <Lock className="h-3.5 w-3.5" />
                Checkout Securely
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        )}
      </Container>
    </section>
  )
}
