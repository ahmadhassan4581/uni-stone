import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'

function Card({ title, description, to }) {
  return (
    <Link to={to} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <p className="mt-4 text-xs font-semibold text-slate-900">Open</p>
    </Link>
  )
}

function StatCard({ title, value, sub }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      {sub ? <p className="mt-2 text-sm text-slate-600">{sub}</p> : null}
    </div>
  )
}

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function isoDayKey(d) {
  const x = startOfDay(d)
  return x.toISOString().slice(0, 10)
}

function formatShortDay(key) {
  const d = new Date(`${key}T00:00:00Z`)
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: '2-digit' }).format(d)
}

function computeCounts(list, now) {
  const items = Array.isArray(list) ? list : []
  const total = items.length

  const last7Cutoff = new Date(now)
  last7Cutoff.setDate(last7Cutoff.getDate() - 7)

  const last30Cutoff = new Date(now)
  last30Cutoff.setDate(last30Cutoff.getDate() - 30)

  const inLast7 = items.filter((p) => p?.createdAt && new Date(p.createdAt) >= last7Cutoff).length
  const inLast30 = items.filter((p) => p?.createdAt && new Date(p.createdAt) >= last30Cutoff).length

  return { total, inLast7, inLast30 }
}

function buildDailySeries(list, rangeDays, now) {
  const items = Array.isArray(list) ? list : []
  const days = Number(rangeDays)
  const end = startOfDay(now)
  const start = new Date(end)
  start.setDate(start.getDate() - (days - 1))

  const buckets = new Map()
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    buckets.set(isoDayKey(d), 0)
  }

  items.forEach((p) => {
    if (!p?.createdAt) return
    const created = startOfDay(new Date(p.createdAt))
    if (created < start || created > end) return
    const key = isoDayKey(created)
    if (!buckets.has(key)) return
    buckets.set(key, (buckets.get(key) || 0) + 1)
  })

  const series = Array.from(buckets.entries()).map(([key, count]) => ({ key, label: formatShortDay(key), count }))
  const max = Math.max(1, ...series.map((s) => s.count))
  return { series, max }
}

function ChartCard({ title, chart, loading }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-slate-600">Max/day: {loading ? '—' : chart.max}</p>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-slate-600">Loading...</p>
      ) : (
        <div className="mt-6">
          <div className="flex items-end gap-2">
            {chart.series.map((p) => (
              <div key={p.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-28 w-full items-end">
                  <div
                    className="w-full rounded-md bg-slate-900/80"
                    style={{ height: `${Math.round((p.count / chart.max) * 100)}%` }}
                    title={`${p.label}: ${p.count}`}
                  />
                </div>
                <div className="text-[11px] text-slate-600">{p.label}</div>
                <div className="text-[11px] font-semibold text-slate-900">{p.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [contacts, setContacts] = useState([])
  const [orders, setOrders] = useState([])
  const [consultations, setConsultations] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [range, setRange] = useState(7)

  useEffect(() => {
    let alive = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [productsData, contactsData, ordersData, consultationsData, usersData] = await Promise.all([
          apiFetch('/api/admin/products', {}, token),
          apiFetch('/api/admin/contacts', {}, token),
          apiFetch('/api/admin/orders', {}, token),
          apiFetch('/api/admin/consultations', {}, token),
          apiFetch('/api/admin/users', {}, token),
        ])
        if (!alive) return
        setProducts(Array.isArray(productsData) ? productsData : [])
        setContacts(Array.isArray(contactsData) ? contactsData : [])
        setOrders(Array.isArray(ordersData) ? ordersData : [])
        setConsultations(Array.isArray(consultationsData) ? consultationsData : [])
        setUsers(Array.isArray(usersData) ? usersData : [])
      } catch (err) {
        if (!alive) return
        setError(err?.message || 'Failed to load dashboard data')
      } finally {
        if (!alive) return
        setLoading(false)
      }
    }

    if (token) load()
    return () => {
      alive = false
    }
  }, [token])

  const now = useMemo(() => new Date(), [])

  const stats = useMemo(
    () => ({
      products: computeCounts(products, now),
      contacts: computeCounts(contacts, now),
      orders: computeCounts(orders, now),
      consultations: computeCounts(consultations, now),
      users: computeCounts(users, now),
    }),
    [products, contacts, orders, consultations, users, now],
  )

  const charts = useMemo(
    () => ({
      products: buildDailySeries(products, range, now),
      contacts: buildDailySeries(contacts, range, now),
      orders: buildDailySeries(orders, range, now),
      consultations: buildDailySeries(consultations, range, now),
      users: buildDailySeries(users, range, now),
    }),
    [products, contacts, orders, consultations, users, range, now],
  )

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Manage your storefront data and submissions.</p>

      <div className="mt-6">
        {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={loading ? '—' : stats.products.total} />
        <StatCard title="Products Added (Last 7 Days)" value={loading ? '—' : stats.products.inLast7} />
        <StatCard title="Products Added (Last 30 Days)" value={loading ? '—' : stats.products.inLast30} />

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filter</p>
          <div className="mt-4 inline-flex rounded-md border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setRange(7)}
              className={
                'rounded-md px-3 py-2 text-sm font-semibold ' +
                (range === 7 ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50')
              }
            >
              Last 7 days
            </button>
            <button
              type="button"
              onClick={() => setRange(30)}
              className={
                'rounded-md px-3 py-2 text-sm font-semibold ' +
                (range === 30 ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50')
              }
            >
              Last 30 days
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-600">Graph shows products created per day.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title={`Products Added (${range} days)`} chart={charts.products} loading={loading} />
        <ChartCard title={`Contacts Added (${range} days)`} chart={charts.contacts} loading={loading} />
        <ChartCard title={`Orders Created (${range} days)`} chart={charts.orders} loading={loading} />
        <ChartCard title={`Consultations Added (${range} days)`} chart={charts.consultations} loading={loading} />
        <ChartCard title={`Users Registered (${range} days)`} chart={charts.users} loading={loading} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card title="Products" description="Add, edit, and remove products." to="/products" />
        <Card title="Contacts" description="View contact form submissions." to="/contacts" />
        <Card title="Orders" description="View customer orders." to="/orders" />
        <Card title="Consultations" description="View consultation requests." to="/consultations" />
        <Card title="Users" description="View registered users." to="/users" />
      </div>
    </div>
  )
}
