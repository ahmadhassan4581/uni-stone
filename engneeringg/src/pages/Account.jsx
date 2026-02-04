import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import Auth from './Auth'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'

export default function Account() {
  const { user, isAuthenticated, logout, token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const resetToken = String(params.get('resetToken') || '')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' })
  const [sendingReset, setSendingReset] = useState(false)
  const [resetSent, setResetSent] = useState(false)

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

              <div className="mt-10 border-t border-black/10 pt-8">
                <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-obsidian">Change Password</h2>

                {!resetToken ? (
                  <div className="mt-5">
                    <Button
                      type="button"
                      variant="light"
                      size="sm"
                      disabled={sendingReset}
                      onClick={async () => {
                        setPasswordStatus({ type: '', message: '' })
                        setResetSent(false)

                        const email = String(user?.email || '').trim()
                        if (!email) {
                          setPasswordStatus({ type: 'error', message: 'No email found for this account.' })
                          return
                        }

                        setSendingReset(true)
                        try {
                          await apiFetch('/api/auth/forgot-password', {
                            method: 'POST',
                            body: JSON.stringify({ email }),
                          })
                          setResetSent(true)
                        } catch (err) {
                          setPasswordStatus({ type: 'error', message: err?.message || 'Failed to send verification link.' })
                        } finally {
                          setSendingReset(false)
                        }
                      }}
                    >
                      {sendingReset ? 'Sending...' : 'Change Password'}
                    </Button>

                    {resetSent ? (
                      <p className="mt-3 text-sm text-obsidian/70">
                        If this email exists, a verification link has been sent to your inbox.
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <form
                    className="mt-5 grid gap-4 sm:grid-cols-2"
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setPasswordStatus({ type: '', message: '' })

                      if (!password || !confirmPassword) {
                        setPasswordStatus({ type: 'error', message: 'Please fill in all password fields.' })
                        return
                      }

                      if (password.length < 6) {
                        setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters.' })
                        return
                      }

                      if (password !== confirmPassword) {
                        setPasswordStatus({ type: 'error', message: 'Passwords do not match.' })
                        return
                      }

                      setChangingPassword(true)
                      try {
                        await apiFetch('/api/auth/reset-password', {
                          method: 'POST',
                          body: JSON.stringify({ token: resetToken, password, confirmPassword }),
                        })
                        setPassword('')
                        setConfirmPassword('')
                        setPasswordStatus({ type: 'success', message: 'Password updated successfully.' })
                        navigate('/account', { replace: true })
                      } catch (err) {
                        setPasswordStatus({ type: 'error', message: err?.message || 'Failed to update password.' })
                      } finally {
                        setChangingPassword(false)
                      }
                    }}
                  >
                    <label className="block">
                      <span className="text-xs font-medium text-obsidian/60">New Password</span>
                      <input
                        className="mt-1 h-11 w-full rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian outline-none transition-all focus:border-black/30"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-medium text-obsidian/60">Confirm New Password</span>
                      <input
                        className="mt-1 h-11 w-full rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian outline-none transition-all focus:border-black/30"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </label>

                    <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                      <Button type="submit" variant="light" size="sm" disabled={changingPassword}>
                        {changingPassword ? 'Updating...' : 'Update Password'}
                      </Button>
                      <Button
                        type="button"
                        variant="light"
                        size="sm"
                        disabled={changingPassword}
                        onClick={() => navigate('/account', { replace: true })}
                      >
                        Cancel
                      </Button>

                      {passwordStatus.message ? (
                        <p className={passwordStatus.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                          {passwordStatus.message}
                        </p>
                      ) : null}
                    </div>
                  </form>
                )}

                {passwordStatus.message && !resetToken ? (
                  <p className={passwordStatus.type === 'error' ? 'mt-3 text-sm text-red-600' : 'mt-3 text-sm text-green-700'}>
                    {passwordStatus.message}
                  </p>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
