import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bindSiteScrollAnimations } from './siteScrollAnimations'

/**
 * Re-binds `[data-scroll]` / `[data-scroll-stagger]` / `[data-scroll-parallax]` after each route.
 * Wrap marketing + dashboard content that should receive global scroll choreography.
 */
export default function SiteScrollScope({ children }) {
  const ref = useRef(null)
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const root = ref.current
    const cleanup = bindSiteScrollAnimations(root)
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 0)
    return () => {
      window.clearTimeout(t)
      cleanup()
    }
  }, [pathname])

  return (
    <div ref={ref} className="site-scroll-scope min-w-0">
      {children}
    </div>
  )
}
