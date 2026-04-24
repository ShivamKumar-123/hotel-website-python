import { useReveal } from '../animations/useReveal'
import { cn } from '../../utils/cn'
import SectionBackdrop from './SectionBackdrop'

/** When `waveOverlap` is true, pair with `<WaveSeparator overlapIntoNext />` above so the wave bites into this block. */
export default function RevealSection({ children, className, bgImage, waveOverlap = false }) {
  const ref = useReveal({ y: 48 })
  if (bgImage) {
    return (
      <section
        ref={ref}
        className={cn('overflow-hidden', waveOverlap && 'relative z-[1] -mt-[4.75rem]')}
      >
        <SectionBackdrop
          image={bgImage}
          className={cn(
            className,
            waveOverlap && '!pt-32 md:!pt-40',
          )}
        >
          {children}
        </SectionBackdrop>
      </section>
    )
  }
  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  )
}
