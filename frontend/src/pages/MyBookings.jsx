import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import toast from 'react-hot-toast'
import { registerGsapPlugins } from '../components/animations/gsapRegister'
import BookingExperienceShell from '../components/booking/BookingExperienceShell'
import Loader from '../components/common/Loader'
import SEO from '../components/common/SEO'
import { useAuth } from '../hooks/useAuth'
import { fetchBookings } from '../services/api'
import { formatDate, formatMoney } from '../utils/format'

export default function MyBookings() {
  const { user, bootstrapping } = useAuth()
  const location = useLocation()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const revealRef = useRef(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await fetchBookings({ page_size: 50 })
      const list = data.results || data
      setRows(Array.isArray(list) ? list : [])
    } catch {
      toast.error('Could not load your bookings.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  useLayoutEffect(() => {
    if (loading) return undefined
    const root = revealRef.current
    if (!root) return undefined
    const gsapCtx = gsap.context(() => {
      const nodes = root.querySelectorAll('[data-booking-reveal]')
      if (nodes.length) {
        gsap.fromTo(
          nodes,
          { opacity: 0, y: 18, scale: 0.99 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.48,
            stagger: 0.05,
            ease: 'power2.out',
          },
        )
      }
    }, root)
    return () => gsapCtx.revert()
  }, [loading, rows.length])

  if (bootstrapping) {
    return <Loader label="Restoring session…" variant="overlay" />
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <>
      <SEO
        title="My stays"
        description="View and manage your Aurum Grand reservations and booking history."
        path="/my-bookings"
        keywords="Aurum Grand reservations, my bookings, hotel stay history"
        noindex
      />
      <BookingExperienceShell contentMaxClass="w-full min-w-0 max-w-[92rem]">
        <div ref={revealRef} className="text-on-photo">
          <header data-booking-reveal className="mb-8 border-b border-white/15 pb-6 sm:mb-10 sm:pb-8">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold-400 sm:text-xs">For you</p>
            <div className="mt-2 h-px w-14 bg-gradient-to-r from-gold-400/80 to-transparent sm:mt-3 sm:w-16" aria-hidden />
            <h1 className="mt-4 font-display text-3xl text-porcelain sm:mt-5 sm:text-4xl md:text-5xl">
              Booking history
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-porcelain-muted sm:mt-3">
              Every stay you have composed — statuses, guests on file, and payment receipts.
            </p>
            <Link
              to="/booking"
              className="mt-5 inline-flex text-[10px] uppercase tracking-widest text-gold-400 underline-offset-4 transition hover:text-gold-300 hover:underline sm:mt-6 sm:text-xs"
            >
              New reservation
            </Link>
          </header>

          {loading ? (
            <p className="text-sm text-porcelain-muted">Loading…</p>
          ) : rows.length === 0 ? (
            <div
              data-booking-reveal
              className="booking-glass-strong mx-auto max-w-lg p-8 text-center text-sm text-porcelain-muted sm:p-10"
            >
              No bookings yet.{' '}
              <Link to="/booking" className="text-gold-400 underline-offset-4 hover:underline">
                Reserve a suite
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 pb-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 2xl:gap-7">
              {rows.map((b) => (
                <li
                  key={b.id}
                  data-booking-reveal
                  className="booking-glass-strong group flex min-h-0 flex-col p-4 transition duration-300 hover:border-gold-500/35 hover:shadow-gold-900/20 sm:p-5 md:p-6"
                >
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg leading-snug text-porcelain sm:text-xl">{b.room_name}</p>
                      <p className="mt-1.5 text-[11px] leading-snug text-porcelain-muted sm:text-xs">
                        <span className="block sm:inline">
                          {formatDate(b.check_in)} → {formatDate(b.check_out)}
                        </span>
                        <span className="hidden sm:inline"> · </span>
                        <span className="block sm:inline">
                          {b.guests} guest{b.guests === 1 ? '' : 's'}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-widest sm:px-2.5 sm:py-1 sm:text-[10px] ${
                        b.status === 'confirmed'
                          ? 'border-emerald-400/50 text-emerald-200'
                          : b.status === 'cancelled'
                            ? 'border-red-400/40 text-red-200/90'
                            : 'border-gold-400/45 text-gold-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-base text-gold-300 sm:mt-4 sm:text-lg">
                    {formatMoney(b.total_price)}
                  </p>
                  {Array.isArray(b.guest_details) && b.guest_details.length > 0 && (
                    <div className="mt-3 max-h-36 min-h-0 flex-1 overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-3 backdrop-blur-sm scrollbar-themed sm:mt-4 sm:p-3.5">
                      <p className="text-[9px] uppercase tracking-widest text-porcelain-muted sm:text-[10px]">
                        Guests
                      </p>
                      <ul className="mt-2 space-y-1.5 text-xs text-porcelain-muted sm:text-sm">
                        {b.guest_details.map((g, i) => (
                          <li key={i} className="break-words">
                            <span className="text-porcelain">{g.full_name}</span>
                            {g.phone ? <span className="opacity-90"> · {g.phone}</span> : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-auto pt-3 sm:pt-4">
                    {b.payment_screenshot_url ? (
                      <a
                        href={b.payment_screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex text-[10px] uppercase tracking-widest text-gold-400 underline-offset-4 transition hover:text-gold-300 hover:underline sm:text-xs"
                      >
                        View payment screenshot
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </BookingExperienceShell>
    </>
  )
}
