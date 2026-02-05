import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

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

        <div className="mt-12 space-y-6 text-sm leading-7 text-[#111111]">
          <Reveal>
            <p>
              At Unistone Paving, we believe that every great outdoor space begins with a story etched in stone. While we are a fresh face in the UK market, our journey actually began over two decades ago in the rugged, mineral-rich terrains of India.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <p>
              For twenty years, our family has lived and breathed natural stone, working directly at the source to master the art of quarrying and selection.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <p>
              The spark to bring Unistone to the UK came during a family visit a few years ago. We fell in love with the classic British garden, a place of sanctuary and gathering, but we noticed a gap.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <p>
              High-quality, ethically sourced Indian Sandstone was often hidden behind layers of middlemen, driving prices up and quality down. We realized that by bringing our decades of expertise and our direct mine-to-door connections to the UK, we could offer homeowners and landscapers something truly rare: premium quality without the premium markup.
            </p>
          </Reveal>

          <Reveal delay={210}>
            <h3 className="pt-2 text-base font-semibold tracking-wide text-[#111111]">The Unistone Advantage</h3>
          </Reveal>

          <Reveal delay={240}>
            <p>
              We operate differently because we know the stone better than anyone else. By importing directly from our partner mines in India, we cut out the overhead of traditional UK stockyards. This lean, efficient approach is exactly why we can offer a Price Guarantee: you are getting world-class materials straight from the source.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <p>
              Even as a new name in the UK, we’ve hit the ground running, fueled by the reputation for excellence we’ve spent twenty years building abroad. We don’t just sell paving; we provide expert knowledge and professional advice rooted in two generations of industry experience.
            </p>
          </Reveal>

          <Reveal delay={330}>
            <h3 className="pt-2 text-base font-semibold tracking-wide text-[#111111]">Quality You Can Trust</h3>
          </Reveal>

          <Reveal delay={360}>
            <p>
              Whether you are looking for the timeless charm of traditional riven sandstone or the sleek lines of a contemporary patio, our range covers every style and finish. Because we oversee the process from the moment the stone leaves the earth in India to the moment it reaches your project site, we ensure that every slab meets our rigorous standards for durability and aesthetics.
            </p>
          </Reveal>

          <Reveal delay={420}>
            <p>
              If you’re planning a project and need help with quantities or dimensions, our team is ready to assist. Send over your plans in metres or centimetres, and we’ll help you calculate exactly what you need to transform your space.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
