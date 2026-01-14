import { cn } from '../lib/cn'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

function money(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(n || 0))
}

function ratingFromProduct(product) {
  if (typeof product?.rating === 'number') return product.rating

  const seed = String(product?.id || product?.slug || product?.name || '')
  if (!seed) return 0
  const sum = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return sum % 3 === 0 ? 0 : 5
}

export default function ProductCard({ product, className, actions, tone = 'dark', onImageClick }) {
  const shellClass =
    tone === 'light'
      ? 'border-black/15 bg-white hover:border-black/25'
      : 'border-gold/15 bg-charcoal/50 shadow-[0_0_0_1px_rgba(200,164,93,0.08)] hover:border-gold/35'
  const mediaBgClass = tone === 'light' ? 'bg-neutral-50' : 'bg-obsidian/30'
  const bodyClass = tone === 'light' ? 'border-black/10 bg-white' : 'border-gold/15 bg-obsidian/30'
  const titleClass = tone === 'light' ? 'text-obsidian' : 'text-white'
  const descClass = tone === 'light' ? 'text-obsidian/70' : 'text-white/70'
  const actionsClass = tone === 'light' ? 'border-black/10 bg-white' : 'border-gold/15 bg-obsidian/40'
  const priceClass = tone === 'light' ? 'text-obsidian' : 'text-white'
  const rating = ratingFromProduct(product)
  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-md border transition-colors duration-300',
        shellClass,
        className,
      )}
    >
      {onImageClick ? (
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => onImageClick(product)}
          className="block w-full p-0 text-left"
        >
          <div className={cn('relative aspect-square overflow-hidden', mediaBgClass)}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </button>
      ) : (
        <Link to={`/products/${product.slug}`} aria-label={product.name} className="block">
          <div className={cn('relative aspect-square overflow-hidden', mediaBgClass)}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      )}

      <div className={cn('border-t p-4', bodyClass)}>
        <h3 className={cn('text-sm font-semibold leading-snug', titleClass)}>
          <Link to={`/products/${product.slug}`} className="transition-colors hover:text-blue-700">
            {product.name}
          </Link>
        </h3>

        <p className={cn('mt-2 line-clamp-1 text-xs text-obsidian/60', descClass)}>{product.description}</p>

        <div className="mt-3 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className={cn('text-sm font-semibold', priceClass)}>{money(product.price)}</p>
            <p className={cn('mt-0.5 text-[0.7rem]', tone === 'light' ? 'text-obsidian/50' : 'text-white/55')}>incl. VAT</p>
          </div>

          {rating ? (
            <div className="flex items-center gap-0.5" aria-label={`${rating} stars`}>
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i + 1 <= Math.round(rating)
                return (
                  <Star
                    key={i}
                    className={cn('h-3.5 w-3.5', filled ? 'fill-blue-600 text-blue-600' : 'text-black/20')}
                  />
                )
              })}
            </div>
          ) : null}
        </div>
      </div>

      {actions ? (
        <div className={cn('flex items-center justify-between gap-4 border-t p-5', actionsClass)}>
          {actions}
        </div>
      ) : null}
    </article>
  )
}
