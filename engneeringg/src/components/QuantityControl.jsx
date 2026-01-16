import { Minus, Plus } from 'lucide-react'
import { cn } from '../lib/cn'

export default function QuantityControl({ value, onChange, className, min = 1, max = 99, tone = 'dark', size = 'md' }) {
  const v = Number(value) || min
  const rootClass =
    tone === 'light'
      ? 'border-black/10 bg-white text-obsidian/85'
      : 'border-gold/20 bg-obsidian/55 text-white/85'
  const buttonClass =
    tone === 'light'
      ? 'border-black/10 hover:bg-neutral-100'
      : 'border-gold/15 hover:bg-gold/10'

  const rootSizeClass = size === 'sm' ? 'h-8' : 'h-11'
  const buttonSizeClass = size === 'sm' ? 'w-8' : 'w-11'
  const valueSizeClass = size === 'sm' ? 'min-w-8 px-2 text-xs' : 'min-w-10 px-3 text-sm'

  const dec = () => onChange(Math.max(min, v - 1))
  const inc = () => onChange(Math.min(max, v + 1))

  return (
    <div
      className={cn(
        'inline-flex items-center overflow-hidden rounded-md border',
        rootSizeClass,
        rootClass,
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease"
        onClick={dec}
        className={cn(
          'inline-flex h-full items-center justify-center border-r transition-colors duration-500 ease-luxury',
          buttonSizeClass,
          buttonClass,
        )}
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className={cn('text-center tabular-nums', valueSizeClass)}>{v}</div>
      <button
        type="button"
        aria-label="Increase"
        onClick={inc}
        className={cn(
          'inline-flex h-full items-center justify-center border-l transition-colors duration-500 ease-luxury',
          buttonSizeClass,
          buttonClass,
        )}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
