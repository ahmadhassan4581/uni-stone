import { cn } from '../lib/cn'

export default function Button({
  as: Comp = 'button',
  variant = 'gold',
  size = 'md',
  className,
  ...props
}) {
  const base =
    'inline-flex transform-gpu items-center justify-center gap-2 rounded-md border text-sm tracking-[0.18em] uppercase transition-all duration-500 ease-luxury hover:-translate-y-0.5 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50'

  const variants = {
    gold: 'border-gold/60 bg-gold text-obsidian shadow-glow hover:shadow-glow-strong hover:bg-gold-2',
    ghost: 'border-gold/30 bg-transparent text-white hover:bg-gold/10 hover:border-gold/60',
    dark: 'border-white/10 bg-charcoal/70 text-white hover:border-gold/40 hover:bg-charcoal',
    light: 'border-black/10 bg-white text-obsidian hover:border-black/20 hover:bg-neutral-100 focus-visible:ring-black/20',
    blue: 'border-blue-600 bg-blue-600 text-white shadow-sm hover:border-blue-700 hover:bg-blue-700 focus-visible:ring-blue-500/60',
  }

  const sizes = {
    sm: 'h-10 px-4',
    md: 'h-12 px-6',
    lg: 'h-14 px-8 text-[0.95rem]',
  }

  return <Comp className={cn(base, variants[variant], sizes[size], className)} {...props} />
}
