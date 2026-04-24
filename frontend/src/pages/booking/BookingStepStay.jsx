import { useMemo } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { useAuth } from '../../hooks/useAuth'

function validateStay(d) {
  const e = {}
  if (!d.room) e.room = 'Choose a suite'
  if (!d.check_in) e.check_in = 'Required'
  if (!d.check_out) e.check_out = 'Required'
  if (d.check_in && d.check_out && d.check_out <= d.check_in) {
    e.check_out = 'Must be after arrival'
  }
  if (!d.guests || Number(d.guests) < 1) e.guests = 'At least 1 guest'
  return e
}

export default function BookingStepStay() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { draft, setDraft, rooms } = useOutletContext()

  const errors = useMemo(() => validateStay(draft), [draft])

  const roomOptions = useMemo(
    () =>
      (rooms || []).map((r) => (
        <option key={r.id} value={r.id}>
          {r.name} — {r.price_per_night}/night
        </option>
      )),
    [rooms],
  )

  function continueToGuests() {
    const v = validateStay(draft)
    if (Object.keys(v).length) {
      toast.error('Please fix the highlighted fields.')
      return
    }
    if (!user) {
      toast.error('Please sign in to continue.')
      return
    }
    const room = rooms.find((r) => String(r.id) === String(draft.room))
    if (room && Number(draft.guests) > room.max_guests) {
      toast.error(`This suite allows at most ${room.max_guests} guests.`)
      return
    }
    navigate('/booking/guests')
  }

  return (
    <>
      <header data-booking-reveal className="mb-10 border-b border-white/15 pb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-400">Reservations · Step 1 of 3</p>
        <div className="mt-3 h-px w-16 bg-gradient-to-r from-gold-400/80 to-transparent" aria-hidden />
        <h1 className="mt-5 font-display text-4xl text-porcelain md:text-5xl">Compose your stay</h1>
        <p className="mt-3 text-sm text-porcelain-muted">
          Choose dates and guest count, then we will collect each guest&apos;s details before payment.{' '}
          {!user && (
            <>
              <Link to="/login" className="text-gold-400 underline-offset-4 hover:underline">
                Sign in
              </Link>{' '}
              to continue.
            </>
          )}
        </p>
      </header>

      <div
        data-booking-reveal
        className="booking-glass-strong space-y-6 p-6 md:p-8"
      >
        <Select
          label="Suite"
          name="room"
          value={draft.room}
          error={errors.room}
          onChange={(e) => setDraft({ room: e.target.value })}
        >
          <option value="">Select a suite</option>
          {roomOptions}
        </Select>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Arrival"
            type="date"
            name="check_in"
            value={draft.check_in}
            error={errors.check_in}
            onChange={(e) => setDraft({ check_in: e.target.value })}
          />
          <Input
            label="Departure"
            type="date"
            name="check_out"
            value={draft.check_out}
            error={errors.check_out}
            onChange={(e) => setDraft({ check_out: e.target.value })}
          />
        </div>
        <Input
          label="Guests"
          type="number"
          min="1"
          name="guests"
          value={draft.guests}
          error={errors.guests}
          onChange={(e) => setDraft({ guests: e.target.value })}
        />
        <Textarea
          label="Notes for the concierge"
          name="special_requests"
          value={draft.special_requests}
          onChange={(e) => setDraft({ special_requests: e.target.value })}
          placeholder="Dietary preferences, celebrations, airport transfers…"
        />
        <Button type="button" disabled={!user} className="w-full md:w-auto" onClick={continueToGuests}>
          Continue to guest details
        </Button>
      </div>
    </>
  )
}
