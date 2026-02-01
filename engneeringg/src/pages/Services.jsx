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
            eyebrow=""
            title="Our core services"
            subtitle="Four focused services to take your stone project from concept to completion."
            tone="light"
          />
        </Reveal>

        <div className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2">
          {SERVICES.map((s, idx) => {
            const Icon = s.icon
            return (
              <Reveal key={s.key} delay={idx * 90} className="h-full">
                <div className="group flex h-full flex-col rounded-2xl bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-50 ring-1 ring-black/10 transition group-hover:ring-black/20">
                      <Icon className="h-5 w-5 text-gold" />
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
          <div className="mt-14 overflow-hidden rounded-md border border-black/10 bg-white">
            <div className="p-9">
    
              <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-2xl tracking-[0.02em] text-obsidian">Book a Free Stone Consultation</h3>
                <Button as={Link} to="/consultation" variant="blue" size="lg">
                  Book Consultation
                </Button>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-obsidian/70">
                Get expert guidance on selecting the right stone for your project.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
