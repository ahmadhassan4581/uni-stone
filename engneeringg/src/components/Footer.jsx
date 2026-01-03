 import { Link } from 'react-router-dom'
 import Container from './Container'

 export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white text-obsidian">
      <Container className="py-14">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-[0.14em] text-obsidian">AURUM CIVIL</span>
            <span className="mt-1 text-[0.65rem] tracking-[0.34em] uppercase text-gold/70">Engineering · Construction</span>
          </Link>
          <p className="max-w-xl text-sm leading-7 text-obsidian/65">
            Natural stone-inspired finishes, disciplined site delivery, and curated build packages.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-10">
              <nav className="space-y-2 text-sm">
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/">
                  Home
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/products">
                  Products
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/about">
                  About Us
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/contact">
                  Contact Us
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/delivery">
                  Delivery
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/samples">
                  Samples
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/faqs">
                  FAQ'S
                </Link>
              </nav>

              <nav className="space-y-2 text-sm">
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/returns">
                  Returns &amp; Refunds
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/products?category=Structural">
                  Project Photos
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/services">
                  What3words
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/services">
                  Blog
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/terms">
                  Terms
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/sitemap">
                  Sitemap
                </Link>
                <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/privacy">
                  Privacy
                </Link>
              </nav>
            </div>
          </div>

          <div className="md:col-span-4 md:text-center">
            <div className="space-y-3 text-sm text-obsidian/65">
              <p>
                Tel:{' '}
                <a className="text-obsidian transition-colors hover:text-gold-2" href="tel:+971000000000">
                  0273 89144
                </a>
              </p>
              <p>
                Email:{' '}
                <a className="text-gold/90 transition-colors hover:text-gold-2" href="mailto:inquiry@unistone.co.uk">
                  inquiry@unistone.co.uk
                </a>
              </p>
              <p>
                You can also fill out our Contact Form{' '}
                <Link className="text-gold/90 transition-colors hover:text-gold-2" to="/contact">
                  Here
                </Link>
              </p>
              <p className="pt-3 text-sm text-obsidian/50">
                Aurum Civil, Unit 30 The Old Brickworks<br />
                Station Road, Plumpton Green, East Sussex, BN7 3DF
              </p>
              <p className="text-obsidian/50">Office &amp; Showroom Opening Times</p>
              <p className="text-obsidian/50">08:30 - 16:30 Monday to Friday</p>
              <p className="text-obsidian/50">Saturdays, Sundays &amp; Bank Holidays - Closed</p>
            </div>
          </div>

          <div className="md:col-span-3 md:flex md:justify-end">
            <div className="w-full max-w-[240px] rounded-md border border-black/10 bg-neutral-50 p-5 text-center shadow-sm">
              <p className="text-xs font-medium tracking-[0.22em] text-gold/70">CUSTOMER RATING</p>
              <p className="mt-2 font-display text-4xl text-obsidian">4.9/5</p>
              <p className="mt-1 text-xs text-obsidian/45">(from verified reviews)</p>
              <div className="mt-4 h-px bg-black/10" />
              <p className="mt-4 text-xs text-obsidian/60">Order arrived quickly, well packed and exactly as described.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6 border-t border-black/10 pt-10">
          <a className="text-sm text-obsidian/65 transition-colors hover:text-obsidian" href="#">
            Instagram
          </a>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="rounded border border-black/10 bg-white px-3 py-1 text-xs font-medium text-obsidian/65">VISA</span>
            <span className="rounded border border-black/10 bg-white px-3 py-1 text-xs font-medium text-obsidian/65">VISA</span>
            <span className="rounded border border-black/10 bg-white px-3 py-1 text-xs font-medium text-obsidian/65">Mastercard</span>
            <span className="rounded border border-black/10 bg-white px-3 py-1 text-xs font-medium text-obsidian/65">Maestro</span>
            <span className="rounded border border-black/10 bg-white px-3 py-1 text-xs font-medium text-obsidian/65">PayPal</span>
          </div>
          <p className="text-xs text-obsidian/45">© {new Date().getFullYear()} Aurum Civil. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
 }
