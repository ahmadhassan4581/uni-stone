import { cn } from '../lib/cn'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, className, actions, tone = 'dark', onImageClick }) {
  const shellClass =
    tone === 'light'
      ? 'border-black/10 bg-white shadow-sm hover:border-black/20'
      : 'border-gold/15 bg-charcoal/50 shadow-[0_0_0_1px_rgba(200,164,93,0.08)] hover:border-gold/35'
  const mediaBgClass = tone === 'light' ? 'bg-neutral-50' : 'bg-obsidian/30'
  const bodyClass = tone === 'light' ? 'border-black/10 bg-white' : 'border-gold/15 bg-obsidian/30'
  const titleClass = tone === 'light' ? 'text-obsidian' : 'text-white'
  const descClass = tone === 'light' ? 'text-obsidian/70' : 'text-white/70'
  const actionsClass = tone === 'light' ? 'border-black/10 bg-white' : 'border-gold/15 bg-obsidian/40'
  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-xl border transition-all duration-700 ease-luxury',
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
          <div className={cn('relative aspect-[4/3] overflow-hidden', mediaBgClass)}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full scale-[1.02] object-cover transition-transform duration-1000 ease-luxury group-hover:scale-[1.10]"
            />
          </div>
        </button>
      ) : (
        <Link to={`/products/${product.slug}`} aria-label={product.name} className="block">
          <div className={cn('relative aspect-[4/3] overflow-hidden', mediaBgClass)}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full scale-[1.02] object-cover transition-transform duration-1000 ease-luxury group-hover:scale-[1.10]"
            />
          </div>
        </Link>
      )}

      <div className={cn('border-t p-5', bodyClass)}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.65rem] tracking-[0.32em] uppercase text-gold/80">{product.category}</p>
            <h3 className={cn('mt-2 font-display text-lg leading-tight tracking-[0.02em]', titleClass)}>
              <Link to={`/products/${product.slug}`} className="transition-colors hover:text-gold-2">
                {product.name}
              </Link>
            </h3>
          </div>
          <p className="shrink-0 font-display text-xl text-gold">${product.price}</p>
        </div>
        <p className={cn('mt-3 line-clamp-2 text-sm leading-7', descClass)}>{product.description}</p>
      </div>

      {actions ? (
        <div className={cn('flex items-center justify-between gap-4 border-t p-5', actionsClass)}>
          {actions}
        </div>
      ) : null}
    </article>
  )
}
