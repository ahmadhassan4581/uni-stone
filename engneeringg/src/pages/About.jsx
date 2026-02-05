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
            eyebrow="Our Story"
            title="From the Heart of India to the British Landscape"
            subtitle="Two decades of natural stone expertise, now delivered direct to the UK."
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
                  At Unistone Paving, we believe that every great outdoor space begins with a story etched in stone. While we are a fresh face in the UK market, our journey actually began over two decades ago in the rugged, mineral-rich terrains of India.
                </p>

                <p>
                  For twenty years, our family has lived and breathed natural stone, working directly at the source to master the art of quarrying and selection.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            <Reveal className="md:col-span-7">
              <div className="space-y-6 text-sm leading-7 text-[#111111]">
                <p>
                  The spark to bring Unistone to the UK came during a family visit a few years ago. We fell in love with the classic British garden, a place of sanctuary and gathering, but we noticed a gap.
                </p>

                <p>
                  High-quality, ethically sourced Indian Sandstone was often hidden behind layers of middlemen, driving prices up and quality down. We realized that by bringing our decades of expertise and our direct mine-to-door connections to the UK, we could offer homeowners and landscapers something truly rare: premium quality without the premium markup.
                </p>

                <p>
                  We operate differently because we know the stone better than anyone else. By importing directly from our partner mines in India, we cut out the overhead of traditional UK stockyards. This lean, efficient approach is exactly why we can offer a Price Guarantee: you are getting world-class materials straight from the source.
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
                  Even as a new name in the UK, we’ve hit the ground running, fueled by the reputation for excellence we’ve spent twenty years building abroad. We don’t just sell paving; we provide expert knowledge and professional advice rooted in two generations of industry experience.
                </p>

                <p>
                  Whether you are looking for the timeless charm of traditional riven sandstone or the sleek lines of a contemporary patio, our range covers every style and finish. Because we oversee the process from the moment the stone leaves the earth in India to the moment it reaches your project site, we ensure that every slab meets our rigorous standards for durability and aesthetics.
                </p>

                <p>
                  If you’re planning a project and need help with quantities or dimensions, our team is ready to assist. Send over your plans in metres or centimetres, and we’ll help you calculate exactly what you need to transform your space.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
