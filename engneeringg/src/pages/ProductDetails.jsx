import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/Button'
import Breadcrumbs from '../components/Breadcrumbs'
import Container from '../components/Container'
import QuantityControl from '../components/QuantityControl'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'

function money(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
}

export default function ProductDetails() {
  const { slug } = useParams()
  const { products, loading, error, refresh } = useProducts()
  const product = useMemo(() => products.find((p) => p.slug === slug), [products, slug])
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  useEffect(() => {
    refresh()
  }, [refresh])

  const related = useMemo(() => {
    if (!product) return []
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)
  }, [product, products])

  if (loading) {
    return (
      <section className="bg-white">
        <Container className="py-20 sm:py-24">
          <p className="text-sm text-obsidian/70">Loading...</p>
        </Container>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-white">
        <Container className="py-20 sm:py-24">
          <p className="text-sm text-red-700">{error}</p>
          <div className="mt-10">
            <Button as={Link} to="/products" size="lg" variant="light">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </Container>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="bg-white">
        <Container className="py-20 sm:py-24">
          <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Product</p>
          <h1 className="mt-6 font-display text-4xl tracking-[0.03em] text-obsidian">Not found</h1>
          <p className="mt-6 text-sm leading-7 text-obsidian/70">This product doesn’t exist.</p>
          <div className="mt-10">
            <Button as={Link} to="/products" size="lg" variant="light">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <>
      <section className="bg-white">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <Breadcrumbs
              tone="light"
              items={[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                { label: product.category, to: `/products?category=${encodeURIComponent(product.category)}` },
                { label: product.name },
              ]}
            />
          </Reveal>

          <Reveal>
            <div className="flex items-center justify-between gap-6">
              <Button as={Link} to="/products" variant="light" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button as={Link} to="/cart" variant="light" size="sm">
                View Cart
              </Button>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
            <Reveal className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-5">
              <SectionHeading
                eyebrow={product.category}
                title={product.name}
                subtitle={product.description}
                tone="light"
              />

              <div className="mt-7 rounded-xl border border-black/10 bg-white p-7 shadow-sm">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="text-xs tracking-[0.35em] uppercase text-obsidian/60">Price</p>
                    <p className="mt-3 font-display text-3xl text-gold">{money(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs tracking-[0.35em] uppercase text-obsidian/60">SKU</p>
                    <p className="mt-3 text-sm text-obsidian/70">{product.sku}</p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs tracking-[0.35em] uppercase text-obsidian/60">Quantity</p>
                    <QuantityControl value={qty} onChange={setQty} tone="light" />
                  </div>

                  <Button
                    size="lg"
                    variant="blue"
                    onClick={() => addItem(product.id, qty)}
                    className="w-full"
                  >
                    Add to Cart
                  </Button>

                  <p className="text-xs text-obsidian/55">UI only — connect checkout to your backend later.</p>
                </div>
              </div>

              <div className="mt-8 grid gap-3 text-sm text-obsidian/70">
                {product.bullets.map((b) => (
                  <p key={b}>{b}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {related.length ? (
        <section className="bg-white">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                eyebrow="Related"
                title="More in this category"
                subtitle="Browse similar items and add to cart in seconds."
                tone="light"
              />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, idx) => (
                <Reveal key={p.id} delay={idx * 80}>
                  <Link
                    to={`/products/${p.slug}`}
                    className="group block overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-all duration-700 ease-luxury hover:border-black/20"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full scale-[1.02] object-cover transition-transform duration-1000 ease-luxury group-hover:scale-[1.10]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 p-6">
                        <p className="text-[0.7rem] tracking-[0.32em] uppercase text-gold/80">{p.category}</p>
                        <p className="mt-2 font-display text-xl text-white">{p.name}</p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  )
}
