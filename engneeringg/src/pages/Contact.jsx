import { Mail, MapPin, Phone } from 'lucide-react'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

export default function Contact() {
  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Request a quote or schedule a site consultation"
            subtitle="Luxury delivery starts with structured scope capture. Send your details and we’ll respond with a clear next-step plan."
            tone="light"
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <form className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[0.7rem] tracking-[0.32em] uppercase text-obsidian/60">Name</span>
                  <input
                    className="h-12 rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian/80 outline-none transition-colors duration-500 ease-luxury focus:border-gold/60"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[0.7rem] tracking-[0.32em] uppercase text-obsidian/60">Email</span>
                  <input
                    className="h-12 rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian/80 outline-none transition-colors duration-500 ease-luxury focus:border-gold/60"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-[0.7rem] tracking-[0.32em] uppercase text-obsidian/60">Phone</span>
                  <input
                    className="h-12 rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian/80 outline-none transition-colors duration-500 ease-luxury focus:border-gold/60"
                    type="tel"
                    name="phone"
                    placeholder="+971 ..."
                    autoComplete="tel"
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-[0.7rem] tracking-[0.32em] uppercase text-obsidian/60">Message</span>
                  <textarea
                    className="min-h-[8rem] rounded-md border border-black/10 bg-white px-4 py-3 text-sm text-obsidian/80 outline-none transition-colors duration-500 ease-luxury focus:border-gold/60"
                    name="message"
                    placeholder="Project type, location, timeline, and any materials/finishes you prefer."
                    required
                  />
                </label>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-obsidian/55">UI only — connect to your backend endpoint later.</p>
                <Button type="submit" size="lg" variant="blue">
                  Send Request
                </Button>
              </div>
            </form>
          </Reveal>

          <Reveal delay={130} className="lg:col-span-5">
            <div className="grid gap-6">
              <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
                <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Direct</p>
                <div className="mt-6 grid gap-4 text-sm text-obsidian/70">
                  <a className="inline-flex items-center gap-3 transition-colors hover:text-obsidian" href="tel:+971000000000">
                    <Phone className="h-4 w-4 text-gold/90" />
                    +971 000 000 000
                  </a>
                  <a
                    className="inline-flex items-center gap-3 transition-colors hover:text-obsidian"
                    href="mailto:studio@aurumcivil.com"
                  >
                    <Mail className="h-4 w-4 text-gold/90" />
                    studio@aurumcivil.com
                  </a>
                  <div className="inline-flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-gold/90" />
                    <p>Dubai Design District, UAE</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
