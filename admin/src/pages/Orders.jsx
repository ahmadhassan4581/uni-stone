import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

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

  const rows = useMemo(() => items, [items])

  const open = async (id) => {
    try {
      const data = await apiFetch(`/api/admin/orders/${id}`, {}, token)
      setSelected(data)
    } catch (err) {
      alert(err?.message || 'Failed to load order')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>
      <p className="mt-1 text-sm text-slate-600">All customer orders (admin view).</p>

      {error ? <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((o) => (
                  <tr key={o._id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-mono text-xs">{o._id}</td>
                    <td className="px-4 py-3">{o.items?.length || 0}</td>
                    <td className="px-4 py-3">${o.total}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs">{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => open(o._id)}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4" colSpan={6}>
                    No orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Order Details</p>
                <p className="mt-1 font-mono text-xs text-slate-500">{selected._id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <p>
                <span className="font-medium">Total:</span> ${selected.total}
              </p>
              <p>
                <span className="font-medium">Status:</span> {selected.status}
              </p>
              <p>
                <span className="font-medium">Payment:</span> {selected.paymentStatus}
              </p>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2">Qty</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Line</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.items || []).map((i) => (
                    <tr key={`${i.productId}-${i.sku}`} className="border-t border-slate-200">
                      <td className="px-3 py-2">
                        <p className="font-medium">{i.name}</p>
                        <p className="text-xs text-slate-500">{i.productId}</p>
                      </td>
                      <td className="px-3 py-2">{i.qty}</td>
                      <td className="px-3 py-2">${i.price}</td>
                      <td className="px-3 py-2">${i.lineTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
