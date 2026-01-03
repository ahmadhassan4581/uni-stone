import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Contacts() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/admin/contacts', {}, token)
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id, status) => {
    await apiFetch(`/api/admin/contacts/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }, token)
    await load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this contact submission?')) return
    await apiFetch(`/api/admin/contacts/${id}`, { method: 'DELETE' }, token)
    await load()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Contact Submissions</h1>
      <p className="mt-1 text-sm text-slate-600">Users who submitted the contact form.</p>

      {error ? <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
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
              ) : items.length ? (
                items.map((c) => (
                  <tr key={c._id} className="border-t border-slate-200 align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.name}</p>
                      <p className="mt-2 text-xs text-slate-500">{c.message}</p>
                    </td>
                    <td className="px-4 py-3">{c.email}</td>
                    <td className="px-4 py-3">{c.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                        value={c.status}
                        onChange={(e) => updateStatus(c._id, e.target.value)}
                      >
                        <option value="new">new</option>
                        <option value="in_progress">in_progress</option>
                        <option value="closed">closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(c.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => remove(c._id)}
                        className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4" colSpan={6}>
                    No submissions.
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
