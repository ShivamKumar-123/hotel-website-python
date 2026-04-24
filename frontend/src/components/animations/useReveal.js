import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerGsapPlugins } from './gsapRegister'

/**
 * Scroll-linked reveal (GSAP + ScrollTrigger): opacity + transform only (GPU-friendly).
 * Optional `blur` > 0 opts into filter animation (costly — avoid unless necessary).
 */
export function useReveal(options = {}) {
  const ref = useRef(null)
  const {
    y = 32,
    duration = 0.7,
    delay = 0,
    blur = 0,
    scale = 0.98,
  } = options

  useLayoutEffect(() => {
    registerGsapPlugins()
    const el = ref.current
    if (!el) return undefined

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { clearProps: 'all' })
      return undefined
    }

    const from = { autoAlpha: 0, y, scale }
    const to = {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
    }
    if (blur > 0) {
      from.filter = `blur(${blur}px)`
      to.filter = 'blur(0px)'
      to.clearProps = 'filter'
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(el, from, to)
    }, el)

    return () => ctx.revert()
  }, [y, duration, delay, blur, scale])

  return ref
}
