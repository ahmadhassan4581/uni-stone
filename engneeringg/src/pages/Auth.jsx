import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, forgotPassword, resetPassword, loading, error, isAuthenticated } = useAuth()

  const [nameValue, setNameValue] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOk, setForgotOk] = useState(false)
  const [resetOk, setResetOk] = useState(false)

  const params = new URLSearchParams(location.search)
  const resetToken = String(params.get('resetToken') || '')

  const isLogin = mode === 'login'
  const isSignup = mode === 'signup'
  const isForgot = mode === 'forgot'
  const isReset = mode === 'reset'

  useEffect(() => {
    if (resetToken) {
      setMode('reset')
    }
  }, [resetToken])

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
              <div className="rounded-md border border-black/10 bg-white p-8">
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
                  <div>
                    <h2 className="text-base font-semibold text-[#111111]">Login</h2>
                    <p className="mt-1 text-sm text-obsidian/60">View your recent orders and update your details.</p>
                  </div>

                  <div className="mt-6 grid gap-5">
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
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot')
                        setForgotOk(false)
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error ? <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
                </form>
              </div>
            </Reveal>

            <Reveal delay={130}>
              <div className="flex h-full flex-col items-center justify-center rounded-md border border-black/10 bg-white p-8 text-center">
                <p className="text-sm font-semibold text-[#111111]">Need an account?</p>
                <p className="mt-2 text-sm text-obsidian/60">Manage your orders and details.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        ) : isForgot ? (
          <div className="mx-auto mt-12 w-full max-w-md">
            <Reveal>
              <div className="rounded-md border border-black/10 bg-white p-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const run = async () => {
                      await forgotPassword({ email: forgotEmail })
                      setForgotOk(true)
                    }
                    run().catch(() => {})
                  }}
                >
                  <div>
                    <h2 className="text-base font-semibold text-[#111111]">Forgot Password</h2>
                    <p className="mt-1 text-sm text-obsidian/60">Enter your email and we will send a reset link.</p>
                  </div>

                  <div className="mt-6 grid gap-5">
                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">Email Address</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="email"
                        name="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="john@example.com"
                        autoComplete="email"
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
                      {loading ? 'Please wait...' : 'Send Reset Link'}
                    </Button>
                  </div>

                  {forgotOk ? (
                    <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                      If this email exists, a reset link has been sent.
                    </div>
                  ) : null}

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Back to login
                    </button>
                  </div>

                  {error ? <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
                </form>
              </div>
            </Reveal>
          </div>
        ) : isReset ? (
          <div className="mx-auto mt-12 w-full max-w-md">
            <Reveal>
              <div className="rounded-md border border-black/10 bg-white p-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const form = new FormData(e.currentTarget)
                    const password = String(form.get('password') || '')
                    const confirmPassword = String(form.get('confirmPassword') || '')

                    const run = async () => {
                      await resetPassword({ token: resetToken, password, confirmPassword })
                      setResetOk(true)
                      setMode('login')
                      navigate('/account', { replace: true })
                    }

                    run().catch(() => {})
                  }}
                >
                  <div>
                    <h2 className="text-base font-semibold text-[#111111]">Reset Password</h2>
                    <p className="mt-1 text-sm text-obsidian/60">Set a new password for your account.</p>
                  </div>

                  <div className="mt-6 grid gap-5">
                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">New Password</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="password"
                        name="password"
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
                      {loading ? 'Please wait...' : 'Reset Password'}
                    </Button>
                  </div>

                  {resetOk ? (
                    <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                      Password reset successful. You can now log in.
                    </div>
                  ) : null}

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Back to login
                    </button>
                  </div>

                  {error ? <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
                </form>
              </div>
            </Reveal>
          </div>
        ) : (
          <div className="mx-auto mt-12 w-full max-w-md">
            <Reveal>
              <div className="rounded-md border border-black/10 bg-white p-8">
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
                  <div>
                    <h2 className="text-base font-semibold text-[#111111]">Create Account</h2>
                    <p className="mt-1 text-sm text-obsidian/60">Manage your orders and saved addresses.</p>
                  </div>

                  <div className="mt-6 grid gap-5">
                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">* Full Name</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="text"
                        name="name"
                        placeholder="Example: John Smith"
                        autoComplete="name"
                        maxLength={50}
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        required
                      />
                      <div className="text-right text-xs text-obsidian/60">{nameValue.length}/50</div>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">* Email Address</span>
                      <span className="text-xs text-obsidian/60">You will use this email address to log in to your account</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="email"
                        name="email"
                        placeholder="Example: john@example.com"
                        autoComplete="email"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">* Password</span>
                      <span className="text-xs text-obsidian/60">Must be at least 8 characters long.</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="password"
                        name="password"
                        placeholder=""
                        autoComplete="new-password"
                        required
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-medium text-[#111111]">* Confirm Password</span>
                      <input
                        className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                        type="password"
                        name="confirmPassword"
                        placeholder=""
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

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Already have an account? Log In
                    </button>
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
