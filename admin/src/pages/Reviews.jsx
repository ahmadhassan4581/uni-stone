import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Reviews() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [editRating, setEditRating] = useState('5')
  const [editComment, setEditComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/admin/reviews', {}, token)
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openEdit = (r) => {
    setSelected(r)
    setEditRating(String(r?.rating ?? 5))
    setEditComment(String(r?.comment || ''))
  }

  const closeEdit = () => {
    setSelected(null)
    setSaving(false)
    setDeleting(false)
  }

  const save = async () => {
    if (!selected?._id || !selected?.productSlug) return
    setSaving(true)
    try {
      await apiFetch(
        `/api/admin/reviews/${encodeURIComponent(selected.productSlug)}/${encodeURIComponent(selected._id)}`,
        {
          method: 'PUT',
          body: JSON.stringify({ rating: Number(editRating), comment: editComment }),
        },
        token,
      )
      await load()
      closeEdit()
    } catch (err) {
      alert(err?.message || 'Failed to update review')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!selected?._id || !selected?.productSlug) return
    if (!confirm('Delete this review?')) return
    setDeleting(true)
    try {
      await apiFetch(
        `/api/admin/reviews/${encodeURIComponent(selected.productSlug)}/${encodeURIComponent(selected._id)}`,
        { method: 'DELETE' },
        token,
      )
      await load()
      closeEdit()
    } catch (err) {
      alert(err?.message || 'Failed to delete review')
    } finally {
      setDeleting(false)
    }
  }

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rf = ratingFilter ? Number(ratingFilter) : null

    const next = items.filter((r) => {
      const matchesRating = rf ? Number(r?.rating || 0) === rf : true
      const matchesQuery =
        !q
          ? true
          : String(r?.productName || '').toLowerCase().includes(q) ||
            String(r?.productId || '').toLowerCase().includes(q) ||
            String(r?.productSlug || '').toLowerCase().includes(q) ||
            String(r?.name || '').toLowerCase().includes(q) ||
            String(r?.comment || '').toLowerCase().includes(q)

      return matchesRating && matchesQuery
    })

    next.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    return next
  }, [items, query, ratingFilter])

  const ratingBadge = (rating) => {
    const n = Number(rating || 0)
    const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset'
    if (n >= 5) return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200`
    if (n === 4) return `${base} bg-lime-50 text-lime-700 ring-lime-200`
    if (n === 3) return `${base} bg-amber-50 text-amber-800 ring-amber-200`
    if (n === 2) return `${base} bg-orange-50 text-orange-700 ring-orange-200`
    return `${base} bg-rose-50 text-rose-700 ring-rose-200`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
          <p className="mt-1 text-sm text-slate-600">All product reviews (admin view).</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search (product, user, comment…)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 focus:border-slate-400 sm:w-72"
          />

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-400"
          >
            <option value="">All Ratings</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
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
          <p className="text-sm font-semibold text-slate-900">Reviews</p>
          <p className="text-sm text-slate-600">{loading ? 'Loading…' : `${rows.length} result(s)`}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Comment</th>
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
                rows.map((r, idx) => (
                  <tr key={r._id || `${r.productSlug}-${r.createdAt}-${idx}`} className="align-top transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{r.productName || '—'}</p>
                      <p className="mt-1 font-mono text-xs text-slate-500">
                        {r.productId || ''}{r.productSlug ? ` • ${r.productSlug}` : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{r.name || 'User'}</p>
                      {r.user ? <p className="mt-1 font-mono text-xs text-slate-500">{String(r.user)}</p> : null}
                    </td>
                    <td className="px-4 py-3">
                      <span className={ratingBadge(r.rating)}>{r.rating} / 5</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {r.comment ? <p className="max-w-xl whitespace-pre-wrap">{r.comment}</p> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-10" colSpan={6}>
                    <div className="mx-auto max-w-md text-center">
                      <p className="text-sm font-semibold text-slate-900">No reviews found</p>
                      <p className="mt-1 text-sm text-slate-600">Try clearing filters or searching with a different keyword.</p>
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
            if (e.target === e.currentTarget) closeEdit()
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">Edit Review</p>
                <p className="mt-1 truncate text-sm text-slate-600">{selected.productName}</p>
                <p className="mt-1 truncate font-mono text-xs text-slate-500">
                  {selected.productId || ''}{selected.productSlug ? ` • ${selected.productSlug}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-900">Rating</span>
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
                  >
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </select>
                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reviewer</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selected.name || 'User'}</p>
                  {selected.user ? <p className="mt-1 font-mono text-xs text-slate-500">{String(selected.user)}</p> : null}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Comment</span>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={5}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-400"
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={remove}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={save}
                    className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
