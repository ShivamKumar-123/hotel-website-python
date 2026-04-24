import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { cn } from '../../utils/cn'

/**
 * Full-bleed hero carousel: imagery, layered copy, autoplay, dots, and prev/next.
 */
export default function HeroCarousel({ slides, className = '', autoMs = 7000 }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const n = slides.length
  const active = slides[index]

  const go = useCallback(
    (dir) => {
      setIndex((i) => (i + dir + n) % n)
    },
    [n],
  )

  useEffect(() => {
    if (n <= 1 || paused) return undefined
    const t = setInterval(() => setIndex((i) => (i + 1) % n), autoMs)
    return () => clearInterval(t)
  }, [n, paused, autoMs])

  if (!active) return null

  return (
    <section
      className={cn('relative min-h-[88vh] overflow-hidden bg-slate-950', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured hotel stories"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-[1.1s] ease-out',
            i === index ? 'z-[1] opacity-100' : 'z-0 opacity-0 pointer-events-none',
          )}
          aria-hidden={i !== index}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/45 to-slate-950/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-center px-4 pb-32 pt-20 text-center md:px-6 md:pb-36">
        <div key={active.id} className="animate-home-fade-up">
          <p className="text-xs uppercase tracking-[0.45em] text-gold-400">{active.kicker}</p>
          <h1 className="mt-5 font-display text-4xl leading-[1.1] text-porcelain md:text-6xl lg:text-7xl">
            {active.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-porcelain-muted md:text-lg">
            {active.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button as={Link} to={active.primaryTo || '/rooms'}>
              {active.primaryLabel || 'Discover'}
            </Button>
            {active.secondaryLabel && active.secondaryTo ? (
              <Button as={Link} to={active.secondaryTo} variant="ghost">
                {active.secondaryLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 left-0 right-0 z-20 flex justify-center gap-3 md:bottom-28 md:hidden">
        <button
          type="button"
          className="rounded-full border border-porcelain/25 bg-slate-950/55 px-4 py-2 text-xs uppercase tracking-widest text-porcelain backdrop-blur"
          aria-label="Previous slide"
          onClick={() => go(-1)}
        >
          Prev
        </button>
        <button
          type="button"
          className="rounded-full border border-porcelain/25 bg-slate-950/55 px-4 py-2 text-xs uppercase tracking-widest text-porcelain backdrop-blur"
          aria-label="Next slide"
          onClick={() => go(1)}
        >
          Next
        </button>
      </div>

      <button
        type="button"
        className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-porcelain/20 bg-slate-950/50 p-3 text-porcelain backdrop-blur-md transition hover:border-gold-500/50 hover:text-gold-300 md:left-6 md:block"
        aria-label="Previous slide"
        onClick={() => go(-1)}
      >
        <Chevron dir="left" />
      </button>
      <button
        type="button"
        className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-porcelain/20 bg-slate-950/50 p-3 text-porcelain backdrop-blur-md transition hover:border-gold-500/50 hover:text-gold-300 md:right-6 md:block"
        aria-label="Next slide"
        onClick={() => go(1)}
      >
        <Chevron dir="right" />
      </button>

      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-2 md:bottom-14">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === index ? 'w-10 bg-gold-500' : 'w-3 bg-white/25 hover:bg-white/40',
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}

function Chevron({ dir }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {dir === 'left' ? (
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}
