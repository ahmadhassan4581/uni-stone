 import { Link } from 'react-router-dom'
 import Container from './Container'
 
 export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white text-obsidian">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <Link to="/" className="flex flex-col leading-none">
              <span className="font-display text-2xl tracking-[0.14em] text-obsidian">Unistone paving</span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-obsidian/65">
              Premium marble, granite, and natural stone solutions for residential and commercial projects. With years of industry
              expertise, we help architects, builders, and homeowners make confident stone choices.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-medium tracking-[0.22em] text-gold/70">Menu</p>
            <nav className="mt-4 space-y-2 text-sm">
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/">
                Home
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/about">
                About Us
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/services">
                Services
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/products">
                catlog
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/payment">
                Consultation
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/contact">
                Contact Us
              </Link>
            </nav>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-medium tracking-[0.22em] text-gold/70">Resources</p>
            <nav className="mt-4 space-y-2 text-sm">
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/privacy">
                Privacy Policy
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/faqs">
                FAQs
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/returns">
                Our Refunds / Returns Policy
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/delivery">
                Deliver
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/samples">
                Samples
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/pebble-guide">
                pebble-guide:
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/samples">
                Samples
              </Link>
            </nav>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-medium tracking-[0.22em] text-gold/70">Contact Us</p>
            <div className="mt-4 space-y-3 text-sm text-obsidian/65">
              <p>📍 Dubai Design District, UAE</p>
              <p>📞 +971 000 000 000</p>
              <p>
                ✉{' '}
                <a className="text-gold/90 transition-colors hover:text-gold-2" href="mailto:info@unistone.com">
                  info@unistone.com
                </a>
              </p>
              <p>
                You can also fill out our Contact Form{' '}
                <Link className="text-gold/90 transition-colors hover:text-gold-2" to="/contact">
                  Here
                </Link>
              </p>

              <div className="pt-2">
                <p className="text-obsidian/50">🕒 Business Hours (UAE / GMT+4)</p>
                <p className="text-obsidian/50">Monday – Friday: 9:00 AM – 5:00 PM</p>
              </div>

              <div className="pt-2">
                <p className="text-xs font-medium tracking-[0.22em] text-gold/70">Newsletter</p>
                <form
                  className="mt-3 flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                  }}
                >
                  <input
                    className="h-11 w-full rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian outline-none transition-all focus:border-gold/60"
                    type="email"
                    placeholder="Email"
                  />
                  <button
                    type="submit"
                    className="h-11 rounded-md border border-blue-600 bg-blue-600 px-4 text-sm font-semibold tracking-[0.12em] uppercase text-white transition-colors hover:border-blue-700 hover:bg-blue-700"
                  >
                    Go
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-black/10 pt-8">
          <p className="text-center text-xs text-obsidian/45">
            © 2026 UniStone. All rights reserved. Crafted with precision. Inspired by natural stone.
          </p>
        </div>
      </Container>
    </footer>
  )
 }
