import { ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import Breadcrumbs from '../components/Breadcrumbs'
import Container from '../components/Container'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'

export default function Products() {
  const { totalCount } = useCart()
  const { products, loading, error, refresh } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'All'
  const q = (searchParams.get('q') || '').trim()
  const [sort, setSort] = useState('featured')
  const [perPage, setPerPage] = useState(12)
  const [page, setPage] = useState(1)

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    setPage(1)
  }, [activeCategory, q])

  const filtered = useMemo(() => {
    const normalizedQ = q.toLowerCase()

    const byCategory =
      !activeCategory || activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory)

    if (!normalizedQ) return byCategory

    return byCategory.filter((p) => {
      const hay = `${p?.name || ''} ${p?.category || ''} ${p?.description || ''}`.toLowerCase()
      return hay.includes(normalizedQ)
    })
  }, [activeCategory, products, q])

  const sorted = useMemo(() => {
    const next = [...filtered]
    if (sort === 'price_asc') next.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') next.sort((a, b) => b.price - a.price)
    if (sort === 'name_asc') next.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'name_desc') next.sort((a, b) => b.name.localeCompare(a.name))
    return next
  }, [filtered, sort])

  const pageCount = useMemo(() => Math.max(1, Math.ceil(sorted.length / perPage)), [sorted.length, perPage])
  const paged = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), pageCount)
    const start = (safePage - 1) * perPage
    return sorted.slice(start, start + perPage)
  }, [sorted, perPage, page, pageCount])

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams)
    if (!cat || cat === 'All') next.delete('category')
    else next.set('category', cat)
    setSearchParams(next)
    setPage(1)
  }

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <Breadcrumbs
            tone="light"
            items={[
              { label: 'Home', to: '/' },
              { label: 'Products', to: '/products' },
              ...(activeCategory && activeCategory !== 'All' ? [{ label: activeCategory }] : []),
            ]}
          />
        </Reveal>

        <Reveal>
          <div className="flex items-start justify-between gap-6">
            <SectionHeading
              eyebrow="Products"
              title="A curated catalog"
              subtitle="Click an image to view details. Add to cart from the product page."
              tone="light"
            />
            <Button as={Link} to="/cart" variant="light" size="sm" className="shrink-0">
              <ShoppingBag className="h-4 w-4" />
              Cart ({totalCount})
            </Button>
          </div>
        </Reveal>

        <div className="mt-12">
          {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

          <div className="mb-6 grid gap-4 rounded-xl border border-black/10 bg-white p-5 sm:flex sm:items-end sm:justify-between">
              <div>
                <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Showing</p>
                <p className="mt-2 text-sm text-obsidian/70">
                  {activeCategory === 'All' ? 'All items' : activeCategory}
                  {q ? ` · Search: "${q}"` : ''} · {sorted.length} products
                </p>
              </div>

              <div className="grid gap-3 sm:flex sm:items-end">
                <label className="grid gap-2">
                  <span className="text-[0.7rem] tracking-[0.32em] uppercase text-obsidian/60">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value)
                      setPage(1)
                    }}
                    className="h-11 rounded-md border border-black/10 bg-white px-3 text-sm text-obsidian/80 outline-none transition-colors duration-500 ease-luxury focus:border-gold/55"
                  >
                    <option value="featured" className="bg-white">
                      Featured
                    </option>
                    <option value="price_asc" className="bg-white">
                      Price: Low → High
                    </option>
                    <option value="price_desc" className="bg-white">
                      Price: High → Low
                    </option>
                    <option value="name_asc" className="bg-white">
                      Name: A → Z
                    </option>
                    <option value="name_desc" className="bg-white">
                      Name: Z → A
                    </option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-[0.7rem] tracking-[0.32em] uppercase text-obsidian/60">Per page</span>
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value))
                      setPage(1)
                    }}
                    className="h-11 rounded-md border border-black/10 bg-white px-3 text-sm text-obsidian/80 outline-none transition-colors duration-500 ease-luxury focus:border-gold/55"
                  >
                    <option value={8} className="bg-white">
                      8
                    </option>
                    <option value={12} className="bg-white">
                      12
                    </option>
                    <option value={16} className="bg-white">
                      16
                    </option>
                    <option value={24} className="bg-white">
                      24
                    </option>
                  </select>
                </label>

                {activeCategory !== 'All' ? (
                  <Button size="sm" variant="light" onClick={() => setCategory('All')}>
                    Clear
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {loading ? (
                <div className="text-sm text-obsidian/60">Loading...</div>
              ) : (
                paged.map((p, idx) => (
                  <Reveal key={p.id || p.name} delay={idx * 40}>
                    <ProductCard product={p} tone="light" />
                  </Reveal>
                ))
              )}
            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row">
              <p className="text-sm text-obsidian/60">
                Page {page} of {pageCount}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="light" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  Prev
                </Button>
                {Array.from({ length: pageCount }).slice(0, 7).map((_, i) => {
                  const n = i + 1
                  const active = n === page
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={
                        'h-10 min-w-10 rounded-md border px-3 text-sm transition-all duration-500 ease-luxury ' +
                        (active
                          ? 'border-black/20 bg-neutral-100 text-obsidian'
                          : 'border-black/10 bg-white text-obsidian/70 hover:border-black/20 hover:text-obsidian')
                      }
                      aria-label={`Page ${n}`}
                    >
                      {n}
                    </button>
                  )
                })}
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page >= pageCount}
                >
                  Next
                </Button>
              </div>
            </div>
        </div>
      </Container>
    </section>
  )
}
