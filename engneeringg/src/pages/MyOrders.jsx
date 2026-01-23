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
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(n)
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
          <Breadcrumbs tone="light" items={[{ label: 'Home', to: '/' }, { label: 'Your Account', to: '/account/profile' }, { label: 'Orders' }]} />
        </Reveal>

        <Reveal className="mt-8">
          <SectionHeading
            eyebrow="Account"
            title="Orders"
            subtitle="Your recent orders placed on this account."
            tone="light"
          />
        </Reveal>

        <div className="mt-12">
          {!isAuthenticated ? (
            <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <p className="text-sm text-obsidian/70">Please login to view your orders.</p>
              <div className="mt-6">
                <Button as={Link} to="/account" variant="blue" size="lg">
                  Login
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

              {loading ? (
                <div className="text-sm text-obsidian/60">Loading...</div>
              ) : sorted.length ? (
                <>
                  {/* Table Header */}
                  <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-obsidian/60 uppercase tracking-[0.35em]">
                      <div className="col-span-5">Order</div>
                      <div className="col-span-3">Date</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Total</div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="space-y-2">
                    {sorted.map((o, idx) => (
                      <Reveal key={o._id || idx} delay={idx * 50}>
                        <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-5">
                              <p className="font-mono text-sm text-obsidian font-medium">{o._id}</p>
                            </div>
                            <div className="col-span-3">
                              <p className="text-sm text-obsidian/70">
                                {o?.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                {o?.status || 'Processing'}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <p className="font-display text-lg text-gold font-semibold">{money(Number(o?.total || 0))}</p>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </>
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
