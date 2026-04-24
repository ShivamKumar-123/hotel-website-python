import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'

function validateGuests(draft) {
  const n = Number(draft.guests) || 0
  const list = draft.guestDetails || []
  const e = {}
  if (list.length !== n) e._form = 'Guest list does not match guest count.'
  list.forEach((g, i) => {
    if (!(g.full_name || '').trim()) e[`name_${i}`] = 'Full name required'
  })
  return e
}

export default function BookingStepGuests() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { draft, setDraft, rooms } = useOutletContext()

  const count = Math.max(1, Math.min(20, Number(draft.guests) || 1))

  useEffect(() => {
    setDraft((prev) => {
      const n = Math.max(1, Math.min(20, Number(prev.guests) || 1))
      let gd = [...(prev.guestDetails || [])]
      if (gd.length === n) return prev
      while (gd.length < n) gd.push({ full_name: '', phone: '', email: '' })
      if (gd.length > n) gd = gd.slice(0, n)
      return { ...prev, guestDetails: gd }
    })
  }, [draft.guests, setDraft])

  const errors = useMemo(() => validateGuests(draft), [draft])

  function updateGuest(i, field, value) {
    setDraft((prev) => {
      const gd = [...(prev.guestDetails || [])]
      gd[i] = { ...gd[i], [field]: value }
      return { ...prev, guestDetails: gd }
    })
  }

  function back() {
    navigate('/booking')
  }

  function next() {
    if (!user) {
      toast.error('Please sign in.')
      return
    }
    const v = validateGuests(draft)
    if (Object.keys(v).length) {
      toast.error(v._form || 'Please complete each guest name.')
      return
    }
    const room = rooms.find((r) => String(r.id) === String(draft.room))
    if (!draft.room || !room) {
      toast.error('Choose a suite first.')
      navigate('/booking')
      return
    }
    navigate('/booking/payment')
  }

  return (
    <>
      <header data-booking-reveal className="mb-10 border-b border-white/15 pb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-400">Reservations · Step 2 of 3</p>
        <div className="mt-3 h-px w-16 bg-gradient-to-r from-gold-400/80 to-transparent" aria-hidden />
        <h1 className="mt-5 font-display text-3xl text-porcelain md:text-4xl">Guest particulars</h1>
        <p className="mt-3 text-sm text-porcelain-muted">
          We keep one profile per traveller for the register.{' '}
          {!user && (
            <Link to="/login" className="text-gold-400 underline-offset-4 hover:underline">
              Sign in
            </Link>
          )}
        </p>
      </header>

      <div className="space-y-8">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            data-booking-reveal
            className="rounded-2xl border border-white/12 bg-black/25 p-5 shadow-inner shadow-black/40 backdrop-blur-md md:p-6"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-gold-500/90">
              Guest {i + 1} of {count}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full name"
                value={draft.guestDetails[i]?.full_name || ''}
                error={errors[`name_${i}`]}
                onChange={(e) => updateGuest(i, 'full_name', e.target.value)}
                autoComplete="name"
              />
              <Input
                label="Phone"
                type="tel"
                value={draft.guestDetails[i]?.phone || ''}
                onChange={(e) => updateGuest(i, 'phone', e.target.value)}
                autoComplete="tel"
              />
              <Input
                className="md:col-span-2"
                label="Email (optional)"
                type="email"
                value={draft.guestDetails[i]?.email || ''}
                onChange={(e) => updateGuest(i, 'email', e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>
        ))}

        <div data-booking-reveal className="flex flex-wrap gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={back}>
            Back
          </Button>
          <Button type="button" onClick={next} disabled={!user}>
            Continue to payment
          </Button>
        </div>
      </div>
    </>
  )
}
