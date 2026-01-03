import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
import QuantityControl from '../components/QuantityControl'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useCart } from '../context/CartContext'

function money(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
}

export default function Cart() {
  const { detailedItems, subtotal, totalCount, setQty, removeItem, clear } = useCart()

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <div className="flex items-start justify-between gap-6">
            <SectionHeading
              eyebrow="Cart"
              title="Your selected items"
              subtitle="Adjust quantities, remove items, and proceed when ready."
              tone="light"
            />
            <Button as={Link} to="/products" variant="light" size="sm">
              Continue Shopping
            </Button>
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
          <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-8">
              <div className="grid gap-6">
                {detailedItems.map((item, idx) => (
                  <Reveal key={item.productId} delay={idx * 70}>
                    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                      <div className="grid gap-6 p-6 sm:grid-cols-12 sm:items-center">
                        <Link to={`/products/${item.product.slug}`} className="sm:col-span-4">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-black/10 bg-neutral-50">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full scale-[1.02] object-cover transition-transform duration-1000 ease-luxury hover:scale-[1.08]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                          </div>
                        </Link>

                        <div className="sm:col-span-8">
                          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-[0.7rem] tracking-[0.32em] uppercase text-gold/80">{item.product.category}</p>
                              <p className="mt-2 font-display text-2xl text-obsidian">{item.product.name}</p>
                              <p className="mt-2 text-sm text-obsidian/70">{money(item.product.price)} each</p>
                            </div>

                            <button
                              type="button"
                              aria-label="Remove"
                              onClick={() => removeItem(item.productId)}
                              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-black/10 bg-white text-obsidian/70 transition-all duration-500 ease-luxury hover:border-black/20 hover:bg-neutral-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <QuantityControl value={item.qty} onChange={(v) => setQty(item.productId, v)} tone="light" />
                            <p className="font-display text-2xl text-gold">{money(item.lineTotal)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={120} className="lg:col-span-4">
              <div className="rounded-xl border border-black/10 bg-neutral-50 p-8">
                <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Summary</p>

                <div className="mt-6 space-y-4 text-sm text-obsidian/70">
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span className="tabular-nums">{totalCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{money(subtotal)}</span>
                  </div>
                  <div className="h-px w-full bg-black/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-obsidian/80">Total</span>
                    <span className="font-display text-2xl text-gold">{money(subtotal)}</span>
                  </div>
                </div>

                <div className="mt-8 grid gap-3">
                  <Button as={Link} to="/checkout" size="lg" className="w-full" variant="blue">
                    Checkout
                  </Button>
                  <Button size="lg" variant="light" className="w-full" onClick={clear}>
                    Clear Cart
                  </Button>
                </div>

                <p className="mt-6 text-xs text-obsidian/55">UI only — connect checkout/payment to your backend later.</p>
              </div>
            </Reveal>
          </div>
        )}
      </Container>
    </section>
  )
}
