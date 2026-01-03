import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()
  const { login, register, loading, error, isAuthenticated } = useAuth()

  const isLogin = mode === 'login'

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Account"
            title={isLogin ? 'Login' : 'Sign up'}
            subtitle={
              isLogin
                ? 'Access your account to manage orders and consultations. (UI only)'
                : 'Create an account for faster checkout and project updates. (UI only)'
            }
            tone="light"
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={
                    'inline-flex h-10 items-center justify-center rounded-md border px-5 text-xs tracking-[0.25em] uppercase transition-all duration-500 ease-luxury ' +
                    (isLogin
                      ? 'border-gold/60 bg-gold text-obsidian'
                      : 'border-black/10 bg-white text-obsidian/70 hover:border-black/20 hover:text-obsidian')
                  }
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={
                    'inline-flex h-10 items-center justify-center rounded-md border px-5 text-xs tracking-[0.25em] uppercase transition-all duration-500 ease-luxury ' +
                    (!isLogin
                      ? 'border-gold/60 bg-gold text-obsidian'
                      : 'border-black/10 bg-white text-obsidian/70 hover:border-black/20 hover:text-obsidian')
                  }
                >
                  Sign up
                </button>
              </div>

              <form
                className="mt-8"
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = new FormData(e.currentTarget)

                  const name = String(form.get('name') || '')
                  const email = String(form.get('email') || '')
                  const password = String(form.get('password') || '')
                  const confirmPassword = String(form.get('confirmPassword') || '')

                  const run = async () => {
                    if (isLogin) {
                      await login({ email, password })
                    } else {
                      await register({ name, email, password, confirmPassword })
                    }
                    navigate('/')
                  }

                  run().catch(() => {})
                }}
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  {!isLogin ? (
                    <label className="grid gap-2 sm:col-span-2">
                      <span className="text-[0.7rem] tracking-[0.32em] uppercase text-obsidian/60">Full name</span>
                      <input
                        className="h-12 rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian/80 outline-none transition-colors duration-500 ease-luxury focus:border-gold/60"
                        type="text"
                        name="name"
                        placeholder="Your name"
                        autoComplete="name"
                        required
                      />
                    </label>
                  ) : null}

                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-[0.7rem] tracking-[0.32em] uppercase text-obsidian/60">Email</span>
                    <input
                      className="h-12 rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian/80 outline-none transition-colors duration-500 ease-luxury focus:border-gold/60"
                      type="email"
                      name="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-[0.7rem] tracking-[0.32em] uppercase text-obsidian/60">Password</span>
                    <input
                      className="h-12 rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian/80 outline-none transition-colors duration-500 ease-luxury focus:border-gold/60"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      required
                    />
                  </label>

                  {!isLogin ? (
                    <label className="grid gap-2 sm:col-span-2">
                      <span className="text-[0.7rem] tracking-[0.32em] uppercase text-obsidian/60">Confirm password</span>
                      <input
                        className="h-12 rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian/80 outline-none transition-colors duration-500 ease-luxury focus:border-gold/60"
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                      />
                    </label>
                  ) : null}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-obsidian/55">Sign in or create an account.</p>
                  <Button type="submit" size="lg" variant="blue">
                    {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create account'}
                  </Button>
                </div>

                {error ? <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

                {isLogin ? (
                  <div className="mt-6">
                    <Link className="text-xs text-obsidian/65 hover:text-obsidian hover:underline" to="/contact">
                      Forgot password? Contact support
                    </Link>
                  </div>
                ) : null}
              </form>
            </div>
          </Reveal>

          <Reveal delay={130} className="lg:col-span-5">
            <div className="rounded-xl border border-black/10 bg-neutral-50 p-8">
              <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Why an account?</p>
              <ul className="mt-6 grid gap-3 text-sm leading-7 text-obsidian/70">
                <li>Faster checkout for products & build packages</li>
                <li>Order updates and saved project details</li>
                <li>Quick re-booking for consultations</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
