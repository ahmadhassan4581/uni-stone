import { Minus, Plus } from 'lucide-react'
import { cn } from '../lib/cn'

export default function QuantityControl({ value, onChange, className, min = 1, max = 99, tone = 'dark' }) {
  const v = Number(value) || min
  const rootClass =
    tone === 'light'
      ? 'border-black/10 bg-white text-obsidian/85'
      : 'border-gold/20 bg-obsidian/55 text-white/85'
  const buttonClass =
    tone === 'light'
      ? 'border-black/10 hover:bg-neutral-100'
      : 'border-gold/15 hover:bg-gold/10'

  const dec = () => onChange(Math.max(min, v - 1))
  const inc = () => onChange(Math.min(max, v + 1))

  return (
    <div
      className={cn(
        'inline-flex h-11 items-center overflow-hidden rounded-md border',
        rootClass,
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease"
        onClick={dec}
        className={cn(
          'inline-flex h-full w-11 items-center justify-center border-r transition-colors duration-500 ease-luxury',
          buttonClass,
        )}
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="min-w-10 px-3 text-center text-sm tabular-nums">{v}</div>
      <button
        type="button"
        aria-label="Increase"
        onClick={inc}
        className={cn(
          'inline-flex h-full w-11 items-center justify-center border-l transition-colors duration-500 ease-luxury',
          buttonClass,
        )}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
