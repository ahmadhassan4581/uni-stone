import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </label>
  )
}

export default function Products() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editing, setEditing] = useState(null)

  const [productId, setProductId] = useState('')
  const [slug, setSlug] = useState('')
  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Structural')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [bullets, setBullets] = useState('')
  const [image, setImage] = useState('')

  const resetForm = () => {
    setEditing(null)
    setProductId('')
    setSlug('')
    setSku('')
    setName('')
    setCategory('Structural')
    setPrice('')
    setDescription('')
    setBullets('')
    setImage('')
  }

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/admin/products', {}, token)
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const startEdit = (p) => {
    setEditing(p)
    setProductId(p.productId || '')
    setSlug(p.slug || '')
    setSku(p.sku || '')
    setName(p.name || '')
    setCategory(p.category || 'Structural')
    setPrice(String(p.price ?? ''))
    setDescription(p.description || '')
    setBullets((p.bullets || []).join(', '))
    setImage(p.image || '')
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    const payload = {
      productId,
      slug,
      sku,
      name,
      category,
      price: Number(price),
      description,
      bullets: bullets
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean),
      image,
    }

    try {
      if (editing?._id) {
        await apiFetch(`/api/products/${editing._id}`, { method: 'PUT', body: JSON.stringify(payload) }, token)
      } else {
        await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(payload) }, token)
      }
      resetForm()
      await load()
    } catch (err) {
      setError(err?.message || 'Save failed')
    }
  }

  const onDelete = async (p) => {
    if (!confirm(`Delete product: ${p.name}?`)) return
    try {
      await apiFetch(`/api/products/${p._id}`, { method: 'DELETE' }, token)
      await load()
    } catch (err) {
      alert(err?.message || 'Delete failed')
    }
  }

  const categories = useMemo(() => ['Structural', 'Finishes', 'Facade', 'Interiors'], [])

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-slate-600">Add / update / delete products shown in the frontend catalog.</p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          New Product
        </button>
      </div>

      {error ? <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
              <p className="text-sm font-semibold">All Products</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
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
                    items.map((p) => (
                      <tr key={p._id} className="border-t border-slate-200">
                        <td className="px-4 py-3">
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.productId}</p>
                        </td>
                        <td className="px-4 py-3">{p.category}</td>
                        <td className="px-4 py-3">${p.price}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(p)}
                              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(p)}
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
                      <td className="px-4 py-4" colSpan={4}>
                        No products.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold">{editing ? 'Edit Product' : 'Create Product'}</p>
            <div className="mt-4 grid gap-3">
              <Field label="Product ID" value={productId} onChange={setProductId} required />
              <Field label="Slug" value={slug} onChange={setSlug} required />
              <Field label="SKU" value={sku} onChange={setSku} required />
              <Field label="Name" value={name} onChange={setName} required />

              <label className="block">
                <span className="text-sm font-medium">Category</span>
                <select
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <Field label="Price" value={price} onChange={setPrice} type="number" required />

              <label className="block">
                <span className="text-sm font-medium">Description</span>
                <textarea
                  className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Bullets (comma separated)</span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                  value={bullets}
                  onChange={(e) => setBullets(e.target.value)}
                />
              </label>

              <Field label="Image URL" value={image} onChange={setImage} required />

              <div className="mt-2 flex gap-2">
                <button type="submit" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  Save
                </button>
                {editing ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
