import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'
import { useAuth } from '../context/AuthContext'

function uniq(arr) {
  return Array.from(new Set((Array.isArray(arr) ? arr : []).filter(Boolean)))
}

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

  const [mainImageFile, setMainImageFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  const [productId, setProductId] = useState('')
  const [slug, setSlug] = useState('')
  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Structural')
  const [price, setPrice] = useState('')
  const [vatRate, setVatRate] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [bullets, setBullets] = useState('')
  const [specifications, setSpecifications] = useState([])
  const [image, setImage] = useState('')
  const [images, setImages] = useState('')

  const resetForm = () => {
    setEditing(null)
    setMainImageFile(null)
    setGalleryFiles([])
    setUploading(false)
    setProductId('')
    setSlug('')
    setSku('')
    setName('')
    setCategory('Structural')
    setPrice('')
    setVatRate('')
    setStock('')
    setDescription('')
    setBullets('')
    setSpecifications([])
    setImage('')
    setImages('')
  }

  const uploadMainImageIfNeeded = async () => {
    if (!mainImageFile) return null
    const fd = new FormData()
    fd.append('image', mainImageFile)
    const res = await apiFetch('/api/admin/upload', { method: 'POST', body: fd }, token)
    return res?.url || null
  }

  const uploadGalleryIfNeeded = async () => {
    const files = Array.isArray(galleryFiles) ? galleryFiles : []
    if (!files.length) return []
    const fd = new FormData()
    for (const f of files.slice(0, 5)) fd.append('images', f)
    const res = await apiFetch('/api/admin/uploads', { method: 'POST', body: fd }, token)
    const uploaded = Array.isArray(res?.images) ? res.images : []
    return uploaded.map((x) => x?.url).filter(Boolean)
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
    setCategory(p.category || 'All Products')
    setPrice(String(p.price ?? ''))
    setVatRate(String(p.vatRate ?? ''))
    setStock(String(p.stock ?? ''))
    setDescription(p.description || '')
    setBullets((p.bullets || []).join(', '))
    setSpecifications(Array.isArray(p.specifications) ? p.specifications : [])
    setImage(p.image || '')
    setImages((Array.isArray(p.images) && p.images.length ? p.images : [p.image]).filter(Boolean).join(', '))
  }

  const addSpecRow = () => {
    setSpecifications((rows) => [...(Array.isArray(rows) ? rows : []), { label: '', value: '' }])
  }

  const updateSpecRow = (idx, key, val) => {
    setSpecifications((rows) => {
      const next = Array.isArray(rows) ? [...rows] : []
      const curr = next[idx] || { label: '', value: '' }
      next[idx] = { ...curr, [key]: val }
      return next
    })
  }

  const removeSpecRow = (idx) => {
    setSpecifications((rows) => (Array.isArray(rows) ? rows.filter((_, i) => i !== idx) : []))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    setUploading(true)
    try {
      const [uploadedMain, uploadedGallery] = await Promise.all([uploadMainImageIfNeeded(), uploadGalleryIfNeeded()])

      if (uploadedMain) setImage(uploadedMain)

      const currentManualImages = images
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean)

      const mergedGallery = uniq([...uploadedGallery, ...currentManualImages])
      if (mergedGallery.length) setImages(mergedGallery.join(', '))

      const parsedImages = mergedGallery.slice(0, 5)
      const normalizedImages = parsedImages.length ? parsedImages : (uploadedMain ? [uploadedMain] : image ? [image] : [])
      const mainImage = uploadedMain || image || normalizedImages[0] || ''

    const normalizedSpecs = (Array.isArray(specifications) ? specifications : [])
      .map((row) => ({
        label: String(row?.label || '').trim(),
        value: String(row?.value || '').trim(),
      }))
      .filter((row) => row.label || row.value)

    const vatRateRaw = String(vatRate).trim()
    const vatRateValue = vatRateRaw === '' ? null : Number(vatRateRaw.replace('%', '').trim())
    const stockValue = String(stock).trim() === '' ? null : Number(stock)

    const payload = {
      productId,
      slug,
      sku,
      name,
      category,
      price: Number(price),
      vatRate: Number.isFinite(vatRateValue) ? vatRateValue : null,
      stock: Number.isFinite(stockValue) ? stockValue : null,
      description,
      bullets: bullets
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean),
      specifications: normalizedSpecs,
      images: normalizedImages,
      image: mainImage,
    }

      if (editing?._id) {
        await apiFetch(`/api/products/${editing._id}`, { method: 'PUT', body: JSON.stringify(payload) }, token)
      } else {
        await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(payload) }, token)
      }
      resetForm()
      await load()
    } catch (err) {
      setError(err?.message || 'Save failed')
    } finally {
      setUploading(false)
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

  const categories = useMemo(() => ['All Products', 'Structural', 'Finishes', 'Facade', 'Interiors'], [])

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
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Reviews</th>
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
                    items.map((p) => (
                      <tr key={p._id} className="border-t border-slate-200">
                        <td className="px-4 py-3">
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.productId}</p>
                        </td>
                        <td className="px-4 py-3">{p.category}</td>
                        <td className="px-4 py-3">${p.price}</td>
                        <td className="px-4 py-3">{p.stock === 0 ? '0' : p.stock || '-'}</td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-slate-700">{p.numReviews || 0} reviews</p>
                          <p className="text-xs text-slate-500">Avg: {p.rating ?? '-'}</p>
                        </td>
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
                      <td className="px-4 py-4" colSpan={6}>
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
              <label className="block">
                <span className="text-sm font-medium">Main Image (upload)</span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Gallery Images (upload up to 5)</span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setGalleryFiles(Array.from(e.target.files || []).slice(0, 5))}
                />
              </label>
            </div>

            {editing ? (
              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold">Reviews</p>
                <p className="mt-1 text-xs text-slate-600">
                  {editing.numReviews || 0} reviews | Avg: {editing.rating ?? '-'}
                </p>

                {Array.isArray(editing.reviews) && editing.reviews.length ? (
                  <div className="mt-3 space-y-3">
                    {editing.reviews
                      .slice()
                      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
                      .map((r) => (
                        <div key={r._id} className="rounded-md border border-slate-200 bg-white p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium">{r.name || 'User'}</p>
                            <p className="text-xs text-slate-600">{r.rating} / 5</p>
                          </div>
                          {r.comment ? <p className="mt-2 text-sm text-slate-700">{r.comment}</p> : null}
                          {r.createdAt ? (
                            <p className="mt-2 text-[11px] text-slate-500">{new Date(r.createdAt).toLocaleString()}</p>
                          ) : null}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-600">No reviews yet.</p>
                )}
              </div>
            ) : null}

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
            <Field label="VAT (e.g. 20 or 20%)" value={vatRate} onChange={setVatRate} type="text" />
            <Field label="Stock" value={stock} onChange={setStock} type="number" />

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

            <div className="rounded-md border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Specifications</p>
                <button
                  type="button"
                  onClick={addSpecRow}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50"
                >
                  Add row
                </button>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                    <tr>
                      <th className="px-2 py-2">Label</th>
                      <th className="px-2 py-2">Value</th>
                      <th className="px-2 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(specifications) && specifications.length ? specifications : [{ label: '', value: '' }]).map(
                      (row, idx) => (
                        <tr key={idx} className="border-t border-slate-200">
                          <td className="px-2 py-2">
                            <input
                              className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none focus:border-slate-900"
                              value={row?.label || ''}
                              onChange={(e) => updateSpecRow(idx, 'label', e.target.value)}
                              placeholder="e.g. Thickness"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none focus:border-slate-900"
                              value={row?.value || ''}
                              onChange={(e) => updateSpecRow(idx, 'value', e.target.value)}
                              placeholder="e.g. 20mm"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => removeSpecRow(idx)}
                              className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Field
              label="Images (up to 5, comma separated)"
              value={images}
              onChange={setImages}
              required={!galleryFiles.length && !image.trim() && !mainImageFile}
            />
            <Field
              label="Main Image URL"
              value={image}
              onChange={setImage}
              required={!mainImageFile && !images.trim() && !galleryFiles.length}
            />

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {uploading ? 'Uploading...' : editing ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
