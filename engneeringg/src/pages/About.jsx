import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import yard1 from '../assets/yard1.jpg'
import yard2 from '../assets/yard2.jpg'
import yard3 from '../assets/yard3.jpg'

export default function About() {
  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="About Us"
            title="Natural Stone & Porcelain Specialists"
            subtitle="Serving East Sussex and beyond from our Plumpton Green showroom."
            tone="light"
            className="[&_h2]:!text-[#111111] [&_p]:!text-[#111111]"
          />
        </Reveal>

        <div className="mt-12 space-y-14">
          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            {/* IMAGES — LEFT (NO BORDERS) */}
            <Reveal className="md:col-span-5">
              <img src={yard1} alt="Stone yard" className="h-72 w-full rounded-xl object-cover" />
            </Reveal>

            {/* TEXT — RIGHT (SIMPLE) */}
            <Reveal delay={120} className="md:col-span-7">
              <div className="space-y-6 text-sm leading-7 text-[#111111]">
                <p>
                  We are based in the beautiful scenic East Sussex countryside, just a 20-minute drive from Brighton. You are always welcome to visit and view our huge range of Natural Stone and Porcelain slabs and tiles. The extensive choice of materials we stock, combined with our unbeatable prices, truly sets us apart.
                </p>

                <p>
                  All of our products are displayed within our premises to give the best possible representation. We are also happy to escort customers to our nearby storage units, just a stone’s throw from the showroom, where you can view tiles and slabs directly from our latest batches.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            <Reveal className="md:col-span-7">
              <div className="space-y-6 text-sm leading-7 text-[#111111]">
                <p>
                  Our premises in Plumpton Green is where it all began a few decades ago, and we are proud to continue operating in this beautiful and scenic part of the country.
                </p>

                <p>
                  Whilst we have grown significantly over the years and expanded across multiple units on the estate, we still follow the same principles that shaped us into the successful family business we are today.
                </p>

                <p>
                  As a small business, we go the extra yard to stay ahead. We offer expert knowledge, professional advice, and customer service built on reputation. We know we cannot rest on our laurels, and we give everything to compete with the “big boys” — and that is exactly what we do.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120} className="md:col-span-5">
              <img src={yard2} alt="Stone display" className="h-72 w-full rounded-xl object-cover" />
            </Reveal>
          </div>

          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            <Reveal className="md:col-span-5">
              <img src={yard3} alt="Stone slabs" className="h-72 w-full rounded-xl object-cover" />
            </Reveal>

            <Reveal delay={120} className="md:col-span-7">
              <div className="space-y-6 text-sm leading-7 text-[#111111]">
                <p>
                  Our large display boards showcase materials across traditional and contemporary styles, all sizes, finishes, and formats, for both internal and external projects. If you can’t find what you’re looking for with us, we’d wager you won’t find it anywhere else.
                </p>

                <p>
                  If you need help calculating quantities for tiling or paving, simply bring in your plans or send us your dimensions by phone or email. Measurements in metres or centimetres help speed things up, but we’re happy to assist regardless.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
