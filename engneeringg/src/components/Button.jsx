import { cn } from '../lib/cn'

export default function Button({
  as: Comp = 'button',
  variant = 'blue',
  size = 'md',
  className,
  ...props
}) {
  const base =
    'inline-flex transform-gpu items-center justify-center gap-2 rounded-md border text-sm tracking-[0.18em] uppercase transition-all duration-500 ease-luxury hover:-translate-y-0.5 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50'

  const allBlue = 'border-blue-600 bg-blue-600 text-white shadow-sm hover:border-blue-700 hover:bg-blue-700 focus-visible:ring-blue-500/60'

  const variants = {
    gold: allBlue,
    ghost: allBlue,
    dark: allBlue,
    light: allBlue,
    blue: allBlue,
    green: allBlue,
  }

  const sizes = {
    sm: 'h-10 px-4',
    md: 'h-12 px-6',
    lg: 'h-14 px-8 text-[0.95rem]',
  }

  return <Comp className={cn(base, variants[variant], sizes[size], className)} {...props} />
}
