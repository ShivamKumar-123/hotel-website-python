import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { confirmRazorpayBooking, createBooking, createRazorpayOrder } from '../../services/api'
import { formatMoney } from '../../utils/format'

const MERCHANT_UPI = import.meta.env.VITE_MERCHANT_UPI || 'aurumgrand.pay@upi'
const MERCHANT_NAME = import.meta.env.VITE_MERCHANT_PAYEE_NAME || 'Aurum Grand Hotel'
const UPI_CURRENCY = import.meta.env.VITE_UPI_CURRENCY || 'INR'

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut || checkOut <= checkIn) return 0
  const a = new Date(checkIn)
  const b = new Date(checkOut)
  return Math.max(1, Math.round((b - a) / (86400000)))
}

function buildUpiUri(amountStr) {
  const params = new URLSearchParams({
    pa: MERCHANT_UPI,
    pn: MERCHANT_NAME,
    am: amountStr,
    cu: UPI_CURRENCY,
  })
  return `upi://pay?${params.toString()}`
}

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (globalThis.Razorpay) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Could not load Razorpay checkout.'))
    document.body.appendChild(s)
  })
}

export default function BookingStepPayment() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { draft, clearDraft, rooms } = useOutletContext()

  const [payMode, setPayMode] = useState('upi')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [rzLoading, setRzLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successWasRazorpay, setSuccessWasRazorpay] = useState(false)

  const room = useMemo(
    () => rooms.find((r) => String(r.id) === String(draft.room)),
    [rooms, draft.room],
  )

  const nights = useMemo(
    () => nightsBetween(draft.check_in, draft.check_out),
    [draft.check_in, draft.check_out],
  )

  const total = useMemo(() => {
    if (!room) return 0
    return Number(room.price_per_night) * nights
  }, [room, nights])

  const amountStr = total > 0 ? total.toFixed(2) : '0.00'
  const upiHref = buildUpiUri(amountStr)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiHref)}`

  const guestDetailsList = useMemo(
    () => (Array.isArray(draft.guestDetails) ? draft.guestDetails : []),
    [draft.guestDetails],
  )

  const draftPayload = useMemo(
    () => ({
      room: room?.id,
      check_in: draft.check_in,
      check_out: draft.check_out,
      guests: Number(draft.guests),
      special_requests: draft.special_requests || '',
      guest_details: guestDetailsList,
    }),
    [room, draft.check_in, draft.check_out, draft.guests, draft.special_requests, guestDetailsList],
  )

  useEffect(() => {
    if (!user || showSuccess) return
    if (!room || !draft.check_in || !draft.check_out) {
      toast.error('Complete the previous steps first.')
      navigate('/booking', { replace: true })
    }
  }, [user, room, draft.check_in, draft.check_out, navigate, showSuccess])

  useEffect(() => {
    if (!showSuccess) return undefined
    const t = setTimeout(() => {
      navigate('/my-bookings', { replace: true })
      clearDraft()
    }, 3000)
    return () => clearTimeout(t)
  }, [showSuccess, navigate, clearDraft])

  async function submitPayment(e) {
    e.preventDefault()
    if (payMode === 'razorpay') return
    if (!user) {
      toast.error('Please sign in.')
      return
    }
    if (!room) return
    if (!file) {
      toast.error('Please attach a payment screenshot.')
      return
    }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('room', String(room.id))
      fd.append('check_in', draft.check_in)
      fd.append('check_out', draft.check_out)
      fd.append('guests', String(draft.guests))
      fd.append('special_requests', draft.special_requests || '')
      fd.append('guest_details', JSON.stringify(guestDetailsList))
      fd.append('payment_method', payMode === 'qr' ? 'qr' : 'upi')
      fd.append('payment_screenshot', file)

      await createBooking(fd)
      setSuccessWasRazorpay(false)
      setShowSuccess(true)
    } catch (err) {
      const msg =
        err.response?.data && typeof err.response.data === 'object'
          ? JSON.stringify(err.response.data)
          : 'Payment submission failed.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const startRazorpay = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in.')
      return
    }
    if (!room) return
    setRzLoading(true)
    try {
      await loadRazorpayScript()
      const order = await createRazorpayOrder(draftPayload)
      const RZP = globalThis.Razorpay
      if (!RZP) {
        toast.error('Razorpay failed to initialize.')
        return
      }
      const options = {
        key: order.key_id,
        order_id: order.order_id,
        currency: order.currency || 'INR',
        name: MERCHANT_NAME,
        description: `${room.name} · ${nights} night${nights === 1 ? '' : 's'}`,
        theme: { color: '#c9a962' },
        prefill: {
          email: user.email || '',
          name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || '',
        },
        handler(response) {
          const body = {
            ...draftPayload,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }
          confirmRazorpayBooking(body)
            .then(() => {
              setSuccessWasRazorpay(true)
              setShowSuccess(true)
            })
            .catch((err) => {
              const d = err.response?.data
              const msg =
                d?.detail ||
                d?.non_field_errors?.[0] ||
                (typeof d === 'object' ? JSON.stringify(d) : null) ||
                'Could not confirm booking after payment.'
              toast.error(typeof msg === 'string' ? msg : 'Confirmation failed.')
            })
        },
        modal: {
          ondismiss() {
            setRzLoading(false)
          },
        },
      }
      const rzp = new RZP(options)
      rzp.on('payment.failed', (ev) => {
        const desc = ev?.error?.description || ev?.error?.reason || 'Payment failed.'
        toast.error(desc)
        setRzLoading(false)
      })
      rzp.open()
    } catch (err) {
      const d = err.response?.data
      const msg = d?.detail || err.message || 'Could not start Razorpay checkout.'
      toast.error(typeof msg === 'string' ? msg : 'Razorpay checkout failed.')
    } finally {
      setRzLoading(false)
    }
  }, [user, room, nights, draftPayload])

  if (!room) {
    return (
      <p className="text-sm text-porcelain-muted">
        <Link to="/booking" className="text-gold-400 underline-offset-4 hover:underline">
          Return to booking
        </Link>
      </p>
    )
  }

  return (
    <>
      <header data-booking-reveal className="mb-10 border-b border-white/15 pb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-400">Reservations · Step 3 of 3</p>
        <div className="mt-3 h-px w-16 bg-gradient-to-r from-gold-400/80 to-transparent" aria-hidden />
        <h1 className="mt-5 font-display text-3xl text-porcelain md:text-4xl">Settle & confirm</h1>
        <p className="mt-3 text-sm text-porcelain-muted">
          Pay with <span className="text-porcelain/90">Razorpay</span> (cards, UPI, netbanking), or use manual UPI / QR
          and upload a screenshot for staff verification.
        </p>
      </header>

      <form onSubmit={submitPayment} className="booking-glass-strong space-y-8 p-6 md:p-8">
        <div
          data-booking-reveal
          className="rounded-2xl border border-gold-500/35 bg-gradient-to-br from-gold-500/15 via-black/40 to-black/50 p-6 shadow-lg shadow-gold-900/10"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold-500/90">Amount due</p>
          <p className="mt-2 font-display text-3xl text-porcelain">{formatMoney(total)}</p>
          <p className="mt-1 text-xs text-porcelain-muted">
            {room.name} · {nights} night{nights === 1 ? '' : 's'} · {UPI_CURRENCY}
          </p>
        </div>

        <div data-booking-reveal className="flex flex-wrap gap-2">
          {[
            { id: 'razorpay', label: 'Razorpay' },
            { id: 'upi', label: 'UPI ID' },
            { id: 'qr', label: 'QR code' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition ${
                payMode === t.id
                  ? 'border-gold-500 text-gold-300'
                  : 'border-porcelain/15 text-porcelain-muted hover:border-gold-500/40'
              }`}
              onClick={() => setPayMode(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {payMode === 'razorpay' && (
          <div
            data-booking-reveal
            className="space-y-4 rounded-2xl border border-white/12 bg-black/30 p-6 backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-widest text-gold-500/90">Secure checkout</p>
            <p className="text-sm leading-relaxed text-porcelain-muted">
              You will complete payment in a Razorpay window. After a successful payment, your booking is created
              immediately and stays <span className="text-porcelain/90">pending confirmation</span> until staff
              reviews it — same as manual UPI proof.
            </p>
            <Button type="button" className="w-full sm:w-auto" disabled={rzLoading || !user} onClick={startRazorpay}>
              {rzLoading ? 'Opening checkout…' : 'Pay with Razorpay'}
            </Button>
          </div>
        )}

        {payMode === 'upi' && (
          <div
            data-booking-reveal
            className="space-y-3 rounded-2xl border border-white/12 bg-black/30 p-5 backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-widest text-gold-500/90">Pay to VPA</p>
            <p className="font-mono text-lg text-porcelain">{MERCHANT_UPI}</p>
            <p className="text-xs text-porcelain-muted">
              In your UPI app, send <span className="text-gold-400">{UPI_CURRENCY}</span>{' '}
              <span className="text-porcelain">{amountStr}</span> to this address, or tap open below.
            </p>
            <a
              href={upiHref}
              className="inline-flex rounded-full border border-gold-500/50 px-4 py-2 text-xs uppercase tracking-widest text-gold-300 transition hover:bg-gold-500/10"
            >
              Open UPI app
            </a>
          </div>
        )}

        {payMode === 'qr' && (
          <div
            data-booking-reveal
            className="space-y-3 rounded-2xl border border-white/12 bg-black/30 p-5 text-center backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-widest text-gold-500/90">Scan to pay</p>
            <img
              src={qrSrc}
              alt="UPI payment QR"
              className="mx-auto rounded-lg border border-porcelain/10 bg-white p-2"
              width={220}
              height={220}
            />
            <p className="text-xs text-porcelain-muted">
              Scan with any UPI app. Amount: {UPI_CURRENCY} {amountStr}
            </p>
          </div>
        )}

        {(payMode === 'upi' || payMode === 'qr') && (
          <div data-booking-reveal>
            <label className="mb-2 block text-xs uppercase tracking-widest text-gold-500/90">
              Payment screenshot
            </label>
            <input
              type="file"
              accept="image/*"
              className="block w-full cursor-pointer rounded-xl border border-dashed border-white/25 bg-black/35 px-3 py-4 text-sm text-porcelain-muted file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-gold-500/25 file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-gold-200"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="mt-2 text-xs text-porcelain-muted/80">
              Upload a clear screenshot showing the successful debit and reference ID.
            </p>
          </div>
        )}

        <div data-booking-reveal className="flex flex-wrap gap-3 pt-1">
          <Button type="button" variant="ghost" onClick={() => navigate('/booking/guests')}>
            Back
          </Button>
          {(payMode === 'upi' || payMode === 'qr') && (
            <Button type="submit" disabled={submitting || !user}>
              {submitting ? 'Submitting…' : 'Submit payment proof'}
            </Button>
          )}
        </div>
      </form>

      {showSuccess && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-success-title"
        >
          <div className="booking-success-pop relative max-w-md rounded-3xl border border-gold-400/40 bg-gradient-to-b from-gold-500/15 via-stone-950/95 to-black px-8 py-10 text-center shadow-2xl shadow-black/60 ring-1 ring-gold-500/25">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400/60 bg-gold-500/15 text-3xl text-gold-300">
              ✓
            </div>
            <h2 id="booking-success-title" className="font-display text-2xl tracking-wide text-porcelain">
              {successWasRazorpay ? 'Booking created' : 'Request received'}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-porcelain-muted">
              {successWasRazorpay ? (
                <>
                  Your Razorpay payment was successful and the reservation is on file. Status remains{' '}
                  <span className="text-porcelain/90">pending</span> until staff confirms — track it in My stays.
                </>
              ) : (
                <>
                  Thank you — your payment proof is on file. Our team will verify it and{' '}
                  <span className="text-porcelain/90">confirm your reservation</span> shortly. You can follow status
                  in My stays; once confirmed, your stay is secured.
                </>
              )}
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-gold-500/80">
              Redirecting to your stays…
            </p>
          </div>
        </div>
      )}
    </>
  )
}
