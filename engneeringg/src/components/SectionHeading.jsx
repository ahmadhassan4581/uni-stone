import { cn } from '../lib/cn'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left', tone = 'dark', className }) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  const titleClass = tone === 'light' ? 'text-obsidian' : 'text-white'
  const subtitleClass = tone === 'light' ? 'text-obsidian/70' : 'text-white/70'

  return (
    <div className={cn('flex flex-col gap-4', alignClass, className)}>
      {eyebrow ? (
        <p className="text-xs tracking-[0.35em] uppercase text-gold/80">{eyebrow}</p>
      ) : null}
      <h2 className={cn('font-display text-3xl leading-[1.05] tracking-[0.02em] sm:text-4xl', titleClass)}>
        {title}
      </h2>
      {subtitle ? (
        <p className={cn('max-w-2xl text-sm leading-7 sm:text-[0.95rem]', subtitleClass)}>{subtitle}</p>
      ) : null}
    </div>
  )
}
