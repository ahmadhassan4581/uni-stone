import { cn } from '../lib/cn'
import { useInView } from '../lib/useInView'

export default function Reveal({ className, children, delay = 0 }) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transform-gpu transition-all duration-1000 ease-luxury',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
