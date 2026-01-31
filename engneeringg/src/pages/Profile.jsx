import { ClipboardList, Heart, MapPin, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, token, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1200)
    return () => clearTimeout(t)
  }, [copied])

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
      to: '/account/wishlist',
    },
    {
      key: 'addresses',
      title: 'Saved Addresses',
      subtitle: 'Edit your saved addresses.',
      icon: MapPin,
      iconClass: 'text-indigo-600',
      to: '/account/addresses',
    },
    {
      key: 'account',
      title: 'Your Account',
      subtitle: 'Change your login details.',
      icon: User,
      iconClass: 'text-slate-700',
      to: '/account',
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
                    <Link
                      to={card.to}
                      className="flex flex-col items-center justify-center rounded-md border border-black/20 bg-white px-10 py-12 text-center transition-colors hover:bg-neutral-50"
                    >
                      <Icon className={`h-7 w-7 ${card.iconClass}`} />
                      <p className="mt-4 text-sm font-semibold text-obsidian">{card.title}</p>
                      <p className="mt-1 text-xs text-obsidian/60">{card.subtitle}</p>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </>
        )}
      </Container>
    </section>
  )
}
