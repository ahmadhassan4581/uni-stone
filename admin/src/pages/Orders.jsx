import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [statusDraft, setStatusDraft] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/admin/orders', {}, token)
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const next = items.filter((o) => {
      const matchesQuery = !q ? true : String(o?._id || '').toLowerCase().includes(q)
      const matchesStatus = !statusFilter ? true : String(o?.status || '') === statusFilter
      return matchesQuery && matchesStatus
    })

    next.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    return next
  }, [items, query, statusFilter])

  const statusBadge = (status) => {
    const s = String(status || '')
    const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset'
    if (s === 'paid') return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200`
    if (s === 'shipped') return `${base} bg-blue-50 text-blue-700 ring-blue-200`
    if (s === 'completed') return `${base} bg-slate-900 text-white ring-slate-900`
    if (s === 'cancelled') return `${base} bg-rose-50 text-rose-700 ring-rose-200`
    return `${base} bg-amber-50 text-amber-800 ring-amber-200`
  }

  const open = async (id) => {
    try {
      const data = await apiFetch(`/api/admin/orders/${id}`, {}, token)
      setSelected(data)
      setStatusDraft(data?.status || '')
    } catch (err) {
      alert(err?.message || 'Failed to load order')
    }
  }

  const saveStatus = async () => {
    if (!selected?._id) return
    setSavingStatus(true)
    try {
      const updated = await apiFetch(
        `/api/admin/orders/${selected._id}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({ status: statusDraft }),
        },
        token,
      )
      setSelected(updated)
      await load()
    } catch (err) {
      alert(err?.message || 'Failed to update status')
    } finally {
      setSavingStatus(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-slate-600">All customer orders (admin view).</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Order ID"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 focus:border-slate-400 sm:w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-400"
          >
            <option value="">All Status</option>
            <option value="created">created</option>
            <option value="paid">paid</option>
            <option value="shipped">shipped</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>

          <button
            type="button"
            onClick={load}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">Orders</p>
          <p className="text-sm text-slate-600">{loading ? 'Loading…' : `${rows.length} result(s)`}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-slate-600" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((o) => (
                  <tr key={o._id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-slate-700">{o._id}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{o.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">${Number(o.total || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={statusBadge(o.status)}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => open(o._id)}
                        className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-10" colSpan={6}>
                    <div className="mx-auto max-w-md text-center">
                      <p className="text-sm font-semibold text-slate-900">No orders found</p>
                      <p className="mt-1 text-sm text-slate-600">Try clearing filters or searching with a different Order ID.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelected(null)
          }}
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">Order Details</p>
                <p className="mt-1 truncate font-mono text-xs text-slate-500">{selected._id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-12">
              <div className="sm:col-span-7">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Summary</p>
                  <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">${Number(selected.total || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Created</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {selected?.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Payment</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{selected.paymentStatus}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Current Status</p>
                      <div className="mt-1">
                        <span className={statusBadge(selected.status)}>{selected.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selected.deliveryDetails ? (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery</p>
                    <div className="mt-3 grid gap-2 text-sm text-slate-700">
                      {selected.deliveryDetails.fullName ? <p className="font-semibold">{selected.deliveryDetails.fullName}</p> : null}
                      {selected.deliveryDetails.company ? <p>{selected.deliveryDetails.company}</p> : null}
                      {selected.deliveryDetails.address1 ? <p>{selected.deliveryDetails.address1}</p> : null}
                      <p>
                        {[selected.deliveryDetails.town, selected.deliveryDetails.county, selected.deliveryDetails.postcode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                      {selected.deliveryDetails.telephone ? <p>Tel: {selected.deliveryDetails.telephone}</p> : null}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="sm:col-span-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Update Status</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <select
                      value={statusDraft}
                      onChange={(e) => setStatusDraft(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
                    >
                      <option value="created">created</option>
                      <option value="paid">paid</option>
                      <option value="shipped">shipped</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                    <button
                      type="button"
                      disabled={savingStatus || !statusDraft || statusDraft === selected.status}
                      onClick={saveStatus}
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingStatus ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Items</p>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="py-2">Item</th>
                          <th className="py-2">Qty</th>
                          <th className="py-2">Line</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {(selected.items || []).map((i) => (
                          <tr key={`${i.productId}-${i.sku}`}>
                            <td className="py-2 pr-3">
                              <p className="font-semibold text-slate-900">{i.name}</p>
                              <p className="mt-0.5 font-mono text-xs text-slate-500">{i.productId}</p>
                            </td>
                            <td className="py-2 text-slate-700">{i.qty}</td>
                            <td className="py-2 font-semibold text-slate-900">${Number(i.lineTotal || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
