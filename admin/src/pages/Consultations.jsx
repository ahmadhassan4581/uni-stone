import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Consultations() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/admin/consultations', {}, token)
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load consultations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const rows = useMemo(() => items, [items])

  const updateStatus = async (id, status) => {
    await apiFetch(`/api/admin/consultations/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }, token)
    await load()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Consultations</h1>
      <p className="mt-1 text-sm text-slate-600">Consultation / request-a-call submissions.</p>

      {error ? <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Track</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={8}>
                    Loading...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((c) => (
                  <tr key={c._id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.track}</p>
                      {c.notes ? <p className="mt-2 text-xs text-slate-500">{c.notes}</p> : null}
                    </td>
                    <td className="px-4 py-3">{c.scheduleDateLabel || c.scheduleDateIso || '-'}</td>
                    <td className="px-4 py-3">{c.scheduleTime || '-'}</td>
                    <td className="px-4 py-3">{c.customerName || '-'}</td>
                    <td className="px-4 py-3">{c.customerPhone || '-'}</td>
                    <td className="px-4 py-3">{c.customerEmail || '-'}</td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                        value={c.status || 'requested'}
                        onChange={(e) => updateStatus(c._id, e.target.value)}
                      >
                        <option value="requested">requested</option>
                        <option value="scheduled">scheduled</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4" colSpan={8}>
                    No consultations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
