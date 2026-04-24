import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import toast from 'react-hot-toast'
import BookingExperienceShell, {
  RESERVE_HERO_IMAGES,
} from '../../components/booking/BookingExperienceShell'
import { registerGsapPlugins } from '../../components/animations/gsapRegister'
import SEO from '../../components/common/SEO'
import { fetchRooms } from '../../services/api'
import { clearDraftStorage, emptyDraft, loadDraft, saveDraft } from './bookingSession'

export default function BookingLayout() {
  const location = useLocation()
  const revealRef = useRef(null)
  const [params] = useSearchParams()
  const preRoom = params.get('room') || ''

  const [rooms, setRooms] = useState([])
  const [draft, setDraftState] = useState(() => {
    const saved = loadDraft()
    if (saved && typeof saved === 'object') return saved
    return emptyDraft(preRoom)
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchRooms({ page_size: 100 })
        if (!cancelled) setRooms(data.results || data || [])
      } catch {
        if (!cancelled) toast.error('Could not load suites.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (preRoom) {
      setDraftState((d) => {
        const next = { ...d, room: preRoom }
        saveDraft(next)
        return next
      })
    }
  }, [preRoom])

  const setDraft = useCallback((updater) => {
    setDraftState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      saveDraft(next)
      return next
    })
  }, [])

  const clearDraft = useCallback(() => {
    clearDraftStorage()
    setDraftState(emptyDraft(preRoom))
  }, [preRoom])

  const outletContext = useMemo(
    () => ({
      draft,
      setDraft,
      clearDraft,
      rooms,
      preRoom,
    }),
    [draft, setDraft, clearDraft, rooms, preRoom],
  )

  const bookingSeo = useMemo(() => {
    const p = location.pathname
    if (p.includes('/payment')) {
      return {
        title: 'Reserve · Payment',
        description: 'Complete your Aurum Grand reservation with secure payment and booking confirmation.',
        path: '/booking/payment',
      }
    }
    if (p.includes('/guests')) {
      return {
        title: 'Reserve · Guest details',
        description: 'Add guest names and preferences for your Aurum Grand stay before payment.',
        path: '/booking/guests',
      }
    }
    return {
      title: 'Reserve a suite',
      description:
        'Choose dates, suite, and guest count at Aurum Grand — refined stays with concierge follow-up.',
      path: '/booking',
    }
  }, [location.pathname])

  useLayoutEffect(() => {
    registerGsapPlugins()
    const root = revealRef.current
    if (!root) return undefined
    const gsapCtx = gsap.context(() => {
      const nodes = root.querySelectorAll('[data-booking-reveal]')
      if (nodes.length) {
        gsap.fromTo(
          nodes,
          { opacity: 0, y: 22, scale: 0.99 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.52,
            stagger: 0.06,
            ease: 'power2.out',
          },
        )
      }
    }, root)
    return () => gsapCtx.revert()
  }, [location.pathname])

  return (
    <>
      <SEO
        title={bookingSeo.title}
        description={bookingSeo.description}
        path={bookingSeo.path}
        keywords="book hotel suite, luxury hotel reservation, Aurum Grand booking, New York hotel stay"
      />
      <BookingExperienceShell images={RESERVE_HERO_IMAGES}>
        <div ref={revealRef} key={location.pathname} className="text-on-photo">
          <Outlet context={outletContext} />
        </div>
      </BookingExperienceShell>
    </>
  )
}
