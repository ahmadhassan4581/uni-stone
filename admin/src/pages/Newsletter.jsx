import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Newsletter() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [sendOpen, setSendOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/admin/newsletter', {}, token)
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load newsletter emails')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const remove = async (id) => {
    if (!confirm('Delete this email?')) return
    await apiFetch(`/api/admin/newsletter/${id}`, { method: 'DELETE' }, token)
    await load()
  }

  const sendToAll = async () => {
    setSending(true)
    setError('')
    setSendResult(null)
    try {
      const data = await apiFetch(
        '/api/admin/newsletter/send',
        {
          method: 'POST',
          body: JSON.stringify({ subject, message }),
        },
        token,
      )
      setSendResult(data)
    } catch (err) {
      setError(err?.message || 'Failed to send newsletter')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Newsletter</h1>
          <p className="mt-1 text-sm text-slate-600">Emails submitted from the site newsletter form.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSendOpen(true)
            setSendResult(null)
          }}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Send Newsletter
        </button>
      </div>

      {error ? <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      {sendOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Send Newsletter to All Subscribers</h2>
                  <p className="mt-1 text-sm text-slate-600">This will email all saved newsletter emails.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSendOpen(false)}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Subject</label>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Newsletter subject"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <textarea
                  className="mt-1 min-h-[140px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your newsletter message..."
                />
              </div>

              {sendResult ? (
                <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
                  Sent to {sendResult.total} emails. Batches: {sendResult.sentBatches} sent, {sendResult.failedBatches} failed.
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
              <div className="text-xs text-slate-500">Tip: keep messages short to avoid spam filters.</div>
              <button
                type="button"
                disabled={sending || !subject.trim() || !message.trim()}
                onClick={sendToAll}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {sending ? 'Sending...' : 'Send Now'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={4}>
                    Loading...
                  </td>
                </tr>
              ) : items.length ? (
                items.map((n) => (
                  <tr key={n._id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium">{n.email}</td>
                    <td className="px-4 py-3 text-slate-600">{n.source || '-'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => remove(n._id)}
                        className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4" colSpan={4}>
                    No emails.
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
