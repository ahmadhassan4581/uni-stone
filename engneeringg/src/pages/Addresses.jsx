import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'

const emptyAddress = {
  label: 'Home',
  fullName: '',
  company: '',
  address1: '',
  town: '',
  county: '',
  postcode: '',
  telephone: '',
}

export default function Addresses() {
  const { token, isAuthenticated } = useAuth()

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)

  const [address, setAddress] = useState(emptyAddress)

  const isValid = useMemo(() => {
    if (!address.fullName.trim()) return false
    if (!address.address1.trim()) return false
    if (!address.town.trim()) return false
    if (!address.county.trim()) return false
    if (!address.postcode.trim()) return false
    if (!address.telephone.trim()) return false
    return true
  }, [address])

  useEffect(() => {
    let alive = true
    const run = async () => {
      if (!isAuthenticated || !token) return
      setLoading(true)
      setError('')
      try {
        const data = await apiFetch('/api/auth/addresses', { headers: { Authorization: `Bearer ${token}` } })
        if (!alive) return
        const arr = Array.isArray(data?.addresses) ? data.addresses : []
        setAddress(arr[0] && typeof arr[0] === 'object' ? { ...emptyAddress, ...arr[0] } : emptyAddress)
      } catch (err) {
        if (!alive) return
        setError(err?.message || 'Failed to load addresses')
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

  const save = async () => {
    setSaving(true)
    setError('')
    setOk(false)
    try {
      await apiFetch(
        '/api/auth/addresses',
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ addresses: [{ ...address }] }),
        },
      )
      setOk(true)
    } catch (err) {
      setError(err?.message || 'Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <Breadcrumbs
            tone="light"
            items={[{ label: 'Home', to: '/' }, { label: 'Your Account', to: '/account/profile' }, { label: 'Addresses' }]}
          />
        </Reveal>

        <Reveal className="mt-8">
          <SectionHeading
            eyebrow="Account"
            title="Saved Addresses"
            subtitle="Save your delivery details for faster checkout."
            tone="light"
          />
        </Reveal>

        <div className="mt-12">
          {!isAuthenticated ? (
            <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <p className="text-sm text-obsidian/70">Please login to manage your addresses.</p>
              <div className="mt-6">
                <Button as={Link} to="/account" variant="blue" size="lg">
                  Login
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              {error ? <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
              {ok ? (
                <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  Address saved.
                </div>
              ) : null}

              {loading ? <p className="text-sm text-obsidian/60">Loading...</p> : null}

              <div className="grid gap-5">
                <label className="grid gap-2">
                  <span className="text-xs font-medium text-[#111111]">Label</span>
                  <input
                    className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                    value={address.label}
                    onChange={(e) => setAddress((a) => ({ ...a, label: e.target.value }))}
                    placeholder="Home"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-medium text-[#111111]">Full Name</span>
                  <input
                    className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                    value={address.fullName}
                    onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))}
                    placeholder="John Smith"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-medium text-[#111111]">Company (optional)</span>
                  <input
                    className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                    value={address.company}
                    onChange={(e) => setAddress((a) => ({ ...a, company: e.target.value }))}
                    placeholder=""
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-medium text-[#111111]">Address Line 1</span>
                  <input
                    className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                    value={address.address1}
                    onChange={(e) => setAddress((a) => ({ ...a, address1: e.target.value }))}
                    placeholder=""
                    required
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-medium text-[#111111]">Town/City</span>
                    <input
                      className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                      value={address.town}
                      onChange={(e) => setAddress((a) => ({ ...a, town: e.target.value }))}
                      placeholder=""
                      required
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-medium text-[#111111]">County</span>
                    <input
                      className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                      value={address.county}
                      onChange={(e) => setAddress((a) => ({ ...a, county: e.target.value }))}
                      placeholder=""
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-medium text-[#111111]">Postcode</span>
                    <input
                      className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                      value={address.postcode}
                      onChange={(e) => setAddress((a) => ({ ...a, postcode: e.target.value }))}
                      placeholder=""
                      required
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-medium text-[#111111]">Telephone</span>
                    <input
                      className="h-11 rounded-md border border-black/20 bg-white px-4 text-sm text-[#111111] outline-none focus:border-black/40"
                      value={address.telephone}
                      onChange={(e) => setAddress((a) => ({ ...a, telephone: e.target.value }))}
                      placeholder=""
                      required
                    />
                  </label>
                </div>

                <div className="mt-2 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="blue"
                    size="lg"
                    disabled={!isValid || saving}
                    onClick={save}
                  >
                    {saving ? 'Saving...' : 'Save Address'}
                  </Button>
                  <Button as={Link} to="/checkout/delivery" variant="light" size="lg">
                    Go to Checkout
                  </Button>
                </div>

                {!isValid ? <p className="text-xs text-obsidian/60">Please complete required fields to save.</p> : null}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
