import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

export default function About() {
  return (
    <>
      <section className="bg-white">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="About"
              title="A civil engineering firm built for luxury execution"
              subtitle="We combine site discipline, design coordination, and premium material expertise to deliver calm, high-end outcomes."
              tone="light"
              className="[&_h2]:!text-[#111111] [&_p]:!text-[#111111]"
            />
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-center">
            <Reveal className="md:col-span-6">
              <div className="space-y-8">
                <div className="rounded-xl border border-[#1a1a1a] bg-white p-8 shadow-sm">
                  <p className="text-xs tracking-[0.35em] uppercase text-[#111111]">Experience</p>
                  <p className="mt-4 text-sm leading-7 text-[#111111]">
                    Our teams have delivered premium villas, commercial spaces, and infrastructure scopes through a consistent
                    standard: tight sequencing, clean detailing, and communication that respects your time.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#1a1a1a] bg-neutral-50 p-7">
                    <p className="text-xs tracking-[0.35em] uppercase text-[#111111]">Vision</p>
                    <p className="mt-4 text-sm leading-7 text-[#111111]">
                      Calm delivery for modern luxury builds.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#1a1a1a] bg-neutral-50 p-7">
                    <p className="text-xs tracking-[0.35em] uppercase text-[#111111]">Mission</p>
                    <p className="mt-4 text-sm leading-7 text-[#111111]">
                      Convert design intent into precise, durable structures.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={140} className="md:col-span-6">
              <div className="relative overflow-hidden rounded-xl border border-[#1a1a1a] bg-white shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1536895058696-a69b1c7ba34f?auto=format&fit=crop&w=1800&q=70"
                  alt="Architectural plans"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <p className="text-xs tracking-[0.35em] uppercase text-[#111111]">Our promise</p>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-[#111111]">
                    Strong coordination. Disciplined supervision. Luxury finishing.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-3">
              <div className="rounded-xl border border-[#1a1a1a] bg-neutral-50 p-8">
                <p className="text-xs tracking-[0.35em] uppercase text-[#111111]">Principle 01</p>
                <h3 className="mt-5 font-display text-2xl text-[#111111]">Clarity</h3>
                <p className="mt-3 text-sm leading-7 text-[#111111]">Transparent scope definition and reporting cadence.</p>
              </div>
              <div className="rounded-xl border border-[#1a1a1a] bg-neutral-50 p-8">
                <p className="text-xs tracking-[0.35em] uppercase text-[#111111]">Principle 02</p>
                <h3 className="mt-5 font-display text-2xl text-[#111111]">Control</h3>
                <p className="mt-3 text-sm leading-7 text-[#111111]">Schedule discipline and risk mitigation built in.</p>
              </div>
              <div className="rounded-xl border border-[#1a1a1a] bg-neutral-50 p-8">
                <p className="text-xs tracking-[0.35em] uppercase text-[#111111]">Principle 03</p>
                <h3 className="mt-5 font-display text-2xl text-[#111111]">Craft</h3>
                <p className="mt-3 text-sm leading-7 text-[#111111]">Details that respect material, light, and proportion.</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
