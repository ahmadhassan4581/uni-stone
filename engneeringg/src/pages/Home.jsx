import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  useEffect(() => {
    refresh()
  }, [refresh])

  const featured = useMemo(() => {
    const copy = [...products]
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = copy[i]
      copy[i] = copy[j]
      copy[j] = tmp
    }
    return copy.slice(0, 16)
  }, [products])
  const heroSlides = useMemo(
    () => [
      {
        src: 'https://plus.unsplash.com/premium_photo-1663040562058-feb5f8470a24?auto=format&fit=crop&w=3200&q=90',
        alt: 'Construction site hero background',
        title: 'Sandstone',
        subtitle: 'Natural sandstone with strong finish for indoor & outdoor use.',
        ctaLabel: 'Shop Now',
        ctaTo: '/products',
      },
      {
        src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=3200&q=90',
        alt: 'Construction cranes and structure',
        title: 'Limestone',
        subtitle: 'Elegant limestone for a classic and premium look.',
        ctaLabel: 'Shop Now',
        ctaTo: '/products',
      },
      {
        src: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=3200&q=90',
        alt: 'Modern building facade detail',
        title: 'Porcelain',
        subtitle: 'Premium porcelain for stylish and durable flooring.',
        ctaLabel: 'Shop Now',
        ctaTo: '/products',
      },
      {
        src: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=3200&q=90',
        alt: 'Architectural planning and design',
        title: 'Artifacts',
        subtitle: 'Unique handcrafted artifacts to enhance your space.',
        ctaLabel: 'Shop Now',
        ctaTo: '/products',
      },
    ],
    [],
  )

  const [heroIndex, setHeroIndex] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)

  const heroNavigateTo = heroSlides[heroIndex]?.ctaTo || '/products'

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
      <section
        className="group relative isolate cursor-pointer overflow-hidden"
        role="link"
        tabIndex={0}
        aria-label="Hero"
        onClick={() => navigate(heroNavigateTo)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            navigate(heroNavigateTo)
          }
        }}
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-luxury"
            style={{ transform: `translateX(-${heroIndex * 100}%)` }}
          >
            {heroSlides.map((s, idx) => (
              <div key={s.src} className="relative h-full w-full shrink-0">
                <img
                  src={s.src}
                  alt={s.alt}
                  decoding="async"
                  fetchPriority={idx === heroIndex ? 'high' : 'auto'}
                  className="absolute inset-0 h-full w-full object-cover brightness-110 contrast-110 saturate-125"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-obsidian/10 transition-colors duration-500 ease-luxury group-hover:bg-white/30" />
                <div className="absolute inset-0 bg-[radial-gradient(closest-side_at_78%_45%,rgba(200,164,93,0.22),transparent_62%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/10 to-obsidian/70" />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prevHero()
            }}
            aria-label="Previous slide"
            className="pointer-events-auto absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md border border-gold/25 bg-obsidian/35 text-white/80 backdrop-blur transition-all duration-500 ease-luxury hover:border-gold/50 hover:bg-obsidian/55 hover:text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              nextHero()
            }}
            aria-label="Next slide"
            className="pointer-events-auto absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md border border-gold/25 bg-obsidian/35 text-white/80 backdrop-blur transition-all duration-500 ease-luxury hover:border-gold/50 hover:bg-obsidian/55 hover:text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <Container className="relative flex min-h-[420px] items-center justify-center py-16 sm:min-h-[520px] sm:py-24">
          <Reveal>
            <div className="w-full max-w-xl overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-luxury"
                style={{ transform: `translateX(-${heroIndex * 100}%)` }}
              >
                {heroSlides.map((s) => (
                  <div key={s.src} className="w-full shrink-0">
                    <div className="pointer-events-none w-full rounded-md border border-gold/15 bg-obsidian/35 p-8 text-center shadow-[0_0_0_1px_rgba(200,164,93,0.08)] backdrop-blur">
                      <p className="font-display text-3xl tracking-[0.02em] text-white sm:text-4xl">{s.title}</p>
                      <p className="mt-4 text-sm leading-7 text-white/70">{s.subtitle}</p>
                      <div
                        className="pointer-events-auto mt-7 flex justify-center"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <Button as={Link} to={s.ctaTo} size="md" className="min-w-40">
                          {s.ctaLabel}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>

        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center">
          <div
            className="flex items-center justify-center gap-2 rounded-full border border-gold/15 bg-obsidian/35 px-4 py-2 backdrop-blur"
            aria-label="Hero slide navigation"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {heroSlides.map((_, i) => {
              const active = i === heroIndex
              return (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setHeroIndex(i)
                  }}
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

      {/* <section className="bg-white">
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
                  <p className="text-2xl font-semibold text-[rgba(255,172,6)] drop-shadow sm:text-3xl"> Interiors</p>
                  <span className="inline-flex h-10 items-center justify-center rounded-sm bg-[#2552ad] px-6 text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-[#1f4591]">
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
                  <p className="text-2xl font-semibold text-[rgba(255,172,6)] drop-shadow sm:text-3xl">Finishes</p>
                  <span className="inline-flex h-10 items-center justify-center rounded-sm bg-[#2552ad] px-6 text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-[#1f4591]">
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
                  <p className="text-2xl font-semibold text-[rgba(255,172,6)] drop-shadow sm:text-3xl">Facade</p>
                  <span className="inline-flex h-10 items-center justify-center rounded-sm bg-[#2552ad] px-6 text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-[#1f4591]">
                    Shop Now
                  </span>
                </div>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section> */}

      <section className="bg-white">
        <Container className="py-16 sm:py-20">
          <Reveal>
            <div className="border-b border-black/10 pb-4">
              <h2 className="font-display text-3xl tracking-[0.02em] text-obsidian sm:text-4xl">All Products</h2>
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

          <div className="mt-10 flex justify-center">
            <Button as={Link} to="/products" size="md">
              All Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 sm:py-20">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12 md:items-start">
              <div className="md:col-span-12">
          
                <h2 className="mt-5 font-display text-3xl leading-[1.05] tracking-[0.03em] text-obsidian sm:text-4xl">
                  What We Do :  Premium Paving, Tailored to You
                </h2>
                <div className="mt-6 space-y-5 text-sm leading-7 text-obsidian/70 sm:text-[0.95rem]">
                  <p>
                    At Unistone Paving, we bridge the gap between the world’s finest quarries and your doorstep. We
                     specialize in an extensive range of high-performance materials, including Sandstone, Limestone, 
                     Porcelain, Slate, and Granite. Whether you are a Landscape Architect seeking a specific aesthetic,
                      a Developer managing a large-scale project, or a Homeowner crafting a private retreat, we provide the
                       ultimate combination of unbeatable pricing and uncompromising quality. While we maintain a curated selection
                        of popular items in the UK for rapid delivery, our full potential is found in our comprehensive digital catalogue. If you can dream it, we can source it, bringing the vast mineral wealth of our Indian operations directly to the British market.
                  </p>
                  <h3 className="mt-5 font-display text-2xl leading-[1.05] tracking-[0.03em] text-obsidian sm:text-2xl">Bespoke Craftsmanship & Specialist Solutions</h3>
                  <p>
                   What truly sets us apart is our ability to move beyond "off-the-shelf" limitations. Because we control the production process from the mine upward, we offer full customization on every material we provide. We can precision-cut stone to your exact thickness and dimensions, creating bespoke Paving Slabs, Setts, Cobbles, Steps, Walling, and Edging. For luxury applications like pool side edging, we can shape stone with a sophisticated honed edge for a smooth, premium finish. We offer a diverse array of textures, including Natural Cleft, Shotblast, Flamed, Polished, and Tumbled/Antique surfaces.
                  </p>
                  <p>
                    Project Pricing: We are built to handle projects of all sizes. Big bulk orders are quoted separately, allowing us to provide significantly discounted rates for large-scale developments.
                  </p>
                  <p>
                   For any inquiries or to request a bespoke quote, please send your requirements to inquiry@unistone.co.uk.
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
                  <Button as={Link} to="/consultation" size="lg" variant="light">
                    Request a Call
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
              to="/info/faqs"
              className="group flex flex-col items-center justify-center gap-4 text-center"
              aria-label="FAQs"
            >
              <img
                src={sampleIcon}
                alt="FAQs"
                className="h-32 w-32 object-contain transition-transform duration-500 ease-luxury group-hover:scale-[1.02] sm:h-40 sm:w-40"
                loading="lazy"
              />
              <p className="text-sm font-medium text-obsidian">FAQs</p>
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
