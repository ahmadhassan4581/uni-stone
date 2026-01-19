import { cn } from '../lib/cn'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

function money(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'GBP' }).format(Number(n || 0))
}

function vatInclusivePrice(price, vatRate) {
  const base = Number(price)
  const rate = Number(vatRate)
  if (!Number.isFinite(base)) return 0
  if (!Number.isFinite(rate) || rate <= 0) return base
  return base * (1 + rate / 100)
}

function normalizeRating(raw) {
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(n)) return null
  return Math.max(0, Math.min(5, n))
}

export default function ProductCard({ product, className, actions, tone = 'dark', onImageClick }) {
  const shellClass =
    tone === 'light'
      ? 'bg-white'
      : 'bg-charcoal/50 shadow-[0_0_0_1px_rgba(200,164,93,0.08)]'
  const mediaBgClass = tone === 'light' ? 'bg-neutral-50' : 'bg-obsidian/30'
  const dividerClass = tone === 'light' ? 'bg-black/10' : 'bg-gold/15'
  const bodyClass = tone === 'light' ? 'bg-white' : 'bg-obsidian/30'
  const titleClass = tone === 'light' ? 'text-obsidian' : 'text-white'
  const descClass = tone === 'light' ? 'text-obsidian/70' : 'text-white/70'
  const actionsClass = tone === 'light' ? 'bg-white' : 'bg-obsidian/40'
  const priceClass = tone === 'light' ? 'text-obsidian' : 'text-white'
  const rating = normalizeRating(product?.rating)
  const filledCount = rating === null ? 0 : Math.round(rating)
  const defaultVatRate = 20
  const vatRate = Number.isFinite(Number(product?.vatRate)) ? Number(product.vatRate) : defaultVatRate
  const incVat = vatInclusivePrice(product?.price, vatRate)
  const reviewCount = Number.isFinite(Number(product?.reviewCount))
    ? Number(product.reviewCount)
    : Number.isFinite(Number(product?.reviewsCount))
      ? Number(product.reviewsCount)
      : Number.isFinite(Number(product?.numReviews))
        ? Number(product.numReviews)
        : null
  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-md transition-colors duration-300',
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

      <div className={cn('h-px w-full', dividerClass)} />

      <div className={cn('p-4', bodyClass)}>
        <h3
          className={cn(
            'text-sm font-semibold leading-snug',
            'min-h-[2.6rem] overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]',
            titleClass,
          )}
        >
          <Link to={`/products/${product.slug}`} className="transition-colors hover:text-blue-700">
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className={cn('text-sm font-semibold', priceClass)}>{money(product.price)}</p>
          <p className={cn('text-xs', tone === 'light' ? 'text-obsidian/55' : 'text-white/55')}>
            <span className="font-semibold">{money(incVat)}</span>
            <span className="ml-1">(incl. VAT)</span>
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-0.5" aria-label={`${filledCount} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i + 1 <= filledCount
              return (
                <Star
                  key={i}
                  className={cn(
                    'h-3.5 w-3.5',
                    filled ? 'fill-blue-600 text-blue-600' : tone === 'light' ? 'text-black/20' : 'text-white/20',
                  )}
                />
              )
            })}
          </div>
          {reviewCount !== null ? (
            <span className={cn('text-xs', tone === 'light' ? 'text-obsidian/55' : 'text-white/55')}>
              ({reviewCount})
            </span>
          ) : null}
        </div>
      </div>

      {actions ? (
        <div className={cn('flex items-center justify-between gap-4 p-5', actionsClass)}>
          {actions}
        </div>
      ) : null}
    </article>
  )
}
