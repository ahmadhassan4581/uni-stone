import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Consultations() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [emailOpen, setEmailOpen] = useState(false)
  const [activeEmailRow, setActiveEmailRow] = useState(null)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailSending, setEmailSending] = useState(false)
  const [emailStatus, setEmailStatus] = useState({ type: '', message: '' })

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

  const openEmail = (row) => {
    setActiveEmailRow(row)
    setEmailSubject('')
    setEmailMessage('')
    setEmailStatus({ type: '', message: '' })
    setEmailOpen(true)
  }

  const closeEmail = () => {
    if (emailSending) return
    setEmailOpen(false)
    setActiveEmailRow(null)
    setEmailSubject('')
    setEmailMessage('')
    setEmailStatus({ type: '', message: '' })
  }

  const sendEmail = async () => {
    const id = activeEmailRow?._id
    if (!id) return

    const subject = String(emailSubject || '').trim()
    const message = String(emailMessage || '').trim()
    if (!subject || !message) {
      setEmailStatus({ type: 'error', message: 'Subject and message are required.' })
      return
    }

    setEmailSending(true)
    setEmailStatus({ type: '', message: '' })
    try {
      await apiFetch(`/api/admin/consultations/${id}/email`, { method: 'POST', body: JSON.stringify({ subject, message }) }, token)
      setEmailStatus({ type: 'success', message: 'Email sent successfully.' })
    } catch (err) {
      setEmailStatus({ type: 'error', message: err?.message || 'Failed to send email' })
    } finally {
      setEmailSending(false)
    }
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
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={9}>
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
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        onClick={() => openEmail(c)}
                        disabled={!c.customerEmail}
                        title={!c.customerEmail ? 'Missing customer email' : 'Send email'}
                      >
                        Send Email
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4" colSpan={9}>
                    No consultations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {emailOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <button type="button" className="absolute inset-0" aria-label="Close" onClick={closeEmail} />
          <div className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Send Email</p>
                <p className="mt-1 text-sm text-slate-700">
                  To: <span className="font-semibold">{activeEmailRow?.customerEmail || '-'}</span>
                </p>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={closeEmail}
                disabled={emailSending}
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-600">Subject</span>
                <input
                  className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Subject"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-600">Message</span>
                <textarea
                  className="mt-1 min-h-32 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Write your message..."
                />
              </label>

              {emailStatus.message ? (
                <div
                  className={
                    emailStatus.type === 'error'
                      ? 'rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'
                      : 'rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700'
                  }
                >
                  {emailStatus.message}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={closeEmail}
                  disabled={emailSending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  onClick={sendEmail}
                  disabled={emailSending}
                >
                  {emailSending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
