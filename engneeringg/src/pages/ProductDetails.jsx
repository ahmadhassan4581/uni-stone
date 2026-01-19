import { ArrowLeft, ChevronDown, ChevronUp, Heart, Instagram, XCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import Breadcrumbs from '../components/Breadcrumbs'
import Container from '../components/Container'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'

function money(n) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'GBP',
  }).format(n)
}

function vatInclusivePrice(price, vatRate) {
  const base = Number(price)
  const rate = Number(vatRate)
  if (!Number.isFinite(base)) return 0
  if (!Number.isFinite(rate) || rate <= 0) return base
  return base * (1 + rate / 100)
}

export default function ProductDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products, loading, error, refresh } = useProducts()
  const product = useMemo(() => products.find(p => p.slug === slug), [products, slug])
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState('info')
  const [selectedImage, setSelectedImage] = useState('')
  const [isImageSwitching, setIsImageSwitching] = useState(false)
  const [showAllImages, setShowAllImages] = useState(false)

  useEffect(() => {
    refresh()
  }, [refresh])

  const images = useMemo(() => {
    const fromApi = Array.isArray(product?.images) ? product.images.filter(Boolean) : []
    if (fromApi.length) return fromApi.slice(0, 5)
    if (product?.image) return [product.image]
    return []
  }, [product])

  useEffect(() => {
    setSelectedImage(images[0] || '')
    setIsImageSwitching(false)
  }, [images])

  if (loading) {
    return (
      <section className="bg-white">
        <Container className="py-20 sm:py-24">
          <p className="text-sm text-obsidian/70">Loading...</p>
        </Container>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-white">
        <Container className="py-20 sm:py-24">
          <p className="text-sm text-red-700">{error}</p>
          <div className="mt-10">
            <Button as={Link} to="/products" size="lg" variant="light">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </Container>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="bg-white">
        <Container className="py-20 sm:py-24">
          <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Product</p>
          <h1 className="mt-6 font-display text-4xl tracking-[0.03em] text-obsidian">Not found</h1>
          <p className="mt-6 text-sm leading-7 text-obsidian/70">This product doesn’t exist.</p>
          <div className="mt-10">
            <Button as={Link} to="/products" size="lg" variant="light">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </Container>
      </section>
    )
  }

  const hasStock = product.stock !== undefined && product.stock !== null && product.stock !== ''
  const stock = hasStock ? Number(product.stock) : null
  const inStock = !hasStock || (Number.isFinite(stock) && stock > 0)
  const thumbnails = showAllImages ? images : images.slice(0, 4)
  const mainImage = selectedImage || images[0] || ''
  const safeBullets = Array.isArray(product?.bullets) ? product.bullets.filter(Boolean) : []
  const safeSpecs = Array.isArray(product?.specifications)
    ? product.specifications
        .map((row) => ({
          label: String(row?.label || '').trim(),
          value: String(row?.value || '').trim(),
        }))
        .filter((row) => row.label || row.value)
    : []

  return (
    <section className="bg-white">
      <Container className="py-12">
        <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-obsidian/60">{product.category || 'Products'}</p>
          </div>
          <div className="sm:text-right">
            <Breadcrumbs
              tone="light"
              items={[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                ...(product.category
                  ? [{ label: product.category, to: `/products?category=${encodeURIComponent(product.category)}` }]
                  : []),
                { label: product.name },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-md border border-black/10 bg-white">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-50">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className={
                      'h-full w-full object-cover transition-opacity duration-300 ' +
                      (isImageSwitching ? 'opacity-70' : 'opacity-100')
                    }
                    loading="eager"
                    onLoad={() => setIsImageSwitching(false)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-obsidian/60">No image</div>
                )}
              </div>
            </div>

            {thumbnails.length ? (
              <div className="mt-4">
                <div className="grid grid-cols-4 gap-3">
                  {thumbnails.map((src) => {
                    const active = src === mainImage
                    return (
                      <button
                        key={src}
                        type="button"
                        onClick={() => {
                          if (src === mainImage) return
                          setIsImageSwitching(true)
                          setSelectedImage(src)
                        }}
                        aria-label={active ? 'Selected image' : 'View image'}
                        className={
                          'aspect-square w-full overflow-hidden rounded border bg-white transition-colors ' +
                          (active
                            ? 'border-blue-600 ring-2 ring-blue-600/40'
                            : 'border-black/10 hover:border-blue-600/50')
                        }
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </button>
                    )
                  })}
                </div>

                {images.length > 4 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllImages((s) => !s)}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    {showAllImages ? 'View less images' : 'View more images'}
                    {showAllImages ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-4">
            <h1 className="text-xl font-semibold text-obsidian sm:text-2xl">{product.name}</h1>

            <div className="mt-3">
              {(() => {
                const defaultVatRate = 20
                const vatRate = Number.isFinite(Number(product?.vatRate)) ? Number(product.vatRate) : defaultVatRate
                const incVat = vatInclusivePrice(product.price, vatRate)

                return (
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-obsidian sm:text-xl">
                      {money(product.price)}
                      <span className="ml-2 text-sm font-normal text-obsidian/55">(ex. VAT)</span>
                    </p>
                    <p className="text-sm text-obsidian/70">
                      <span className="font-semibold text-obsidian">{money(incVat)}</span>
                      <span className="ml-2 text-obsidian/55">(incl. VAT{vatRate ? ` ${vatRate}%` : ''})</span>
                    </p>
                  </div>
                )
              })()}
            </div>

            <p className="mt-3 flex items-center gap-2 text-sm text-obsidian/70">
              {inStock ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium text-obsidian/70">Stock Status:</span>
              <span className={inStock ? 'text-green-700' : 'text-red-700'}>{inStock ? 'In Stock' : 'Out of Stock'}</span>
            </p>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                aria-label="Instagram"
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-black/10 bg-white text-obsidian/70 hover:border-black/20 hover:text-obsidian"
              >
                <Instagram className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-md border border-black/10 bg-white p-5">
              <Button
                variant="blue"
                size="lg"
                className="w-full"
                disabled={!inStock}
                onClick={() => {
                  if (!inStock) return
                  addItem(product.id, 1)
                  navigate('/cart')
                }}
              >
                Add to Cart
              </Button>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-black/10 bg-white py-3 text-xs font-medium text-obsidian/70 transition-colors hover:border-black/20 hover:text-obsidian">
                <Heart className="h-4 w-4" />
                Add to your Wish List
              </button>

            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-16">
          <div className="border-b flex gap-8 text-sm">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-3 ${
                activeTab === 'info'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Information
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 ${
                activeTab === 'specs'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Reviews
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="mt-6 text-sm text-gray-700 leading-7">
            {activeTab === 'info' && <p>{product.description || ''}</p>}
            {activeTab === 'specs' && (
              safeSpecs.length ? (
                <div className="overflow-x-auto rounded-md border border-black/10 bg-white">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-black/10">
                      {safeSpecs.map((row, idx) => (
                        <tr key={`${row.label}-${idx}`} className="align-top">
                          <th className="w-1/3 whitespace-nowrap px-4 py-3 font-semibold text-obsidian">
                            {row.label || '-'}
                          </th>
                          <td className="px-4 py-3 text-obsidian/70">{row.value || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : safeBullets.length ? (
                <div className="overflow-x-auto rounded-md border border-black/10 bg-white">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-black/10">
                      {safeBullets.map((b, idx) => (
                        <tr key={`${b}-${idx}`} className="align-top">
                          <th className="w-1/3 whitespace-nowrap px-4 py-3 font-semibold text-obsidian">Specification</th>
                          <td className="px-4 py-3 text-obsidian/70">{b}</td>
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
        </div>

        {/* BACK */}
        <div className="mt-12">
          <Button as={Link} to="/products" variant="light" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </Container>
    </section>
  )
}
