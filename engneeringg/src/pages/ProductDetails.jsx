import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Heart,
  XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
import QuantityControl from '../components/QuantityControl'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import { apiFetch } from '../lib/api'

function money(n) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'GBP',
  }).format(n)
}

function vatInclusivePrice(price, vatRate = 20) {
  return Number(price) * (1 + vatRate / 100)
}

export default function ProductDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products, loading, refresh } = useProducts()
  const { addItem, openMiniCart } = useCart()
  const { isAuthenticated, user, token, addToWishlist, removeFromWishlist } = useAuth()

  const product = useMemo(
    () => products.find(p => p.slug === slug),
    [products, slug]
  )

  const [selectedImage, setSelectedImage] = useState('')
  const [activeTab, setActiveTab] = useState('info')
  const [qty, setQty] = useState(1)

  const [details, setDetails] = useState(null)
  const [reviewRating, setReviewRating] = useState('5')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    let alive = true
    const run = async () => {
      try {
        const data = await apiFetch(`/api/products/${encodeURIComponent(slug)}`)
        if (!alive) return
        setDetails(data)
      } catch {
        if (!alive) return
        setDetails(null)
      }
    }

    run()
    return () => {
      alive = false
    }
  }, [slug])

  const data = details || product

  const images = useMemo(() => {
    if (Array.isArray(data?.images) && data.images.length)
      return data.images
    if (data?.image) return [data.image]
    return []
  }, [data])

  useEffect(() => {
    setSelectedImage(images[0] || '')
  }, [images])

  if (loading || !data) return null

  const inStock = !data.stock || Number(data.stock) > 0
  const stockValue = Number(data?.stock)
  const hasStockValue = Number.isFinite(stockValue) && stockValue >= 0
  const maxPerItem = 20
  const maxAllowed = Math.min(maxPerItem, hasStockValue ? stockValue : maxPerItem)
  const saleEnabled = Boolean(data?.saleEnabled)
  const salePriceValue = Number(data?.salePrice)
  const hasSalePrice = Number.isFinite(salePriceValue) && salePriceValue > 0
  const isOnSale = saleEnabled && hasSalePrice
  const basePrice = isOnSale ? salePriceValue : data.price
  const incVat = vatInclusivePrice(basePrice, data.vatRate)
  const categoryLabel = String(data.category || 'Products').trim() || 'Products'
  const wishlistIds = Array.isArray(user?.wishlist) ? user.wishlist : []
  const isWishlisted = wishlistIds.includes(data.id)
  const specs = Array.isArray(data?.specifications)
    ? data.specifications
        .map((row) => ({
          label: String(row?.label || '').trim(),
          value: String(row?.value || '').trim(),
        }))
        .filter((row) => row.label || row.value)
    : []
  const bullets = Array.isArray(data?.bullets) ? data.bullets.map((b) => String(b || '').trim()).filter(Boolean) : []
  const numReviews = Number(data?.numReviews || 0)
  const avgRating = data?.rating ?? null
  const reviews = Array.isArray(data?.reviews) ? data.reviews : []
  const hasReviewed = isAuthenticated
    ? reviews.some((r) => String(r?.user || '') === String(user?._id || ''))
    : false

  return (
    <section className="bg-white">
      <Container className="py-8">

        {/* TOP HEADER */}
        <div className="flex items-center justify-between border-b pb-4 text-sm">
          <h2 className="font-medium text-gray-800">{categoryLabel}</h2>
          <p className="text-gray-600">
            Home / {categoryLabel} /{' '}
            <span className="text-gray-600">{data.name}</span>
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">

          {/* LEFT – IMAGES */}
          <div className="lg:col-span-4">
            <div className="border border-gray-200">
              <img
                src={selectedImage}
                alt={data.name}
                className="w-full object-cover"
              />
            </div>

            <div className="mt-4 flex gap-3">
              {images.slice(0, 3).map(img => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(img)}
                  className={`h-16 w-16 border ${
                    selectedImage === img
                      ? 'border-blue-600'
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* MIDDLE – DETAILS */}
          <div className="lg:col-span-5 space-y-4">
            <h1 className="text-2xl font-semibold leading-snug">
              {data.name}
            </h1>

            <p className="text-lg font-semibold">
              {isOnSale ? (
                <span className="mr-2 text-sm font-semibold text-gray-400 line-through">{money(data.price)}</span>
              ) : null}
              <span className={isOnSale ? 'text-red-600' : ''}>{money(basePrice)}</span>{' '}
              <span className="text-sm font-normal text-gray-500">(ex. VAT)</span>
              <span className="ml-2 text-sm font-semibold text-gray-800">{money(incVat)}</span>
              <span className="text-sm font-normal text-gray-500"> Inc VAT</span>
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{avgRating ?? '—'}</span> / 5
              <span className="mx-2 text-gray-300">|</span>
              {numReviews} reviews
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <div className="inline-flex items-center gap-2">
                {inStock ? <span className="text-green-600">✔</span> : <XCircle className="h-4 w-4 text-red-600" />}
                <span className="text-gray-600">Stock Status:</span>
                <span className={inStock ? 'text-green-600' : 'text-red-600'}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="inline-flex items-center gap-2">
                <span className="text-gray-600">Stock:</span>
                <span className="font-medium text-gray-800">{hasStockValue ? stockValue : 'Available'}</span>
              </div>
            </div>
          </div>

          {/* RIGHT – CART BOX */}
          <div className="lg:col-span-3">
            <div className="bg-gray-100 p-6">
              <Button
                variant="blue"
                size="lg"
                className="w-full"
                disabled={!inStock}
                onClick={() => {
                  addItem(data.id, qty)
                  openMiniCart()
                }}
              >
                Add to Cart
              </Button>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">Quantity</p>
                <QuantityControl
                  value={qty}
                  onChange={(v) => setQty(Math.min(Math.max(1, Number(v) || 1), Math.max(1, maxAllowed)))}
                  min={1}
                  max={Math.max(1, maxAllowed)}
                  tone="light"
                  size="sm"
                />
              </div>

              {hasStockValue && stockValue > 20 ? (
                <p className="mt-3 text-xs text-gray-600">For orders above 20 quantity, please contact us.</p>
              ) : null}

              {!inStock ? <p className="mt-3 text-xs text-red-600">Out of stock. Please contact us.</p> : null}

              <p className="mt-3 text-xs text-gray-600">
                *If you require more than the available stock, please contact us{' '}
                <Link className="text-blue-600 hover:text-blue-700 hover:underline" to="/contact">
                  (contact)
                </Link>{' '}
                directly.
              </p>

              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2 text-sm text-gray-800"
                onClick={async () => {
                  if (!isAuthenticated) {
                    navigate('/auth')
                    return
                  }
                  if (isWishlisted) {
                    await removeFromWishlist(data.id)
                    return
                  }
                  await addToWishlist(data.id)
                }}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black">
                  <Heart className="h-4 w-4 text-white" />
                </span>
                {isWishlisted ? 'Wishlisted' : 'Add to your Wish List'}
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-12 border-b text-sm">
          <div className="flex gap-10">
            {['info', 'specs', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600 relative after:absolute after:-bottom-2 after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:rotate-45 after:bg-blue-600'
                    : 'text-gray-400'
                }`}
              >
                {tab === 'info'
                  ? 'Information'
                  : tab === 'specs'
                  ? 'Specifications'
                  : 'Reviews'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-700 leading-7">
          {activeTab === 'info' && <p>{data.description}</p>}
          {activeTab === 'specs' && (
            specs.length ? (
              <div className="overflow-x-auto border border-gray-200 bg-white">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-gray-200">
                    {specs.map((row, idx) => (
                      <tr key={`${row.label}-${idx}`} className="align-top">
                        <th className="w-1/3 whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                          {row.label || '-'}
                        </th>
                        <td className="px-4 py-3 text-gray-700">{row.value || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : bullets.length ? (
              <div className="overflow-x-auto border border-gray-200 bg-white">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-gray-200">
                    {bullets.map((b, idx) => (
                      <tr key={`${b}-${idx}`} className="align-top">
                        <th className="w-1/3 whitespace-nowrap px-4 py-3 font-semibold text-gray-900">Specification</th>
                        <td className="px-4 py-3 text-gray-700">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No specifications available.</p>
            )
          )}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-gray-900">Customer Reviews</p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">{avgRating ?? '—'}</span> / 5 ({numReviews})
                </p>
              </div>

              <div className="mt-6">
                {reviews.length ? (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r._id || `${r.user}-${r.createdAt}`} className="rounded-md border border-gray-200 bg-white p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium text-gray-900">{r.name || 'User'}</p>
                          <p className="text-sm text-gray-600">{r.rating} / 5</p>
                        </div>
                        {r.comment ? <p className="mt-2 text-gray-700">{r.comment}</p> : null}
                        {r.createdAt ? (
                          <p className="mt-2 text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet.</p>
                )}
              </div>

              <div className="mt-10 rounded-md border border-gray-200 bg-gray-50 p-5">
                {!isAuthenticated ? (
                  <div>
                    <p className="font-medium text-gray-900">Write a review</p>
                    <p className="mt-2 text-gray-600">Please login to submit a review.</p>
                    <div className="mt-4">
                      <Button variant="blue" size="md" onClick={() => navigate('/auth')}>
                        Login
                      </Button>
                    </div>
                  </div>
                ) : hasReviewed ? (
                  <div>
                    <p className="font-medium text-gray-900">Write a review</p>
                    <p className="mt-2 text-gray-600">You have already reviewed this product.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setReviewError('')
                      setReviewSubmitting(true)
                      try {
                        const payload = {
                          rating: Number(reviewRating),
                          comment: reviewComment,
                        }
                        const updated = await apiFetch(`/api/products/${encodeURIComponent(slug)}/reviews`, {
                          method: 'POST',
                          headers: { Authorization: `Bearer ${token}` },
                          body: JSON.stringify(payload),
                        })
                        setDetails(updated)
                        setReviewComment('')
                        setReviewRating('5')
                        await refresh()
                      } catch (err) {
                        setReviewError(err?.message || 'Failed to submit review')
                      } finally {
                        setReviewSubmitting(false)
                      }
                    }}
                    className="space-y-3"
                  >
                    <p className="font-medium text-gray-900">Write a review</p>

                    {reviewError ? <p className="text-sm text-red-700">{reviewError}</p> : null}

                    <label className="block">
                      <span className="text-sm font-medium text-gray-900">Rating</span>
                      <select
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(e.target.value)}
                      >
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-gray-900">Comment</span>
                      <textarea
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900"
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                    </label>

                    <Button type="submit" variant="blue" size="md" disabled={reviewSubmitting}>
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
