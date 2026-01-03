import { cn } from '../lib/cn'

export default function Card({ className, children }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-black/10 bg-white p-7 shadow-sm transition-all duration-700 ease-luxury hover:border-black/20 hover:bg-neutral-50',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-luxury group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>
      {children}
    </div>
  )
}
