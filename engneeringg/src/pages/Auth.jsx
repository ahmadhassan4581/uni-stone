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
            eyebrow=""
            title=""
            subtitle=""
            tone="light"
          />
        </Reveal>

        {isLogin ? (
          <div className="mx-auto mt-12 grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_360px]">
            <Reveal>
              <div className="rounded-md bg-white p-8 shadow-sm">
                <form
                  className=""
                  onSubmit={(e) => {
                    e.preventDefault()
                    const form = new FormData(e.currentTarget)

                    const email = String(form.get('email') || '')
                    const password = String(form.get('password') || '')

                    const run = async () => {
                      await login({ email, password })
                      navigate('/')
                    }

                    run().catch(() => {})
                  }}
                >
                  <div className="grid gap-5">
                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">Email Address</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="email"
                        name="email"
                        placeholder="jhonedoe@123"
                        autoComplete="email"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">Password</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                      />
                    </label>
                  </div>

                  <div className="mt-6">
                    <Button
                      type="submit"
                      size="lg"
                      variant="blue"
                      className="w-full tracking-normal normal-case hover:translate-y-0 hover:scale-100"
                    >
                      {loading ? 'Please wait...' : 'Log In'}
                    </Button>
                  </div>

                  <div className="mt-4 text-center">
                    <Link className="text-xs text-blue-600 hover:text-blue-700 hover:underline" to="/contact">
                      Forgot password?
                    </Link>
                  </div>

                  {error ? <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
                </form>
              </div>
            </Reveal>

            <Reveal delay={130}>
              <div className="rounded-md bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold text-[#111111]">{isLogin ? 'Need an account?' : 'Already have an account?'}</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setMode(isLogin ? 'signup' : 'login')}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {isLogin ? 'Create Account' : 'Log In'}
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        ) : (
          <div className="mx-auto mt-12 w-full max-w-md">
            <Reveal>
              <div className="rounded-md bg-white p-8 shadow-sm">
                <form
                  className=""
                  onSubmit={(e) => {
                    e.preventDefault()
                    const form = new FormData(e.currentTarget)

                    const name = String(form.get('name') || '')
                    const email = String(form.get('email') || '')
                    const password = String(form.get('password') || '')
                    const confirmPassword = String(form.get('confirmPassword') || '')

                    const run = async () => {
                      await register({ name, email, password, confirmPassword })
                      navigate('/')
                    }

                    run().catch(() => {})
                  }}
                >
                  <div className="grid gap-5">
                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">Full Name</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="text"
                        name="name"
                        placeholder="Your name"
                        autoComplete="name"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">Email Address</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">Password</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">Confirm Password</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        required
                      />
                    </label>
                  </div>

                  <div className="mt-6">
                    <Button
                      type="submit"
                      size="lg"
                      variant="blue"
                      className="w-full tracking-normal normal-case hover:translate-y-0 hover:scale-100"
                    >
                      {loading ? 'Please wait...' : 'Create Account'}
                    </Button>
                  </div>

                  <div className="mt-6 rounded-md bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold text-[#111111]">Already have an account?</p>
                    <p className="mt-1 text-sm text-obsidian/60">Manage your orders and details.</p>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Log In
                      </button>
                    </div>
                  </div>

                  {error ? <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
                </form>
              </div>
            </Reveal>
          </div>
        )}
      </Container>
    </section>
  )
}
