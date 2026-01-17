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

  useEffect(() => {
    refresh()
  }, [refresh])

  if (!product) return null

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
            <div className="border rounded-md overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[420px] object-cover"
              />
            </div>

            {/* Thumbnails (UI only) */}
            <div className="mt-4 flex gap-3">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="h-20 w-20 border rounded overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
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
            <p className="mt-2 text-sm text-green-600 font-medium">
              ✔ In Stock
            </p>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col gap-4">
              <Button
                variant="blue"
                size="lg"
                className="w-full"
                onClick={() => addItem(product.id, qty)}
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
