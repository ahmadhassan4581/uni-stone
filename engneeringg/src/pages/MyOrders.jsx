import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'

function money(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
}

export default function MyOrders() {
  const { token, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])

  useEffect(() => {
    let alive = true
    const run = async () => {
      if (!isAuthenticated || !token) return
      setLoading(true)
      setError('')
      try {
        const data = await apiFetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
        if (!alive) return
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!alive) return
        setError(err?.message || 'Failed to load orders')
      } finally {
        if (!alive) return
        setLoading(false)
      }
    }

    run()
    return () => {
      alive = false
    }
  }, [isAuthenticated, token])

  const sorted = useMemo(() => {
    const next = [...orders]
    next.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    return next
  }, [orders])

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <Breadcrumbs tone="light" items={[{ label: 'Home', to: '/' }, { label: 'My Orders' }]} />
        </Reveal>

        <Reveal className="mt-8">
          <SectionHeading
            eyebrow="Account"
            title="My Orders"
            subtitle="Your recent orders placed on this account."
            tone="light"
          />
        </Reveal>

        <div className="mt-12">
          {!isAuthenticated ? (
            <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <p className="text-sm text-obsidian/70">Please login to view your orders.</p>
              <div className="mt-6">
                <Button as={Link} to="/auth" variant="blue" size="lg">
                  Login
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

              <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Orders</p>
                    <p className="mt-2 text-sm text-obsidian/70">
                      {loading ? 'Loading...' : sorted.length ? `${sorted.length} found` : 'No orders yet'}
                    </p>
                  </div>
                  <Button as={Link} to="/profile" variant="light" size="sm">
                    Profile
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="text-sm text-obsidian/60">Loading...</div>
              ) : sorted.length ? (
                <div className="grid gap-5">
                  {sorted.map((o, idx) => (
                    <Reveal key={o._id || idx} delay={idx * 50}>
                      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                        <div className="grid gap-3 p-6 sm:grid-cols-12 sm:items-center">
                          <div className="sm:col-span-5">
                            <p className="text-xs tracking-[0.35em] uppercase text-obsidian/60">Order</p>
                            <p className="mt-2 font-mono text-xs text-obsidian/70">{o._id}</p>
                            <p className="mt-2 text-sm text-obsidian/70">
                              {o?.createdAt ? new Date(o.createdAt).toLocaleString() : ''}
                            </p>
                          </div>

                          <div className="sm:col-span-3">
                            <p className="text-xs tracking-[0.35em] uppercase text-obsidian/60">Status</p>
                            <p className="mt-2 text-sm text-obsidian/70">{o?.status || '—'}</p>
                          </div>

                          <div className="sm:col-span-2">
                            <p className="text-xs tracking-[0.35em] uppercase text-obsidian/60">Total</p>
                            <p className="mt-2 font-display text-2xl text-gold">{money(Number(o?.total || 0))}</p>
                          </div>

                          <div className="sm:col-span-2 sm:text-right" />
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-black/10 bg-neutral-50 p-8">
                  <p className="text-sm text-obsidian/70">No orders to show yet.</p>
                  <div className="mt-6">
                    <Button as={Link} to="/products" variant="blue" size="lg">
                      Explore Products
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
