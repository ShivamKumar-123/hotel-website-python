import { useEffect, useState } from 'react'

/**
 * Default hero rotation (My stays & fallbacks) — full property story.
 */
export const HOTEL_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=2200&q=88',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=2200&q=88',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=2200&q=88',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=2200&q=88',
  'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=2200&q=88',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=2200&q=88',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2200&q=88',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=2200&q=88',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2200&q=88',
]

/** Reserve flow — arrival, suites, tower, pool (distinct from Contact set). */
export const RESERVE_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=2200&q=88',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=2200&q=88',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=2200&q=88',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2200&q=88',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=2200&q=88',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=2200&q=88',
  'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=2200&q=88',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=2200&q=88',
]

/** Contact / concierge — dining, spa, terrace, editorial hospitality (distinct from Reserve). */
export const CONTACT_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=2200&q=88',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2200&q=88',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=2200&q=88',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=2200&q=88',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=2200&q=88',
  'https://images.unsplash.com/photo-1445016088278-05aaa7eb2237?w=2200&q=88',
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=2200&q=88',
  'https://images.unsplash.com/photo-1551882547-ff40c20fe457?w=2200&q=88',
]

/** @deprecated use HOTEL_HERO_IMAGES[0] */
export const BOOKING_HERO_IMAGE = HOTEL_HERO_IMAGES[0]

/**
 * Full-bleed hero: cycles hotel images with a slow crossfade; optional single `imageUrl` override.
 */
export default function BookingExperienceShell({
  children,
  imageUrl,
  images = HOTEL_HERO_IMAGES,
  /** Inner content max width — use wide grid layouts (e.g. My stays). */
  contentMaxClass = 'max-w-3xl',
}) {
  const slides = imageUrl ? [imageUrl] : (images?.length ? images : HOTEL_HERO_IMAGES)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return undefined
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % slides.length)
    }, 10000)
    return () => window.clearInterval(id)
  }, [slides.length])

  return (
    <div className="booking-hero-root relative left-1/2 -mt-2 mb-6 w-screen max-w-none -translate-x-1/2 overflow-hidden rounded-b-[2rem] px-4 pb-20 pt-6 md:-mt-1 md:mb-10 md:rounded-b-[2.5rem] md:px-8 md:pb-28 md:pt-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 overflow-hidden">
          {slides.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={`absolute inset-0 h-[115%] min-h-full w-full -translate-y-[5%] object-cover transition-opacity duration-[2200ms] ease-in-out ${
                i === slide ? 'z-[1] opacity-100' : 'z-0 opacity-0'
              } ${slides.length === 1 ? 'booking-hero-drift' : ''}`}
            />
          ))}
        </div>
        <div className="booking-hero-scrim absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(201,169,98,0.22),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.05)_50%,transparent_60%)] bg-[length:200%_100%] booking-hero-shimmer" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay booking-hero-noise" aria-hidden />
      <div className={['relative z-10 mx-auto w-full min-w-0', contentMaxClass].filter(Boolean).join(' ')}>
        {children}
      </div>
    </div>
  )
}
