import { Link, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <Breadcrumbs tone="light" items={[{ label: 'Home', to: '/' }, { label: 'Account' }]} />
        </Reveal>

        <Reveal className="mt-8">
          <SectionHeading
            eyebrow="Account"
            title="Profile"
            subtitle="Manage your account details and access your orders."
            tone="light"
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
              <div className="border-b border-black/10 bg-neutral-50 px-8 py-6">
                <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Profile</p>
                <p className="mt-2 text-sm text-obsidian/70">Your saved account information.</p>
              </div>

              <div className="px-8 py-8">
                {!isAuthenticated ? (
                  <div className="grid gap-6">
                    <div>
                      <p className="font-display text-2xl text-obsidian">Sign in to view your profile</p>
                      <p className="mt-3 text-sm leading-7 text-obsidian/70">
                        Login to access your saved details and see the orders you placed.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button as={Link} to="/auth" variant="blue" size="lg">
                        Login
                      </Button>
                      <Button as={Link} to="/products" variant="light" size="lg">
                        Browse Products
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-8">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="rounded-xl border border-black/10 bg-white p-6">
                        <p className="text-xs tracking-[0.35em] uppercase text-obsidian/60">Username</p>
                        <p className="mt-3 font-display text-2xl text-obsidian">{user?.name || '—'}</p>
                      </div>
                      <div className="rounded-xl border border-black/10 bg-white p-6">
                        <p className="text-xs tracking-[0.35em] uppercase text-obsidian/60">Email</p>
                        <p className="mt-3 text-sm text-obsidian/70 break-all">{user?.email || '—'}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button as={Link} to="/orders" variant="blue" size="lg">
                        My Orders
                      </Button>
                      <Button
                        type="button"
                        variant="light"
                        size="lg"
                        onClick={() => {
                          logout()
                          navigate('/')
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={130} className="lg:col-span-4">
            <div className="rounded-2xl border border-black/10 bg-neutral-50 p-8">
              <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Quick Links</p>
              <div className="mt-6 grid gap-3">
                <Link
                  to="/orders"
                  className="rounded-xl border border-black/10 bg-white px-5 py-4 text-sm text-obsidian/80 transition-colors hover:bg-neutral-100"
                >
                  My Orders
                </Link>
                <Link
                  to="/products"
                  className="rounded-xl border border-black/10 bg-white px-5 py-4 text-sm text-obsidian/80 transition-colors hover:bg-neutral-100"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/contact"
                  className="rounded-xl border border-black/10 bg-white px-5 py-4 text-sm text-obsidian/80 transition-colors hover:bg-neutral-100"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
