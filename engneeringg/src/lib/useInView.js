import { useEffect, useMemo, useState, useRef } from 'react'

export function useInView({ rootMargin = '0px 0px -10% 0px', threshold = 0.12, once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  const options = useMemo(() => ({ rootMargin, threshold }), [rootMargin, threshold])

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (inView && once) return

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReducedMotion) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
          break
        }
      }
    }, options)

    observer.observe(node)
    return () => observer.disconnect()
  }, [inView, once, options])

  return { ref, inView }
}
