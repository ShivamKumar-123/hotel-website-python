import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { registerGsapPlugins } from '../animations/gsapRegister'
import { DEFAULT_HOME_GALLERY, mergeGalleryWithLayouts } from '../../constants/homeContentDefaults'

function useMinWidthMd() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const fn = () => setOk(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return ok
}

/**
 * Bento-style gallery for Home — scroll stagger (GSAP) + hover motion + lightbox.
 * @param {{ id?: string, src: string, caption?: string }[] | null | undefined} items — from API; empty uses defaults.
 */
export default function HomeImageGallery({ items: itemsProp } = {}) {
  const images = useMemo(() => mergeGalleryWithLayouts(itemsProp), [itemsProp])
  const useBentoLayout = images.length === 8

  const rootRef = useRef(null)
  const lightboxFigRef = useRef(null)
  const [active, setActive] = useState(null)
  const isMd = useMinWidthMd()

  const close = useCallback(() => setActive(null), [])
  const next = useCallback(() => {
    setActive((i) => (i === null ? null : (i + 1) % images.length))
  }, [images.length])
  const prev = useCallback(() => {
    setActive((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  }, [images.length])

  useLayoutEffect(() => {
    registerGsapPlugins()
    const root = rootRef.current
    if (!root) return undefined

    const els = root.querySelectorAll('[data-gallery-item]')
    gsap.set(els, {
      opacity: 0,
      y: 36,
      scale: 0.97,
    })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          gsap.to(els, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: { each: 0.055, from: 'start' },
            ease: 'power2.out',
          })
          io.disconnect()
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' },
    )

    io.observe(root)
    return () => io.disconnect()
  }, [images.length])

  useEffect(() => {
    if (active === null) return undefined
    const fig = lightboxFigRef.current
    if (fig) {
      gsap.fromTo(
        fig,
        { opacity: 0, scale: 0.92, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out' },
      )
    }
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [active, close, next, prev])

  const gridClass = useBentoLayout
    ? 'grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4'
    : 'grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4'

  return (
    <>
      <div ref={rootRef} className="mx-auto max-w-6xl px-0">
        <header data-gallery-item className="mb-8 text-center md:mb-10 md:text-left">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-500">Glimpses</p>
          <h2 className="mt-3 font-display text-3xl text-porcelain md:text-4xl">The house in still frames</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-porcelain-muted md:mx-0">
            Corridors, pools, and corners we polish like silver — tap any frame to open it wide.
          </p>
        </header>

        <div
          className={gridClass}
          data-scroll-stagger="0.06"
          style={{ gridAutoRows: useBentoLayout ? 'minmax(0, auto)' : undefined }}
        >
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              data-gallery-item
              onClick={() => setActive(index)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-porcelain/15 bg-ink text-left shadow-[0_20px_50px_rgba(0,0,0,0.2)] outline-none transition-[border-color,box-shadow] duration-500 focus-visible:border-gold-500/50 focus-visible:ring-2 focus-visible:ring-gold-500/30 md:rounded-3xl ${img.minH || 'min-h-[140px] md:min-h-[160px]'}`}
              style={isMd && useBentoLayout && img.area ? { gridArea: img.area } : undefined}
            >
              <img
                src={img.src}
                alt={img.caption}
                className="h-full w-full object-cover transition duration-[1.1s] ease-out group-hover:scale-110"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent opacity-90 transition duration-500 group-hover:via-slate-950/25" />
              <div className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/25 via-transparent to-gold-600/10" />
              </div>
              <span className="absolute bottom-3 left-3 right-3 font-display text-sm text-porcelain drop-shadow-md transition duration-300 group-hover:translate-y-[-2px] md:bottom-4 md:left-4 md:text-base">
                {img.caption}
              </span>
              <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/35 px-2 py-0.5 text-[10px] uppercase tracking-widest text-stone-200 opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100 md:right-4 md:top-4">
                View
              </span>
            </button>
          ))}
        </div>
      </div>

      {active !== null && images[active] && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/96 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image"
          onClick={close}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-widest text-porcelain transition hover:bg-white/20"
            onClick={close}
          >
            Close
          </button>
          <button
            type="button"
            className="absolute left-2 top-1/2 z-[1] -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-3 text-porcelain backdrop-blur-sm transition hover:bg-black/60 md:left-6"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 z-[1] -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-3 text-porcelain backdrop-blur-sm transition hover:bg-black/60 md:right-6"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
          >
            ›
          </button>
          <figure
            ref={lightboxFigRef}
            className="relative max-h-[min(88vh,900px)] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={active}
              src={String(images[active].src).replace(/w=\d+/, 'w=1920')}
              alt={images[active].caption}
              className="max-h-[min(88vh,900px)] w-auto max-w-full rounded-2xl object-contain shadow-2xl shadow-black/50 ring-1 ring-white/10"
            />
            <figcaption className="mt-4 text-center font-display text-lg text-porcelain">
              {images[active].caption}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
