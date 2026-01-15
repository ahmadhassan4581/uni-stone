import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { cn } from '../lib/cn'
import logo from '../assets/logo.png'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../context/ProductsContext'
import Container from './Container'
import Button from './Button'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalCount } = useCart()
  const { isAuthenticated, logout, user } = useAuth()
  const { products } = useProducts()
  const navigate = useNavigate()

  const submitSearch = (e) => {
    e?.preventDefault?.()
    const q = searchQuery.trim()
    if (!q) {
      navigate('/products')
      return
    }
    navigate(`/products?q=${encodeURIComponent(q)}`)
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/services', label: 'Services' },
      { to: '/products', label: 'Products' },
      { to: '/contact', label: 'Contact' },
      { to: '/payment', label: 'Consultation' },
    ],
    [],
  )

  const categories = useMemo(() => {
    const set = new Set()
    products.forEach((p) => {
      const c = p?.category
      if (typeof c === 'string' && c.trim()) set.add(c.trim())
    })
    const list = Array.from(set).sort((a, b) => a.localeCompare(b))
    return list.length ? list : ['Structural', 'Finishes', 'Facade']
  }, [products])

  const quickLinks = useMemo(
    () => [
      { to: '/contact', label: 'Contact' },
      { to: '/about', label: 'About' },
      { to: '/services', label: 'Service' },
      { to: '/info/delivery', label: 'Fast delivery' },
      { to: '/info/faqs', label: 'FAQs' },
      { to: '/info/pebble-guide', label: 'pebble-guide' },
    ],
    [],
  )

  const mobileMenu =
    typeof document === 'undefined'
      ? null
      : createPortal(
          <div
            className={cn(
              'fixed inset-0 z-[9999] overflow-hidden bg-white/95 transition-opacity duration-500 ease-luxury md:hidden',
              open ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <button
              type="button"
              className="absolute inset-0 z-0 h-full w-full cursor-default"
              aria-label="Close"
              onClick={() => setOpen(false)}
            />

            <div
              className={cn(
                'relative z-10 ml-auto flex h-full w-[84%] max-w-sm flex-col overflow-hidden border-l border-black/10 bg-white transition-transform duration-500 ease-luxury',
                open ? 'translate-x-0' : 'translate-x-full',
              )}
            >
              <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
                <div className="flex items-center gap-4 leading-none">
                  <span className="inline-flex h-12 w-[4.5rem] shrink-0 items-center justify-center sm:h-14 sm:w-20">
                    <img
                      src={logo}
                      alt="Unistone"
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span className="text-[0.65rem] tracking-[0.34em] uppercase text-obsidian/60">Menu</span>
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white text-[#111111] transition-all duration-500 ease-luxury hover:border-black/20 hover:text-black"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-7">
                <form className="grid gap-2" onSubmit={submitSearch}>
                  <span className="text-[0.65rem] tracking-[0.34em] uppercase text-obsidian/60">Search</span>
                  <div className="flex overflow-hidden rounded-md border border-black/30 bg-white transition-colors duration-500 ease-luxury focus-within:border-black/60">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products..."
                      className="h-11 w-full bg-transparent px-4 text-sm text-[#111111] outline-none placeholder:text-[#222222]"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-11 w-11 items-center justify-center border-l border-black/30 bg-blue-600 text-white transition-colors duration-500 ease-luxury hover:bg-blue-700"
                      aria-label="Search"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </form>

                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold tracking-[0.18em] uppercase text-[#111111] transition-[background-color,color,box-shadow] duration-300 ease-in-out hover:bg-[#ededed] hover:text-black active:bg-[#e0e0e0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/30',
                        isActive && 'bg-[#e0e0e0] font-bold text-black shadow-[0_1px_0_rgba(0,0,0,0.12)]',
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}

                <div className="mt-4 grid gap-3">
                  <Button as={Link} to="/cart" onClick={() => setOpen(false)} variant="light">
                    <ShoppingBag className="h-4 w-4" />
                    Cart ({totalCount})
                  </Button>
                  {isAuthenticated ? (
                    <div className="grid gap-2 rounded-md border border-black/10 bg-white p-3 text-left">
                      <Link
                        to="/account/profile"
                        onClick={() => setOpen(false)}
                        className="grid gap-0.5 rounded-md border border-black/10 bg-neutral-50 px-3 py-2 transition-colors hover:bg-neutral-100"
                      >
                        <div className="text-xs font-semibold tracking-[0.12em] uppercase text-[#111111]">{user?.name || 'Account'}</div>
                        <div className="text-xs text-obsidian/70">{user?.email || ''}</div>
                      </Link>
                      <Button
                        as={Link}
                        to="/orders"
                        onClick={() => setOpen(false)}
                        variant="light"
                        className="h-10 px-4 text-xs"
                      >
                        My Orders
                      </Button>
                      <Button type="button" onClick={handleLogout} variant="light" className="h-10 px-4 text-xs">
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button as={Link} to="/auth" onClick={() => setOpen(false)} variant="light">
                      <User className="h-4 w-4" />
                      Account
                    </Button>
                  )}
                  <Button as={Link} to="/contact" onClick={() => setOpen(false)} variant="blue">
                    Request a Quote
                  </Button>
                  <Button as={Link} to="/payment" onClick={() => setOpen(false)} variant="light">
                    Book Consultation
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/30 bg-white">
        <Container className="flex items-center gap-4 py-2">
          <Link
            to="/"
            className="flex shrink-0 items-center border-0 bg-transparent px-2 py-0.5 outline-none [-webkit-tap-highlight-color:transparent] hover:border-0 hover:bg-transparent focus:border-0 focus:bg-transparent focus:outline-none active:border-0 active:bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Unistone"
          >
            <span className="inline-flex h-10 w-28 shrink-0 items-center justify-center sm:h-11 sm:w-32">
              <img
                src={logo}
                alt="Unistone"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="sr-only">Unistone</span>
          </Link>

          <div className="hidden flex-1 md:block">
            <div className="mx-auto max-w-3xl">
              <form
                className="flex overflow-hidden rounded-md border border-black/30 bg-white transition-colors duration-500 ease-luxury focus-within:border-black/60"
                onSubmit={submitSearch}
              >
                <label className="sr-only" htmlFor="site-search">
                  Search
                </label>
                <input
                  id="site-search"
                  placeholder="Search for products..."
                  className="h-10 w-full bg-transparent px-4 text-sm text-[#111111] outline-none placeholder:text-[#222222]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="inline-flex h-10 w-11 items-center justify-center border-l border-black/30 bg-blue-600 text-white transition-colors duration-500 ease-luxury hover:bg-blue-700"
                  aria-label="Search"
                  title="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>

          <div className="hidden items-center gap-1.5 md:flex">
            {isAuthenticated ? (
              <Link
                to="/account/profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white text-[#111111] transition-all duration-500 ease-luxury hover:border-black/20 hover:text-black"
                aria-label="Account"
                title="Account"
              >
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                to="/auth"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white text-[#111111] transition-all duration-500 ease-luxury hover:border-black/20 hover:text-black"
                aria-label="Account"
                title="Account"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            <Link
              to="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white text-[#111111] transition-all duration-500 ease-luxury hover:border-black/20 hover:text-black"
              aria-label={`Cart (${totalCount})`}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCount ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[0.65rem] font-semibold text-obsidian">
                  {totalCount}
                </span>
              ) : null}
            </Link>
          </div>

          <button
            type="button"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white text-[#111111] transition-all duration-500 ease-luxury hover:border-black/20 hover:text-black md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </Container>

        <div className="hidden border-t border-black/10 bg-white md:block">
          <Container className="py-2">
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Categories">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-xs font-semibold tracking-[0.12em] text-[#111111] transition-colors hover:text-black"
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </Container>
        </div>

        <div className="hidden border-t border-blue-700 bg-blue-600 md:block">
          <Container className="py-2">
            <nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2" aria-label="Quick links">
              {quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-[0.7rem] font-semibold tracking-[0.22em] text-white/95 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      </header>

      {mobileMenu}
    </>
  )
}
