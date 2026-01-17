import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import aboutIcon from '../assets/about-new.png'
import contactIcon from '../assets/contact-new.png'
import sampleIcon from '../assets/sample-new.png'
import Button from '../components/Button'
import Container from '../components/Container'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { useProducts } from '../context/ProductsContext'

export default function Home() {
  const { products, refresh } = useProducts()

  useEffect(() => {
    refresh()
  }, [refresh])

  const featured = useMemo(() => products.slice(0, 4), [products])
  const heroSlides = useMemo(
    () => [
      {
        src: 'https://plus.unsplash.com/premium_photo-1663040562058-feb5f8470a24?auto=format&fit=crop&w=3200&q=90',
        alt: 'Construction site hero background',
        title: 'Premium Construction',
        subtitle: 'Explore our range of engineering services and curated build packages.',
        ctaLabel: 'Shop Now',
        ctaTo: '/products',
      },
      {
        src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=3200&q=90',
        alt: 'Construction cranes and structure',
        title: 'Structural Excellence',
        subtitle: 'Calm site control, disciplined sequencing, and refined delivery.',
        ctaLabel: 'Shop Now',
        ctaTo: '/products',
      },
      {
        src: 'https://media.istockphoto.com/id/174072557/photo/hydraulic-lift.jpg?s=1024x1024&w=is&k=20&c=uRJzcSk4MMvqkX8AI-u_onNxyWUXRsn446Aua9DgRsg=',
        alt: 'Hydraulic lift',
        title: 'Facade & Finishes',
        subtitle: 'Materials-first detailing for modern, luxury-grade environments.',
        ctaLabel: 'Shop Now',
        ctaTo: '/products',
      },
    ],
    [],
  )

  const [heroIndex, setHeroIndex] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)

  useEffect(() => {
    heroSlides.forEach((s) => {
      const img = new Image()
      img.src = s.src
    })
  }, [heroSlides])

  useEffect(() => {
    if (heroPaused) return
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length)
    }, 6000)
    return () => window.clearInterval(id)
  }, [heroPaused, heroSlides.length])

  const prevHero = () => setHeroIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length)
  const nextHero = () => setHeroIndex((i) => (i + 1) % heroSlides.length)

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
        >
          {heroSlides.map((s, idx) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.alt}
              decoding="async"
              fetchPriority={idx === heroIndex ? 'high' : 'auto'}
              className={
                'absolute inset-0 h-full w-full object-cover brightness-110 contrast-110 saturate-125 transition-opacity duration-700 ease-luxury ' +
                (idx === heroIndex ? 'opacity-100' : 'opacity-0')
              }
              loading="eager"
            />
          ))}
          <div className="absolute inset-0 bg-obsidian/10" />
          <div className="absolute inset-0 bg-[radial-gradient(closest-side_at_78%_45%,rgba(200,164,93,0.22),transparent_62%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/10 to-obsidian/70" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
          <button
            type="button"
            onClick={prevHero}
            aria-label="Previous slide"
            className="pointer-events-auto absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md border border-gold/25 bg-obsidian/35 text-white/80 backdrop-blur transition-all duration-500 ease-luxury hover:border-gold/50 hover:bg-obsidian/55 hover:text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={nextHero}
            aria-label="Next slide"
            className="pointer-events-auto absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md border border-gold/25 bg-obsidian/35 text-white/80 backdrop-blur transition-all duration-500 ease-luxury hover:border-gold/50 hover:bg-obsidian/55 hover:text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <Container className="relative flex min-h-[420px] items-center justify-center py-16 sm:min-h-[520px] sm:py-24">
          <Reveal>
            <div className="pointer-events-none w-full max-w-xl rounded-md border border-gold/15 bg-obsidian/35 p-8 text-center shadow-[0_0_0_1px_rgba(200,164,93,0.08)] backdrop-blur">
              <p className="font-display text-3xl tracking-[0.02em] text-white sm:text-4xl">{heroSlides[heroIndex].title}</p>
              <p className="mt-4 text-sm leading-7 text-white/70">{heroSlides[heroIndex].subtitle}</p>
              <div className="pointer-events-auto mt-7 flex justify-center">
                <Button as={Link} to={heroSlides[heroIndex].ctaTo} size="md" className="min-w-40" variant="blue">
                  {heroSlides[heroIndex].ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>

        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center">
          <div
            className="flex items-center justify-center gap-2 rounded-full border border-gold/15 bg-obsidian/35 px-4 py-2 backdrop-blur"
            aria-label="Hero slide navigation"
          >
            {heroSlides.map((_, i) => {
              const active = i === heroIndex
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHeroIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={
                    'h-2.5 w-2.5 rounded-full border transition-all duration-500 ease-luxury ' +
                    (active ? 'border-gold/70 bg-gold/70' : 'border-gold/25 bg-transparent hover:border-gold/55')
                  }
                />
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <Container className="py-5 sm:py-6">
          <Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                to="/products?category=Structural"
                className="group relative isolate overflow-hidden rounded-md border border-black/10 bg-white shadow-sm"
                aria-label="Structural category"
              >
                <img
                  src="https://images.unsplash.com/photo-1602757115429-b4190ae087be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGNvbnN0cnVjdGlvbiUyMHNpdGV8ZW58MHx8MHx8fDA%3D"
                  alt="Structural"
                  className="h-80 w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
                <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 px-6 text-center sm:bottom-10">
                  <p className="text-2xl font-semibold text-white drop-shadow sm:text-3xl">Structural</p>
                  <span className="inline-flex h-10 items-center justify-center rounded-sm bg-white px-6 text-sm font-semibold text-slate-900 shadow-sm transition-colors duration-300 hover:bg-white/90">
                    Shop Now
                  </span>
                </div>
              </Link>

              <Link
                to="/products?category=Finishes"
                className="group relative isolate overflow-hidden rounded-md border border-black/10 bg-white shadow-sm"
                aria-label="Finishes category"
              >
                <img
                  src="https://images.unsplash.com/photo-1713593930871-e21d7f9ef4a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGNvbnN0cnVjdGlvbiUyMHNpdGV8ZW58MHx8MHx8fDA%3D"
                  alt="Finishes"
                  className="h-80 w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
                <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 px-6 text-center sm:bottom-10">
                  <p className="text-2xl font-semibold text-white drop-shadow sm:text-3xl">Finishes</p>
                  <span className="inline-flex h-10 items-center justify-center rounded-sm bg-white px-6 text-sm font-semibold text-slate-900 shadow-sm transition-colors duration-300 hover:bg-white/90">
                    Shop Now
                  </span>
                </div>
              </Link>

              <Link
                to="/products?category=Facade"
                className="group relative isolate overflow-hidden rounded-md border border-black/10 bg-white shadow-sm"
                aria-label="Facade category"
              >
                <img
                  src="https://images.unsplash.com/photo-1664312616511-81fe2e745cb3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fGNvbnN0cnVjdGlvbiUyMHNpdGV8ZW58MHx8MHx8fDA%3D"
                  alt="Facade"
                  className="h-80 w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
                <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 px-6 text-center sm:bottom-10">
                  <p className="text-2xl font-semibold text-white drop-shadow sm:text-3xl">Facade</p>
                  <span className="inline-flex h-10 items-center justify-center rounded-sm bg-white px-6 text-sm font-semibold text-slate-900 shadow-sm transition-colors duration-300 hover:bg-white/90">
                    Shop Now
                  </span>
                </div>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white">
        <div className="py-8 sm:py-10">
          <Reveal>
            <div className="relative isolate overflow-hidden border-y border-black/10">
              <img
                src="https://plus.unsplash.com/premium_photo-1663040562058-feb5f8470a24?auto=format&fit=crop&w=2400&q=85"
                alt="Construction site hero background"
                className="h-[340px] w-full object-cover brightness-105 contrast-105 sm:h-[420px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-obsidian/10" />

              <div className="absolute inset-0 flex items-center justify-center px-5">
                <div className="w-full max-w-3xl rounded-md border border-white/35 bg-white/75 p-8 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.25)] backdrop-blur sm:p-12">
                  <p className="font-display text-3xl text-obsidian sm:text-4xl">Signature</p>
                  <p className="mt-4 text-sm leading-7 text-obsidian/80 sm:text-base">
                    Explore premium delivery packages designed for calm site control and refined outcomes.
                  </p>
                  <div className="mt-7 flex justify-center">
                    <Button as={Link} to="/products" size="md" variant="blue">
                      Shop Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <Container className="py-16 sm:py-20">
          <Reveal>
            <div className="border-b border-black/10 pb-4">
              <h2 className="font-display text-3xl tracking-[0.02em] text-obsidian sm:text-4xl">Stone Sinks &amp; Wash Basins</h2>
              <div className="mt-3 h-1 w-28 bg-gold" />
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, idx) => (
              <Reveal key={p.id || p.name} delay={idx * 80}>
                <ProductCard product={p} tone="light" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 sm:py-20">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12 md:items-start">
              <div className="md:col-span-12">
                <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Engineering</p>
                <h2 className="mt-5 font-display text-3xl leading-[1.05] tracking-[0.03em] text-obsidian sm:text-4xl">
                  Civil Engineering &amp; Construction
                </h2>
                <div className="mt-6 space-y-5 text-sm leading-7 text-obsidian/70 sm:text-[0.95rem]">
                  <p>
                    At Marblemosaics Ltd we are dedicated to sourcing and supplying only the finest quality garden paving slabs
                    at the most affordable prices. With a wealth of knowledge and expertise spanning over two decades, we are
                    the one of the UK’s leading specialist in high-quality patio &amp; garden tiles . Whether in natural stone or
                    porcelains. Whether you're looking to transform your garden into a tranquil oasis with the help of Indian
                    Sandstone, Porcelain, Granite, Limestone, or Slate Paving, we are confident that we have the perfect stone
                    for you and your budget. By understanding the Natural Stone and Porcelain Paving market, we can guarantee
                    you the best possible prices and customer service you’ll find online..
                  </p>
                  <p>
                    At Marblemosaics Ltd , you can count on the expertise of our team to help you select the ideal patio paving
                    slab for your garden project or mosaic tile for your bathroom or kitchen. With complimentary samples, you can
                    view and appreciate the stone for yourself, giving you the confidence you need to make the purchase.
                  </p>
                  <p>
                    Our customer service team boasts extensive experience and is ready to provide support throughout the process,
                    from beginning to end. We have multiple communication options, such as Phone, Email, and off course in person
                    at our Sussex showroom .
                  </p>
                  <p>
                    We are focused on providing you with a satisfying experience and delivering you the best value for your
                    money. From ordering samples to pricing, delivery to product aftercare, we are dedicated to your
                    satisfaction.
                  </p>
                  <p>
                    All our products in the website are priced by square metre (m2) and are fully inclusive of VAT. We have
                    achieved unbeatable prices by buying directly in bulk from unique sources, from Mines or Quarries from the
                    four corners of the globe. Through the internet (no massive marketing budgets), coupled with our extremely low
                    overheads, and the fact that we don't occupy expensive high street retail outlets (we have two warehouses and
                    a yard), equates to us being able to offer all our customers astounding deals on stone &amp; mosaic tiles. Our
                    current range includes Split Face Mosaics, Quartz Tiles, , Turkish Travertine, Limestone Tiles , Stone &amp; Marble
                    Wash Basins &amp; Sinks Glass Mosaics, Pebble mosaic flooring. and many other exclusive tiles for Walls or Floors.
                  </p>
                  <p>
                    Now stocking a huge range of Outdoor landscaping materials including a huge range of Porcelain and Stone
                    Coping Stones and Steps with Bullnosed Edges, Slate Pavers , Granite Garden Patio Slabs, Sawn Smooth Paving ,
                    Outdoor Porcelain Patio Tiles. Dijon &amp; Jerusalem Limestone Paving &amp; Driveway Cobbles. We have over 30,000 items
                    in stock at unbeatable prices. Viewing is welcomed at our Plumpton Green Showroom in East Sussex a short drive
                    from Surrey, Hampshire, London or Kent.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7">
                <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Next step</p>
                <h2 className="mt-5 font-display text-3xl leading-[1.05] tracking-[0.03em] text-obsidian sm:text-4xl">
                  Ready for a calm, luxury-grade build process?
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-obsidian/70">
                  Tell us about your project scope. We’ll respond with a structured plan, recommended service track, and a
                  consultation schedule.
                </p>
              </div>
              <div className="md:col-span-5 md:flex md:justify-end">
                <div className="grid w-full gap-3 sm:max-w-sm">
                  <Button as={Link} to="/contact" size="lg" variant="blue">
                    Request a Quote
                  </Button>
                  <Button as={Link} to="/payment" size="lg" variant="light">
                    Book Consultation
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-10 sm:py-12">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
            <Link
              to="/info/samples"
              className="group flex flex-col items-center justify-center gap-4 text-center"
              aria-label="Samples"
            >
              <img
                src={sampleIcon}
                alt="Samples"
                className="h-32 w-32 object-contain transition-transform duration-500 ease-luxury group-hover:scale-[1.02] sm:h-40 sm:w-40"
                loading="lazy"
              />
              <p className="text-sm font-medium text-obsidian">Samples</p>
            </Link>

            <Link
              to="/about"
              className="group flex flex-col items-center justify-center gap-4 text-center"
              aria-label="About Us"
            >
              <img
                src={aboutIcon}
                alt="About Us"
                className="h-32 w-32 object-contain transition-transform duration-500 ease-luxury group-hover:scale-[1.02] sm:h-40 sm:w-40"
                loading="lazy"
              />
              <p className="text-sm font-medium text-obsidian">About Us</p>
            </Link>

            <Link
              to="/contact"
              className="group flex flex-col items-center justify-center gap-4 text-center"
              aria-label="Contact Us"
            >
              <img
                src={contactIcon}
                alt="Contact Us"
                className="h-32 w-32 object-contain transition-transform duration-500 ease-luxury group-hover:scale-[1.02] sm:h-40 sm:w-40"
                loading="lazy"
              />
              <p className="text-sm font-medium text-obsidian">Contact Us</p>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
