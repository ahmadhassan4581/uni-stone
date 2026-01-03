import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'

export default function Breadcrumbs({ items, tone = 'dark', className }) {
  const baseText = tone === 'light' ? 'text-obsidian/60' : 'text-white/55'
  const hoverText = tone === 'light' ? 'hover:text-obsidian' : 'hover:text-white'
  const lastText = tone === 'light' ? 'text-obsidian/80' : 'text-white/75'
  const sepText = tone === 'light' ? 'text-obsidian/25' : 'text-white/25'
  return (
    <nav aria-label="Breadcrumb" className={cn('text-xs tracking-[0.28em] uppercase', className)}>
      <ol className={cn('flex flex-wrap items-center gap-x-3 gap-y-2', baseText)}>
        {items.map((it, idx) => {
          const last = idx === items.length - 1
          return (
            <li key={`${it.label}-${idx}`} className="flex items-center gap-3">
              {it.to && !last ? (
                <Link className={cn('transition-colors', hoverText)} to={it.to}>
                  {it.label}
                </Link>
              ) : (
                <span className={cn(last ? lastText : baseText)}>{it.label}</span>
              )}
              {!last ? <span className={sepText}>/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
