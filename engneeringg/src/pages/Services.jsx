import { Building2, ClipboardCheck, DraftingCompass, HardHat } from 'lucide-react'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import { services } from '../data/services'

const icons = {
  Construction: HardHat,
  Design: DraftingCompass,
  Supervision: ClipboardCheck,
  Consultancy: Building2,
}

export default function Services() {
  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="Four disciplined tracks"
            subtitle="Each service is designed to feel premium: calm motion, generous spacing, and clear hierarchy—ready for backend integration."
            tone="light"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, idx) => {
            const Icon = icons[s.title] || HardHat
            return (
              <Reveal key={s.title} delay={idx * 90}>
                <ServiceCard icon={Icon} title={s.title} description={s.description} />
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={250}>
          <div className="mt-14 rounded-xl border border-black/10 bg-white p-9 shadow-sm">
            <div className="grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7">
                <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Delivery model</p>
                <h2 className="mt-5 font-display text-3xl leading-[1.05] tracking-[0.03em] text-obsidian">A calm construction cadence</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-obsidian/70">
                  We use structured milestones, finish mock-ups, and site reporting to keep luxury projects predictable and
                  controlled.
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="grid gap-3 text-sm text-obsidian/70">
                  <p>Weekly executive updates</p>
                  <p>Consultant coordination</p>
                  <p>Quality assurance checkpoints</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
