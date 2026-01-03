import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
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

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, idx) => (
              <Reveal key={p.id || p.name} delay={idx * 80}>
                <article className="group">
                  <Link
                    to={`/products/${p.slug}`}
                    aria-label={p.name}
                    className="relative block aspect-[4/3] overflow-hidden rounded-md border border-black/10 bg-neutral-50 p-0 text-left"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-6 transition-transform duration-700 ease-luxury group-hover:scale-[1.03]"
                    />
                  </Link>

                  <div className="mt-4 border-t border-black/10 pt-4">
                    <h3 className="text-sm font-medium leading-6 text-obsidian/90">{p.name}</h3>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-gold">${p.price}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 sm:py-20">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12 md:items-start">
              <div className="md:col-span-7">
                <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Engineering</p>
                <h2 className="mt-5 font-display text-3xl leading-[1.05] tracking-[0.03em] text-obsidian sm:text-4xl">
                  Civil Engineering &amp; Construction
                </h2>
                <div className="mt-6 space-y-5 text-sm leading-7 text-obsidian/70 sm:text-[0.95rem]">
                  <p>
                    We deliver civil engineering and construction services with a focus on safety, quality, and predictable
                    project control. From early planning and estimation to site execution and handover, our team supports each
                    phase with disciplined coordination.
                  </p>
                  <p>
                    Our scope includes structural works, foundations, concrete, and site supervision—built around clear
                    reporting, transparent timelines, and materials-led detailing. Whether you’re preparing a residential build
                    or coordinating a commercial site, we align consultants and contractors to keep delivery calm and on track.
                  </p>
                </div>
              </div>

              <div className="md:col-span-5 md:flex md:justify-end">
                <div className="w-full rounded-xl border border-black/10 bg-white p-8 shadow-sm">
                  <p className="text-sm leading-7 text-obsidian/70">
                    If you’re exploring services or want to review our packages, you can browse the{' '}
                    <Link className="text-gold/90 transition-colors hover:text-gold-2" to="/products">
                      catalog
                    </Link>{' '}
                    or reach out through our{' '}
                    <Link className="text-gold/90 transition-colors hover:text-gold-2" to="/contact">
                      contact page
                    </Link>
                    .
                  </p>
                  <div className="mt-7 grid gap-3">
                    <Button as={Link} to="/products" size="md" variant="blue">
                      Browse Catalog
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button as={Link} to="/contact" size="md" variant="light">
                      Contact Us
                    </Button>
                  </div>
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
    </>
  )
}
