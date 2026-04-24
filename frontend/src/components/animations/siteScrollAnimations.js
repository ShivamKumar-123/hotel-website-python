import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerGsapPlugins } from './gsapRegister'

const singlePresets = {
  'fade-up': {
    from: { autoAlpha: 0, y: 40, scale: 0.98 },
    to: { autoAlpha: 1, y: 0, scale: 1 },
  },
  'fade-soft': {
    from: { autoAlpha: 0, y: 22 },
    to: { autoAlpha: 1, y: 0 },
  },
  scale: {
    from: { autoAlpha: 0, scale: 0.92 },
    to: { autoAlpha: 1, scale: 1 },
  },
  'slide-left': {
    from: { autoAlpha: 0, x: -44 },
    to: { autoAlpha: 1, x: 0 },
  },
  'slide-right': {
    from: { autoAlpha: 0, x: 44 },
    to: { autoAlpha: 1, x: 0 },
  },
}

const defaultTrigger = {
  start: 'top 89%',
  toggleActions: 'play none none none',
}

/**
 * Binds scroll-driven GSAP animations under `root`.
 * - `[data-scroll]` — one-off reveal (variant via data-scroll="fade-up" | scale | …)
 * - `[data-scroll-stagger]` — animates direct element children in sequence
 * - `[data-scroll-parallax]` — subtle vertical parallax on element (often an image wrapper)
 */
export function bindSiteScrollAnimations(root) {
  registerGsapPlugins()
  if (!root || typeof window === 'undefined') {
    return () => {}
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  const ctx = gsap.context(() => {
    root.querySelectorAll('[data-scroll-parallax]').forEach((wrap) => {
      const target = wrap.querySelector('img') || wrap
      gsap.fromTo(
        target,
        { yPercent: 6 },
        {
          yPercent: -6,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.35,
          },
        },
      )
    })

    root.querySelectorAll('[data-scroll-stagger]').forEach((container) => {
      const kids = [...container.children].filter((c) => c.nodeType === 1)
      if (!kids.length) return
      const stagger = Number(container.dataset.scrollStagger ?? 0.11)
      const delay = Number(container.dataset.scrollStaggerDelay ?? 0)
      gsap.fromTo(
        kids,
        { autoAlpha: 0, y: 32, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.68,
          stagger,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 87%',
            toggleActions: 'play none none none',
          },
        },
      )
    })

    root.querySelectorAll('[data-scroll]').forEach((el) => {
      if (el.closest('[data-scroll-stagger]')) return
      const kind = el.dataset.scroll || 'fade-up'
      if (kind === 'parallax') return

      const preset = singlePresets[kind] || singlePresets['fade-up']
      const duration = Number(el.dataset.scrollDuration ?? 0.7)

      gsap.fromTo(el, preset.from, {
        ...preset.to,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          ...defaultTrigger,
        },
      })
    })
  }, root)

  return () => {
    ctx.revert()
    ScrollTrigger.refresh()
  }
}
