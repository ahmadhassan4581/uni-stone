import { CreditCard, Landmark, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

export default function Payment() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('concept')

  const selectedPackage = useMemo(() => {
    const map = {
      concept: { id: 'concept', name: 'Concept Review', amount: 150 },
      site: { id: 'site', name: 'Site Walkthrough', amount: 350 },
      advisory: { id: 'advisory', name: 'Executive Advisory', amount: 650 },
    }
    return map[selected] || map.concept
  }, [selected])

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Consultation"
            title="Advance consultation fee"
            subtitle="UI only. Use this layout to integrate Stripe/Razorpay later. Designed to feel calm and premium with dark-black + gold accents."
            tone="light"
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Select a track</p>

              <div className="mt-6 grid gap-5">
                <label className="group flex cursor-pointer items-start justify-between gap-6 rounded-xl border border-black/10 bg-neutral-50 p-6 transition-all duration-700 ease-luxury hover:border-black/20">
                  <input
                    className="mt-1"
                    type="radio"
                    name="package"
                    checked={selected === 'concept'}
                    onChange={() => setSelected('concept')}
                  />
                  <div className="flex-1">
                    <p className="font-display text-xl tracking-[0.02em] text-obsidian">Concept Review</p>
                    <p className="mt-2 text-sm leading-7 text-obsidian/70">45-minute call + scope alignment + delivery roadmap.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs tracking-[0.32em] uppercase text-obsidian/60">Fee</p>
                    <p className="mt-2 font-display text-2xl text-gold">$150</p>
                  </div>
                </label>

                <label className="group flex cursor-pointer items-start justify-between gap-6 rounded-xl border border-black/10 bg-neutral-50 p-6 transition-all duration-700 ease-luxury hover:border-black/20">
                  <input
                    className="mt-1"
                    type="radio"
                    name="package"
                    checked={selected === 'site'}
                    onChange={() => setSelected('site')}
                  />
                  <div className="flex-1">
                    <p className="font-display text-xl tracking-[0.02em] text-obsidian">Site Walkthrough</p>
                    <p className="mt-2 text-sm leading-7 text-obsidian/70">On-site visit + measurements + feasibility notes.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs tracking-[0.32em] uppercase text-obsidian/60">Fee</p>
                    <p className="mt-2 font-display text-2xl text-gold">$350</p>
                  </div>
                </label>

                <label className="group flex cursor-pointer items-start justify-between gap-6 rounded-xl border border-black/10 bg-neutral-50 p-6 transition-all duration-700 ease-luxury hover:border-black/20">
                  <input
                    className="mt-1"
                    type="radio"
                    name="package"
                    checked={selected === 'advisory'}
                    onChange={() => setSelected('advisory')}
                  />
                  <div className="flex-1">
                    <p className="font-display text-xl tracking-[0.02em] text-obsidian">Executive Advisory</p>
                    <p className="mt-2 text-sm leading-7 text-obsidian/70">90-minute session + BOQ guidance + risk map.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs tracking-[0.32em] uppercase text-obsidian/60">Fee</p>
                    <p className="mt-2 font-display text-2xl text-gold">$650</p>
                  </div>
                </label>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-obsidian/55">Payment UI only — wire up provider later.</p>
                <Button
                  size="lg"
                  variant="blue"
                  type="button"
                  onClick={() => {
                    navigate('/checkout', {
                      state: {
                        kind: 'consultation',
                        packageId: selectedPackage.id,
                        packageName: selectedPackage.name,
                        amount: selectedPackage.amount,
                        currency: 'USD',
                      },
                    })
                  }}
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-5">
            <div className="grid gap-6">
              <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
                <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Payment methods</p>
                <div className="mt-6 grid gap-4">
                  <div className="flex items-center justify-between rounded-lg border border-black/10 bg-neutral-50 p-5">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gold/90" />
                      <p className="text-sm text-obsidian/80">Stripe (placeholder)</p>
                    </div>
                    <span className="text-xs tracking-[0.3em] uppercase text-obsidian/50">Card</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-black/10 bg-neutral-50 p-5">
                    <div className="flex items-center gap-3">
                      <Landmark className="h-5 w-5 text-gold/90" />
                      <p className="text-sm text-obsidian/80">Razorpay (placeholder)</p>
                    </div>
                    <span className="text-xs tracking-[0.3em] uppercase text-obsidian/50">UPI</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-black/10 bg-neutral-50">
                    <ShieldCheck className="h-5 w-5 text-gold/90" />
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Assurance</p>
                    <p className="mt-3 text-sm leading-7 text-obsidian/70">
                      Consultation fees are credited against your final contract when you proceed with delivery.
                    </p>
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
