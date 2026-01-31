import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Contacts() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [emailOpen, setEmailOpen] = useState(false)
  const [emailContact, setEmailContact] = useState(null)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailSending, setEmailSending] = useState(false)
  const [emailResult, setEmailResult] = useState(null)

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

  const openEmail = (c) => {
    setEmailContact(c)
    setEmailOpen(true)
    setEmailResult(null)
    setEmailSubject(`Re: ${c?.name || 'Your message'}`)
    setEmailMessage('')
  }

  const sendEmail = async () => {
    if (!emailContact?._id) return
    setEmailSending(true)
    setError('')
    setEmailResult(null)
    try {
      const res = await apiFetch(
        `/api/admin/contacts/${emailContact._id}/email`,
        { method: 'POST', body: JSON.stringify({ subject: emailSubject, message: emailMessage }) },
        token,
      )
      setEmailResult(res)
    } catch (err) {
      setError(err?.message || 'Failed to send email')
    } finally {
      setEmailSending(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Contact Submissions</h1>
      <p className="mt-1 text-sm text-slate-600">Users who submitted the contact form.</p>

      {emailOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Send Email</h2>
                  <p className="mt-1 text-sm text-slate-600">To: {emailContact?.email || '-'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailOpen(false)}
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
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <textarea
                  className="mt-1 min-h-[140px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Write your message..."
                />
              </div>

              {emailResult?.ok ? (
                <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">Email sent.</div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
              <div className="text-xs text-slate-500">Tip: be concise and include next steps.</div>
              <button
                type="button"
                disabled={emailSending || !emailSubject.trim() || !emailMessage.trim()}
                onClick={sendEmail}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {emailSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEmail(c)}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50"
                        >
                          Email
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(c._id)}
                          className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
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
