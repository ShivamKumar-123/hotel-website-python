import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Register GSAP plugins once (ScrollTrigger for reveals + parallax).
 */
let registered = false

export function registerGsapPlugins() {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({ ignoreMobileResize: true })
  ScrollTrigger.defaults({ fastScrollEnd: true })
  registered = true
}
