import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import Container from '../components/Container'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'

export default function Wishlist() {
  const { user, isAuthenticated } = useAuth()
  const { products } = useProducts()

  const wishlistIds = Array.isArray(user?.wishlist) ? user.wishlist : []

  const wishlistProducts = useMemo(() => {
    return wishlistIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean)
  }, [wishlistIds, products])

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <Breadcrumbs tone="light" items={[{ label: 'Home', to: '/' }, { label: 'Your Account', to: '/account/profile' }, { label: 'Wish List' }]} />
        </Reveal>

        <Reveal className="mt-8">
          <SectionHeading eyebrow="Account" title="Your Wish List" subtitle="Items you saved for later." tone="light" />
        </Reveal>

        <div className="mt-12">
          {!isAuthenticated ? (
            <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <p className="text-sm text-obsidian/70">Please login to view your wish list.</p>
              <div className="mt-6">
                <Button as={Link} to="/account" variant="blue" size="lg">
                  Login
                </Button>
              </div>
            </div>
          ) : wishlistProducts.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlistProducts.map((p, idx) => (
                <Reveal key={p.id || p.slug || p.name} delay={idx * 70}>
                  <ProductCard product={p} tone="light" />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-black/10 bg-neutral-50 p-8">
              <p className="text-sm text-obsidian/70">Your wish list is empty.</p>
              <div className="mt-6">
                <Button as={Link} to="/products" variant="blue" size="lg">
                  Explore Products
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
