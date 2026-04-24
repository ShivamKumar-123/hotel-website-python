import { useEffect, useRef, useState } from 'react'

/**
 * Loads the image only after the wrapper enters the viewport (IntersectionObserver).
 * Falls back to native loading="lazy" behavior when observer unsupported.
 */
export default function LazyRoomImage({ src, alt, className, priority = false }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(priority)

  useEffect(() => {
    if (priority || inView) return undefined
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '120px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [priority, inView])

  return (
    <div ref={ref} className="relative h-full min-h-[10rem] w-full bg-porcelain/5">
      {inView ? (
        <img
          src={src}
          alt={alt}
          className={className}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'low'}
        />
      ) : (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-porcelain/10 to-porcelain/5" aria-hidden />
      )}
    </div>
  )
}
