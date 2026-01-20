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
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'

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
  const { isAuthenticated, user, addToWishlist, removeFromWishlist } = useAuth()

  const product = useMemo(
    () => products.find(p => p.slug === slug),
    [products, slug]
  )

  const [selectedImage, setSelectedImage] = useState('')
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    refresh()
  }, [refresh])

  const images = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length)
      return product.images
    if (product?.image) return [product.image]
    return []
  }, [product])

  useEffect(() => {
    setSelectedImage(images[0] || '')
  }, [images])

  if (loading || !product) return null

  const inStock = !product.stock || Number(product.stock) > 0
  const incVat = vatInclusivePrice(product.price, product.vatRate)
  const categoryLabel = String(product.category || 'Products').trim() || 'Products'
  const wishlistIds = Array.isArray(user?.wishlist) ? user.wishlist : []
  const isWishlisted = wishlistIds.includes(product.id)
  const specs = Array.isArray(product?.specifications)
    ? product.specifications
        .map((row) => ({
          label: String(row?.label || '').trim(),
          value: String(row?.value || '').trim(),
        }))
        .filter((row) => row.label || row.value)
    : []
  const bullets = Array.isArray(product?.bullets) ? product.bullets.map((b) => String(b || '').trim()).filter(Boolean) : []

  return (
    <section className="bg-white">
      <Container className="py-8">

        {/* TOP HEADER */}
        <div className="flex items-center justify-between border-b pb-4 text-sm">
          <h2 className="font-medium text-gray-800">{categoryLabel}</h2>
          <p className="text-gray-400">
            Home / {categoryLabel} /{' '}
            <span className="text-gray-600">{product.name}</span>
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">

          {/* LEFT – IMAGES */}
          <div className="lg:col-span-4">
            <div className="border border-gray-200">
              <img
                src={selectedImage}
                alt={product.name}
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
              {product.name}
            </h1>

            <p className="text-lg font-semibold">
              {money(incVat)}{' '}
              <span className="text-sm font-normal text-gray-500">
                {money(product.price)} (ex. VAT)
              </span>
            </p>

            <p className="flex items-center gap-2 text-sm">
              {inStock ? (
                <span className="text-green-600">✔</span>
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-gray-600">Stock Status:</span>
              <span className={inStock ? 'text-green-600' : 'text-red-600'}>{inStock ? 'In Stock' : 'Out of Stock'}</span>
            </p>
          </div>

          {/* RIGHT – CART BOX */}
          <div className="lg:col-span-3">
            <div className="bg-gray-100 p-6">
              <Button
                variant="blue"
                size="lg"
                className="w-full"
                onClick={() => {
                  addItem(product.id, 1)
                  openMiniCart()
                }}
              >
                Add to Cart
              </Button>

              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2 text-sm text-gray-800"
                onClick={async () => {
                  if (!isAuthenticated) {
                    navigate('/auth')
                    return
                  }
                  if (isWishlisted) {
                    await removeFromWishlist(product.id)
                    return
                  }
                  await addToWishlist(product.id)
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
          {activeTab === 'info' && <p>{product.description}</p>}
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
          {activeTab === 'reviews' && <p>No reviews yet.</p>}
        </div>
      </Container>
    </section>
  )
}
