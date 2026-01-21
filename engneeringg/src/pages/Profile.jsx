import { ClipboardList, Heart, MapPin, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import Container from '../components/Container'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import { apiFetch } from '../lib/api'

export default function Profile() {
  const { user, token, isAuthenticated, logout } = useAuth()
  const { products } = useProducts()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('orders')

  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [orders, setOrders] = useState([])

  const wishlistIds = Array.isArray(user?.wishlist) ? user.wishlist : []
  const wishlistProducts = wishlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)

  useEffect(() => {
    let alive = true
    const run = async () => {
      if (!isAuthenticated || !token) return
      setOrdersLoading(true)
      setOrdersError('')
      try {
        const data = await apiFetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!alive) return
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!alive) return
        setOrdersError(err?.message || 'Failed to load orders')
      } finally {
        if (!alive) return
        setOrdersLoading(false)
      }
    }

    run()
    return () => {
      alive = false
    }
  }, [isAuthenticated, token])

  const recentOrders = useMemo(() => {
    const next = [...orders]
    next.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    return next.slice(0, 3)
  }, [orders])

  const cards = [
    {
      key: 'orders',
      title: 'Orders',
      subtitle: 'Track your recent orders.',
      icon: ClipboardList,
      iconClass: 'text-sky-600',
      to: '/orders',
    },
    {
      key: 'wishlist',
      title: 'Your Wish List',
      subtitle: 'Manage your Wish List.',
      icon: Heart,
      iconClass: 'text-red-500',
      to: '/account/profile',
    },
    {
      key: 'addresses',
      title: 'Saved Addresses',
      subtitle: 'Edit your saved addresses.',
      icon: MapPin,
      iconClass: 'text-indigo-600',
      to: '/account/profile',
    },
    {
      key: 'account',
      title: 'Your Account',
      subtitle: 'Change your login details.',
      icon: User,
      iconClass: 'text-slate-700',
      to: '/account/profile',
    },
  ]

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Reveal>
            <Breadcrumbs tone="light" items={[{ label: 'Home', to: '/' }, { label: 'Your Account' }]} />
          </Reveal>

          {isAuthenticated ? (
            <Reveal>
              <Button
                type="button"
                variant="light"
                size="sm"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                Logout
              </Button>
            </Reveal>
          ) : null}
        </div>

        {!isAuthenticated ? (
          <div className="mt-12 max-w-2xl">
            <Reveal>
              <p className="text-sm text-obsidian/70">Sign in to view your account.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button as={Link} to="/account" variant="blue" size="lg">
                  Login
                </Button>
                <Button as={Link} to="/products" variant="light" size="lg">
                  Browse Products
                </Button>
              </div>
            </Reveal>
          </div>
        ) : (
          <>
            <Reveal>
              <div className="mt-12">
                <p className="text-sm text-obsidian/70">Welcome,</p>
                <p className="mt-2 text-2xl font-semibold text-obsidian">{user?.name || '—'}</p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {cards.map((card, idx) => {
                const Icon = card.icon
                return (
                  <Reveal key={card.key} delay={idx * 70}>
                    {card.key === 'orders' || card.key === 'wishlist' ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab(card.key)}
                        className={
                          'flex w-full flex-col items-center justify-center rounded-md border px-10 py-12 text-center transition-colors ' +
                          (activeTab === card.key ? 'border-black/40 bg-neutral-50' : 'border-black/20 bg-white hover:bg-neutral-50')
                        }
                      >
                        <Icon className={`h-7 w-7 ${card.iconClass}`} />
                        <p className="mt-4 text-sm font-semibold text-obsidian">{card.title}</p>
                        <p className="mt-1 text-xs text-obsidian/60">{card.subtitle}</p>
                      </button>
                    ) : (
                      <Link
                        to={card.to}
                        className="flex flex-col items-center justify-center rounded-md border border-black/20 bg-white px-10 py-12 text-center transition-colors hover:bg-neutral-50"
                      >
                        <Icon className={`h-7 w-7 ${card.iconClass}`} />
                        <p className="mt-4 text-sm font-semibold text-obsidian">{card.title}</p>
                        <p className="mt-1 text-xs text-obsidian/60">{card.subtitle}</p>
                      </Link>
                    )}
                  </Reveal>
                )
              })}
            </div>

            {activeTab === 'orders' ? (
              <div className="mt-14">
              <Reveal>
                <div className="border-b border-black/10 pb-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h2 className="font-display text-3xl tracking-[0.02em] text-obsidian sm:text-4xl">Recent Orders</h2>
                      <div className="mt-3 h-1 w-28 bg-gold" />
                    </div>
                    <Button as={Link} to="/orders" variant="light" size="sm">
                      View All
                    </Button>
                  </div>
                </div>
              </Reveal>

              <div className="mt-8">
                {ordersError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{ordersError}</div>
                ) : null}

                {ordersLoading ? (
                  <p className="text-sm text-obsidian/60">Loading...</p>
                ) : recentOrders.length ? (
                  <div className="grid gap-5">
                    {recentOrders.map((o, idx) => (
                      <Reveal key={o._id || idx} delay={idx * 70}>
                        <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                          <div className="grid gap-3 p-6 sm:grid-cols-12 sm:items-center">
                            <div className="sm:col-span-6">
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

                            <div className="sm:col-span-3 sm:text-right">
                              <p className="text-xs tracking-[0.35em] uppercase text-obsidian/60">Total</p>
                              <p className="mt-2 font-display text-2xl text-gold">
                                {new Intl.NumberFormat(undefined, {
                                  style: 'currency',
                                  currency: 'EUR',
                                }).format(Number(o?.total || 0))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-black/10 bg-neutral-50 p-8">
                    <p className="text-sm text-obsidian/70">No orders yet.</p>
                    <div className="mt-6">
                      <Button as={Link} to="/products" variant="blue" size="lg">
                        Explore Products
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            ) : (
              <div className="mt-14">
                <Reveal>
                  <div className="border-b border-black/10 pb-4">
                    <h2 className="font-display text-3xl tracking-[0.02em] text-obsidian sm:text-4xl">Wish List</h2>
                    <div className="mt-3 h-1 w-28 bg-gold" />
                  </div>
                </Reveal>

                {wishlistProducts.length ? (
                  <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlistProducts.map((p, idx) => (
                      <Reveal key={p.id || p.slug || p.name} delay={idx * 80}>
                        <ProductCard product={p} tone="light" />
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  <div className="mt-10 rounded-xl border border-black/10 bg-neutral-50 p-8">
                    <p className="text-sm text-obsidian/70">Your wish list is empty.</p>
                    <div className="mt-6">
                      <Button as={Link} to="/products" variant="blue" size="lg">
                        Explore Products
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  )
}
