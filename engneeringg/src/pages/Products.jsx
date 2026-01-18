import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Container from '../components/Container'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { useProducts } from '../context/ProductsContext'

export default function Products() {
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

  const categories = useMemo(() => {
    const set = new Set()
    products.forEach((p) => {
      const c = p?.category
      if (typeof c === 'string' && c.trim()) set.add(c.trim())
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [products])

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

  const showing = useMemo(() => {
    if (!sorted.length) return { start: 0, end: 0, total: 0 }
    const safePage = Math.min(Math.max(1, page), pageCount)
    const start = (safePage - 1) * perPage + 1
    const end = Math.min(safePage * perPage, sorted.length)
    return { start, end, total: sorted.length }
  }, [page, pageCount, perPage, sorted.length])

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
        <div className="flex items-start justify-between gap-6 border-b border-black/10 pb-6">
          <Reveal>
            <h1 className="font-display text-3xl tracking-[0.03em] text-obsidian sm:text-4xl">All Products</h1>
          </Reveal>
          <Reveal>
            <div className="pt-3">
              <Breadcrumbs
                tone="light"
                items={[
                  { label: 'Home', to: '/' },
                  { label: 'All Products', to: '/products' },
                  ...(activeCategory && activeCategory !== 'All' ? [{ label: activeCategory }] : []),
                ]}
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-12">
          {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

          <div className="mb-6 flex flex-col justify-between gap-3 border-b border-black/10 pb-4 sm:flex-row sm:items-center">
            <p className="text-xs text-obsidian/70">
              Showing products {showing.start} to {showing.end} of {showing.total}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-obsidian/70">
                <span>Categories:</span>
                <select
                  value={activeCategory}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-9 rounded border border-black/20 bg-white px-2 text-xs text-obsidian/80 outline-none"
                >
                  <option value="All" className="bg-white">
                    All Products
                  </option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-white">
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-xs text-obsidian/70">
                <span>Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value)
                    setPage(1)
                  }}
                  className="h-9 rounded border border-black/20 bg-white px-2 text-xs text-obsidian/80 outline-none"
                >
                  <option value="featured" className="bg-white">
                    Most popular
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
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-xs font-semibold tracking-[0.18em] uppercase text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
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
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-xs font-semibold tracking-[0.18em] uppercase text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page >= pageCount}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
