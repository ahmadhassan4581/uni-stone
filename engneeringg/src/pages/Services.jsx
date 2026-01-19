import { Building2, ClipboardCheck, DraftingCompass, HardHat } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

const SERVICES = [
  {
    key: 'construction',
    title: 'Construction',
    icon: HardHat,
    subtitle: 'End-to-End Stone Execution',
    description:
      'We deliver complete stone construction solutions for residential, commercial, and large-scale projects. From sourcing premium materials to flawless installation, every stage is managed with strict quality control and execution discipline.',
    includes: [
      'Premium marble & stone installation',
      'Residential & commercial execution',
      'Structural and finish quality assurance',
    ],
  },
  {
    key: 'design',
    title: 'Design',
    icon: DraftingCompass,
    subtitle: 'Material-Led Design Coordination',
    description:
      'Our design support focuses on clarity, proportion, and material integrity. We work closely with architects and designers to ensure stone selections enhance both aesthetics and functionality.',
    includes: [
      'Stone selection & finish guidance',
      'Architectural detailing support',
      'Build-ready material specifications',
    ],
  },
  {
    key: 'supervision',
    title: 'Supervision',
    icon: ClipboardCheck,
    subtitle: 'On-Site Leadership & Control',
    description:
      'We provide hands-on site supervision to ensure timelines, workmanship, and material handling meet project standards. Clear reporting and disciplined oversight keep all stakeholders aligned.',
    includes: ['Site coordination & progress monitoring', 'Quality inspections', 'Contractor & vendor alignment'],
  },
  {
    key: 'consultancy',
    title: 'Consultancy',
    icon: Building2,
    subtitle: 'Strategic Stone Advisory',
    description:
      'Our consultancy service helps clients make informed decisions at every stage. From feasibility analysis to BOQ guidance, we provide transparent, expert advice aligned with project goals.',
    includes: [
      'Feasibility & material suitability analysis',
      'BOQ & quantity guidance',
      'Cost-value optimization',
      'Compliance & best-practice advisory',
    ],
  },
]

export default function Services() {
  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="SERVICES"
            eyebrowClassName="text-gold-bright"
            title="Our Core Services"
            subtitle="Precision-driven stone solutions designed for architectural excellence and long-term performance."
            tone="light"
          />
        </Reveal>

        <div className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {SERVICES.map((s, idx) => {
            const Icon = s.icon
            return (
              <Reveal key={s.key} delay={idx * 90} className="h-full">
                <div className="flex h-full flex-col rounded-xl bg-neutral-50 p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Icon className="h-5 w-5 text-gold/90" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs tracking-[0.35em] uppercase text-gold/80">{s.title}</p>
                      <h3 className="mt-3 font-display text-2xl tracking-[0.02em] text-obsidian">{s.subtitle}</h3>
                      <p className="mt-3 text-sm leading-7 text-obsidian/70">{s.description}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold text-obsidian">Includes:</p>
                    <ul className="mt-3 list-disc pl-5 text-sm leading-7 text-obsidian/70">
                      {s.includes.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={250}>
          <div className="mt-14 rounded-xl bg-neutral-50 p-9 shadow-sm">
            <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Why UniStone</p>
            <ul className="mt-6 list-disc pl-5 text-sm leading-7 text-obsidian/70">
              <li>Material-first, project-driven approach</li>
              <li>Deep expertise in natural stone applications</li>
              <li>Transparent guidance with no hidden agendas</li>
              <li>Trusted by architects, builders, and developers</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={330}>
          <div className="mt-12 rounded-xl bg-white p-9 shadow-sm">
            <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Call to action</p>
            <h2 className="mt-5 font-display text-3xl leading-[1.05] tracking-[0.03em] text-obsidian">Book a Free Stone Consultation</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-obsidian/70">
              Get expert guidance on selecting the right stone for your project.
            </p>
            <div className="mt-7">
              <Button as={Link} to="/payment" size="lg" variant="blue" className="tracking-normal normal-case">
                Book Consultation
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
