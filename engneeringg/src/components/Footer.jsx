 import { useState } from 'react'
 import { Clock, Mail, MapPin, Phone } from 'lucide-react'
 import { Link } from 'react-router-dom'
 import Container from './Container'
 import { apiFetch } from '../lib/api'
 
 export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState({ type: '', message: '' })

  return (
    <footer className="border-t border-black/10 bg-white text-obsidian">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <Link to="/" className="flex flex-col leading-none">
              <span className="font-display text-2xl tracking-[0.14em] text-[rgba(199,159,80)]">Unistone Paving</span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-obsidian/65">
              Premium marble, granite, and natural stone solutions for residential and commercial projects. With years of industry
              expertise, we help architects, builders, and homeowners make confident stone choices.
            </p>
          </div>

          <div className="md:col-span-2">
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
                Catalog
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
            <nav className="mt-4 space-y-2 text-sm">
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/privacy">
                Privacy Policy
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/faqs">
                FAQs
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/returns">
                Refunds / Returns Policy
              </Link>
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/delivery">
                Delivery
              </Link>
            
              <Link className="block text-obsidian/65 transition-colors hover:text-obsidian" to="/info/pebble-guide">
                Pebble Guide
              </Link>
           
            </nav>
          </div>

          <div className="md:col-span-4">
            <div className="mt-4 space-y-3 text-sm text-obsidian/65">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-obsidian/65" />
                <p>Unistone Yard, Dartford, Kent</p>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-obsidian/65" />
                <p>+447564892282</p>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-obsidian/65" />
                <p>
                  <a className="text-blue-600 transition-colors hover:text-blue-700" href="mailto:inquiry@unistone.co.uk">
                    inquiry@unistone.co.uk
                  </a>
                </p>
              </div>
              <p>
                You can also fill out our Contact Form{' '}
                <Link className="text-[rgba(199,159,80)]  transition-colors hover:text-gold-2" to="/contact">
                  Here
                </Link>
              </p>

              <div className="pt-2">
                <p className="flex items-center gap-2 text-obsidian/50">
                  <Clock className="h-4 w-4 shrink-0 text-obsidian/50" />
                  <span>Business Hours (UAE / GMT+4)</span>
                </p>
                <p className="text-obsidian/50">Monday – Friday: 9:00 AM – 5:00 PM</p>
              </div>

              <div className="pt-2">
                <p className="text-xs font-medium tracking-[0.22em] text-[rgba(199,159,80)] ">Newsletter</p>
                <form
                  className="mt-3 flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const email = newsletterEmail.trim()
                    if (!email) return
                    setNewsletterStatus({ type: '', message: '' })
                    apiFetch('/api/newsletter', {
                      method: 'POST',
                      body: JSON.stringify({ email, source: 'footer' }),
                    })
                      .then(() => {
                        setNewsletterStatus({ type: 'success', message: 'Thanks! We received your email.' })
                        setNewsletterEmail('')
                      })
                      .catch((err) => {
                        setNewsletterStatus({ type: 'error', message: err?.message || 'Failed to submit email' })
                      })
                  }}
                >
                  <input
                    className="h-11 w-full rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian outline-none transition-all focus:border-gold/60"
                    type="email"
                    placeholder="Email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="h-11 rounded-md border border-blue-600 bg-blue-600 px-4 text-sm font-semibold tracking-[0.12em] uppercase text-white transition-colors hover:border-blue-700 hover:bg-blue-700"
                  >
                    Go
                  </button>
                </form>

                {newsletterStatus.message ? (
                  <div
                    className={
                      'mt-3 rounded-md p-3 text-sm ' +
                      (newsletterStatus.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700')
                    }
                  >
                    {newsletterStatus.message}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-black/10 pt-8">
          <p className="text-center text-xs text-obsidian/45">
            © 2026 UniStone Paving. All rights reserved. Crafted with precision. Inspired by natural stone.
          </p>
        </div>
      </Container>
    </footer>
  )
 }
