import { useEffect, useMemo, useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import Container from '../components/Container'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { apiFetch } from '../lib/api'

export default function Sale() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await apiFetch('/api/products?onSale=true')
        if (cancelled) return
        setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        if (cancelled) return
        setError(err?.message || 'Failed to load sale products')
        setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const gridItems = useMemo(() => items.filter((p) => Boolean(p?.saleEnabled)), [items])

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-16">
        <Breadcrumbs
          tone="light"
          items={[
            { to: '/', label: 'Home' },
            { label: 'Sale' },
          ]}
        />

        <div className="mt-8 border-b border-black/10 pb-4">
          <h1 className="font-display text-3xl tracking-[0.02em] text-obsidian sm:text-4xl">Sale</h1>
          <div className="mt-3 h-1 w-24 bg-gold" />
          <p className="mt-4 max-w-2xl text-sm leading-7 text-obsidian/70">
            Explore products currently on sale.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-sm text-obsidian/70">Loading...</p>
        ) : error ? (
          <p className="mt-10 text-sm text-red-600">{error}</p>
        ) : gridItems.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gridItems.map((p, idx) => (
              <Reveal key={p.id || p.slug || p.name} delay={idx * 70}>
                <ProductCard product={p} tone="light" />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-obsidian/70">No sale products available right now.</p>
        )}
      </Container>
    </section>
  )
}
