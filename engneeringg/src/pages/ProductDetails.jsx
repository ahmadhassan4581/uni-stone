import { ArrowLeft, Heart } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/Button'
import Breadcrumbs from '../components/Breadcrumbs'
import Container from '../components/Container'
import QuantityControl from '../components/QuantityControl'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'

function money(n) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'GBP',
  }).format(n)
}

export default function ProductDetails() {
  const { slug } = useParams()
  const { products, loading, error, refresh } = useProducts()
  const product = useMemo(() => products.find(p => p.slug === slug), [products, slug])
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('info')
  const [selectedImage, setSelectedImage] = useState('')
  const [isImageSwitching, setIsImageSwitching] = useState(false)

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

  useEffect(() => {
    const stock = Number(product?.stock ?? 0)
    if (!Number.isFinite(stock) || stock <= 0) return
    setQty((current) => Math.max(1, Math.min(current, stock)))
  }, [product?.stock])

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

  const stock = Number(product.stock ?? 0)
  const inStock = Number.isFinite(stock) && stock > 0
  const thumbnails = images.slice(0, 4)
  const mainImage = selectedImage || images[0] || ''

  return (
    <section className="bg-white">
      <Container className="py-10">
        {/* Breadcrumb */}
        <Breadcrumbs
          tone="light"
          items={[
            { label: 'Home', to: '/' },
            { label: 'Products', to: '/products' },
            { label: product.category },
            { label: product.name },
          ]}
        />

        {/* MAIN GRID */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT – IMAGES */}
          <div>
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
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
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
                        'h-20 w-20 shrink-0 overflow-hidden rounded border bg-white transition-colors ' +
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
            ) : null}
          </div>

          {/* RIGHT – PRODUCT INFO */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {product.name}
            </h1>

            {/* PRICE */}
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">
                {money(product.price)}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (ex. VAT)
                </span>
              </p>
            </div>

            {/* STOCK */}
            <p className={
              'mt-2 text-sm font-medium ' +
              (inStock ? 'text-green-600' : 'text-red-600')
            }>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </p>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col gap-4">
              <Button
                variant="blue"
                size="lg"
                className="w-full"
                disabled={!inStock}
                onClick={() => {
                  if (!inStock) return
                  addItem(product.id, qty)
                }}
              >
                Add to Cart
              </Button>

              <button className="flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-black">
                <Heart className="h-4 w-4" />
                Add to your Wish List
              </button>
            </div>

            {/* QUANTITY */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm text-gray-600">Quantity</span>
              <QuantityControl value={qty} onChange={setQty} tone="light" />
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
            {activeTab === 'info' && <p>{product.description}</p>}
            {activeTab === 'specs' && (
              <ul className="list-disc ml-5">
                {product.bullets.map(b => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
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
