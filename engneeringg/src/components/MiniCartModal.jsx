import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import QuantityControl from './QuantityControl'

function money(n) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(Number(n || 0))
}

export default function MiniCartModal() {
  const navigate = useNavigate()
  const { isMiniCartOpen, closeMiniCart, detailedItems, subtotal, setQty, removeItem } = useCart()

  useEffect(() => {
    if (!isMiniCartOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMiniCart()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMiniCartOpen, closeMiniCart])

  useEffect(() => {
    document.body.style.overflow = isMiniCartOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMiniCartOpen])

  if (!isMiniCartOpen) return null

  const modal = (
    <div className="fixed inset-0 z-[9999]">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/35"
        onClick={closeMiniCart}
      />

      <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <p className="text-xs font-semibold tracking-[0.12em] text-gray-900">Shopping Cart Updated</p>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-900"
            aria-label="Close"
            onClick={closeMiniCart}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {!detailedItems.length ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-600">Your cart is currently empty.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/10">
              {detailedItems.map((item) => (
                <div key={item.productId} className="grid grid-cols-12 gap-4 py-4">
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="col-span-2 h-16 w-16 overflow-hidden border border-black/10"
                    onClick={closeMiniCart}
                  >
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </Link>

                  <div className="col-span-6 min-w-0">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="block text-xs font-semibold text-gray-900 hover:underline"
                      onClick={closeMiniCart}
                    >
                      {item.product.name}
                    </Link>
                    <button
                      type="button"
                      className="mt-2 text-[11px] text-red-500 hover:underline"
                      onClick={() => removeItem(item.productId)}
                    >
                      remove
                    </button>
                  </div>

                  <div className="col-span-2 flex items-center justify-center">
                    <QuantityControl
                      value={item.qty}
                      onChange={(v) => setQty(item.productId, v)}
                      size="sm"
                      tone="light"
                      max={Math.min(
                        20,
                        Number.isFinite(Number(item?.product?.stock)) ? Math.max(0, Number(item.product.stock)) : 20,
                      )}
                    />
                  </div>

                  <div className="col-span-2 text-right text-xs font-semibold text-gray-900">
                    {money(item.lineTotal)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">{money(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-black/10 px-6 py-4">
          <button
            type="button"
            className="text-xs text-blue-600 hover:underline"
            onClick={closeMiniCart}
          >
            Continue Shopping
          </button>

          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded bg-blue-700 px-5 text-xs font-semibold text-white hover:bg-blue-800"
            onClick={() => {
              closeMiniCart()
              navigate('/cart')
            }}
          >
            Go To Checkout
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
