import { Link, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import Auth from './Auth'
import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <Auth />
  }

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Reveal>
            <Breadcrumbs tone="light" items={[{ label: 'Home', to: '/' }, { label: 'Your Account' }]} />
          </Reveal>

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
        </div>

        <div className="mt-12 max-w-3xl">
          <Reveal>
            <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <p className="text-xs tracking-[0.35em] uppercase text-obsidian/60">Account</p>
              <h1 className="mt-3 text-2xl font-semibold text-obsidian">Your Account</h1>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-black/10 bg-neutral-50 p-4">
                  <p className="text-xs font-medium text-obsidian/60">Name</p>
                  <p className="mt-1 text-sm font-semibold text-obsidian">{user?.name || '—'}</p>
                </div>
                <div className="rounded-lg border border-black/10 bg-neutral-50 p-4">
                  <p className="text-xs font-medium text-obsidian/60">Email</p>
                  <p className="mt-1 text-sm font-semibold text-obsidian">{user?.email || '—'}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button as={Link} to="/account/profile" variant="blue" size="lg">
                  Manage Account
                </Button>
                <Button as={Link} to="/orders" variant="light" size="lg">
                  View Orders
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
