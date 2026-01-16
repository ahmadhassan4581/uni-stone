import { ChevronRight, Lock, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
import QuantityControl from '../components/QuantityControl'
import Reveal from '../components/Reveal'
import { useCart } from '../context/CartContext'

function money(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'GBP' }).format(n)
}

export default function Cart() {
  const { detailedItems, subtotal, setQty, removeItem } = useCart()
  const vat = subtotal - subtotal / 1.2

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-14">
        <Reveal>
          <div className="flex items-center justify-between gap-6">
            <h1 className="text-base font-semibold text-obsidian sm:text-lg">Your Shopping Cart</h1>
            {detailedItems.length ? (
              <Button as={Link} to="/checkout" variant="blue" size="sm" className="h-9 gap-2 px-4">
                <Lock className="h-4 w-4" />
                Checkout Securely
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </Reveal>

        {!detailedItems.length ? (
          <Reveal delay={120}>
            <div className="mt-12 rounded-xl border border-black/10 bg-white p-10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-black/10 bg-neutral-50">
                  <ShoppingBag className="h-5 w-5 text-gold/90" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Empty</p>
                  <p className="mt-2 text-sm text-obsidian/70">Add products from the catalog to see them here.</p>
                </div>
              </div>
              <div className="mt-8">
                <Button as={Link} to="/products" size="lg" variant="blue">
                  Explore Products
                </Button>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="mt-8 border-t border-black/10">
            <div className="grid grid-cols-12 gap-4 py-3 text-[0.7rem] font-semibold text-obsidian/60">
              <div className="col-span-7">Items</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
            </div>

            <div className="border-t border-black/10">
              {detailedItems.map((item, idx) => (
                <Reveal key={item.productId} delay={idx * 50}>
                  <div className="grid grid-cols-12 gap-4 py-5">
                    <div className="col-span-12 flex gap-4 sm:col-span-7">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="h-16 w-16 shrink-0 overflow-hidden rounded border border-black/10 bg-white"
                      >
                        <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                      </Link>

                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.product.slug}`}
                          className="block text-sm font-semibold leading-5 text-obsidian transition-colors hover:text-blue-700"
                        >
                          {item.product.name}
                        </Link>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] text-obsidian/60">
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="transition-colors hover:text-red-700"
                          >
                            Remove
                          </button>
                          <span className="h-3 w-px bg-black/15" />
                          <button type="button" className="transition-colors hover:text-blue-700">
                            Save for later
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-7 flex justify-start sm:col-span-3 sm:justify-center">
                      <QuantityControl
                        value={item.qty}
                        onChange={(v) => setQty(item.productId, v)}
                        tone="light"
                        size="sm"
                      />
                    </div>

                    <div className="col-span-5 text-right sm:col-span-2">
                      <div className="text-sm font-semibold text-obsidian">{money(item.lineTotal)}</div>
                      <div className="mt-1 text-[0.65rem] text-obsidian/50">Inc. VAT</div>
                      <div className="text-[0.65rem] text-obsidian/50">{money(item.product.price)} each</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="border-t border-black/10 py-6">
              <div className="ml-auto w-full max-w-sm space-y-3 text-sm">
                <div className="flex items-center justify-between text-obsidian/70">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{money(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-obsidian">
                  <span>Total</span>
                  <span className="tabular-nums">{money(subtotal)}</span>
                </div>
                <p className="text-[0.65rem] text-obsidian/50">Includes VAT of {money(vat)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-black/10 py-5">
              <Link to="/products" className="text-sm text-blue-700 transition-colors hover:text-blue-800">
                Continue Shopping
              </Link>
              <Button as={Link} to="/checkout" variant="blue" size="sm" className="h-9 gap-2 px-4">
                <Lock className="h-4 w-4" />
                Checkout Securely
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
