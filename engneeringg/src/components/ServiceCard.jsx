import Card from './Card'

export default function ServiceCard({ icon: Icon, title, description }) {
  return (
    <Card className="p-8">
      <div className="flex items-start justify-between gap-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-black/10 bg-neutral-50">
          <Icon className="h-5 w-5 text-gold/90" />
        </div>
        <div className="h-10 w-px bg-gold/15" />
      </div>
      <h3 className="mt-6 font-display text-2xl tracking-[0.02em] text-obsidian">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-obsidian/70">{description}</p>
      <div className="mt-6 h-px w-12 bg-gold/40 transition-all duration-700 ease-luxury group-hover:w-20" />
    </Card>
  )
}
