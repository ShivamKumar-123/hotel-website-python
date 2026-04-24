import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerGsapPlugins } from './gsapRegister'

/**
 * Subtle parallax on a background layer for the hero section.
 */
export default function ParallaxHero({ children, className = '' }) {
  const bgRef = useRef(null)

  useLayoutEffect(() => {
    registerGsapPlugins()
    const bg = bgRef.current
    if (!bg) return undefined

    const tween = gsap.to(bg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: bg,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div ref={bgRef} className="absolute inset-0 scale-110 will-change-transform">
        {children}
      </div>
    </div>
  )
}
