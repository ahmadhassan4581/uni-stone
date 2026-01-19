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
  const [searchFeedback, setSearchFeedback] = useState({ type: '', message: '' })
  const { totalCount } = useCart()
  const { isAuthenticated, logout, user } = useAuth()
  const { products } = useProducts()
  const navigate = useNavigate()

  const onSearchChange = (value) => {
    setSearchQuery(value)
    if (searchFeedback.message) setSearchFeedback({ type: '', message: '' })
  }

  const submitSearch = (e) => {
    e?.preventDefault?.()
    const q = searchQuery.trim()
    if (!q) {
      if (searchFeedback.message) setSearchFeedback({ type: '', message: '' })
      return
    }

    const qLower = q.toLowerCase()

    const pageMatches = [
      { keys: ['home'], to: '/' },
      { keys: ['products', 'product', 'all products', 'shop'], to: '/products' },
      { keys: ['about', 'about us'], to: '/about' },
      { keys: ['services', 'service'], to: '/services' },
      { keys: ['consultation', 'consult', 'request a call', 'call'], to: '/payment' },
      { keys: ['contact', 'contact us'], to: '/contact' },
      { keys: ['faq', 'faqs'], to: '/info/faqs' },
      { keys: ['delivery'], to: '/info/delivery' },
      { keys: ['orders', 'my orders'], to: '/orders' },
      { keys: ['profile', 'account'], to: isAuthenticated ? '/account/profile' : '/account' },
      { keys: ['cart', 'basket'], to: '/cart' },
    ]

    const page = pageMatches.find((p) => p.keys.some((k) => qLower.includes(k)))
    if (page) {
      setSearchFeedback({ type: '', message: '' })
      setOpen(false)
      navigate(page.to)
      return
    }

    const cat = categories.find((c) => {
      const cLower = String(c).toLowerCase()
      return qLower === cLower || qLower.includes(cLower)
    })
    if (cat) {
      setSearchFeedback({ type: '', message: '' })
      setOpen(false)
      navigate(`/products?category=${encodeURIComponent(cat)}`)
      return
    }

    const hasProductMatch = products.some((p) => {
      const name = String(p?.name || '').toLowerCase()
      const slug = String(p?.slug || '').toLowerCase()
      const category = String(p?.category || '').toLowerCase()
      return (name && name.includes(qLower)) || (slug && slug.includes(qLower)) || (category && category.includes(qLower))
    })

    if (hasProductMatch) {
      setSearchFeedback({ type: '', message: '' })
      setOpen(false)
      navigate(`/products?q=${encodeURIComponent(q)}`)
      return
    }

    setSearchFeedback({ type: 'error', message: 'No results found' })
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
      { to: '/payment', label: 'Request a Call' },
      { to: '/contact', label: 'Contact' },
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
      { to: '/products', label: 'All Products', tone: 'primary' },
      { to: `/products?category=${encodeURIComponent('Facade')}`, label: 'Facade', tone: 'primary' },
      { to: '/about', label: 'About', tone: 'secondary' },
      { to: '/services', label: 'Services', tone: 'secondary' },
      { to: '/info/delivery', label: 'Delivery', tone: 'secondary' },
      { to: '/info/faqs', label: 'FAQs', tone: 'secondary' },
      { to: '/info/pebble-guide', label: 'Pebble Guide', tone: 'sub' },
      { to: '/contact', label: 'Contact', tone: 'secondary' },
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
                  <div className="flex items-center border-b border-black/30 bg-white transition-colors duration-500 ease-luxury focus-within:border-black/60">
                    <input
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Search for products..."
                      className="h-11 w-full bg-transparent px-4 text-sm text-[#111111] outline-none placeholder:text-[#222222]"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-11 w-11 items-center justify-center text-[#111111] transition-colors duration-500 ease-luxury hover:text-blue-700"
                      aria-label="Search"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                  {searchFeedback.type === 'error' && searchFeedback.message ? (
                    <div className="text-xs text-red-700">{searchFeedback.message}</div>
                  ) : null}
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
                    <Button as={Link} to="/account" onClick={() => setOpen(false)} variant="light">
                      <User className="h-4 w-4" />
                      Account
                    </Button>
                  )}
                  <Button as={Link} to="/contact" onClick={() => setOpen(false)} variant="blue">
                    Request a Quote
                  </Button>
                  <Button as={Link} to="/payment" onClick={() => setOpen(false)} variant="light">
                    Request a Call
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
                className="flex items-center border-b border-black/30 bg-white transition-colors duration-500 ease-luxury focus-within:border-black/60"
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
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                <button
                  type="submit"
                  className="inline-flex h-10 w-11 items-center justify-center bg-transparent text-[#111111] transition-colors duration-500 ease-luxury hover:text-blue-700"
                  aria-label="Search"
                  title="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
              {searchFeedback.type === 'error' && searchFeedback.message ? (
                <div className="mt-2 px-4 text-xs text-red-700">{searchFeedback.message}</div>
              ) : null}
            </div>
          </div>

          <div className="hidden items-center gap-1.5 md:flex">
            {isAuthenticated ? (
              <Link
                to="/account/profile"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#111111] transition-colors duration-500 ease-luxury hover:text-blue-700"
                aria-label="Account"
                title="Account"
              >
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                to="/account"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#111111] transition-colors duration-500 ease-luxury hover:text-blue-700"
                aria-label="Account"
                title="Account"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            <Link
              to="/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-[#111111] transition-colors duration-500 ease-luxury hover:text-blue-700"
              aria-label={`Cart (${totalCount})`}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCount ? (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[0.55rem] font-semibold text-white">
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
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Categories">
              {categories
                .filter((cat) => cat !== 'Facade')
                .map((cat) => (
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

        <div className="hidden border-t border-black/10 bg-neutral-100 md:block">
          <Container className="py-2">
            <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2" aria-label="Quick links">
              {quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    'text-[0.7rem] font-semibold tracking-[0.22em] transition-colors',
                    l.tone === 'primary'
                      ? 'text-obsidian hover:text-black'
                      : l.tone === 'sub'
                        ? 'text-[0.65rem] font-semibold tracking-[0.3em] text-obsidian/55 hover:text-obsidian'
                        : 'text-obsidian/70 hover:text-obsidian',
                  )}
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
