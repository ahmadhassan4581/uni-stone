import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Container from '../components/Container'

const TITLES = {
  delivery: 'Delivery',
  samples: 'Samples',
  faqs: "FAQ's",
  returns: 'Returns & Refunds',
  terms: 'Terms',
  privacy: 'Privacy',
  sitemap: 'Sitemap',
}

export default function InfoPage() {
  const { slug } = useParams()

  const title = useMemo(() => {
    if (!slug) return 'Information'
    return TITLES[slug] || 'Information'
  }, [slug])

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Information</p>
        <h1 className="mt-6 font-display text-4xl tracking-[0.03em] text-obsidian sm:text-5xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-obsidian/70">
          This is a placeholder page for frontend styling parity. Connect it to your backend/CMS later.
        </p>
      </Container>
    </section>
  )
}
