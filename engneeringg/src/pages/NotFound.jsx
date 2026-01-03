import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'

export default function NotFound() {
  return (
    <section className="bg-white">
      <Container className="py-24">
        <p className="text-xs tracking-[0.35em] uppercase text-gold/80">404</p>
        <h1 className="mt-6 font-display text-5xl tracking-[0.03em] text-obsidian">Page not found</h1>
        <p className="mt-6 max-w-xl text-sm leading-7 text-obsidian/70">
          The page you’re looking for doesn’t exist. Use the navigation or return home.
        </p>
        <div className="mt-10">
          <Button as={Link} to="/" size="lg" variant="light">
            Return Home
          </Button>
        </div>
      </Container>
    </section>
  )
}
