import { useState } from 'react'
import toast from 'react-hot-toast'
import SEO from '../components/common/SEO'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import BookingExperienceShell, {
  CONTACT_HERO_IMAGES,
} from '../components/booking/BookingExperienceShell'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Please share your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (form.message.trim().length < 8) e.message = 'A few more words help us prepare'
    return e
  }

  function onSubmit(ev) {
    ev.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    toast.success('Thank you — our concierge will reply within one business day.')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <>
      <SEO
        title="Contact concierge"
        description="Reach Aurum Grand concierge for celebrations, corporate stays, groups, and bespoke itineraries — phone, email, and message."
        path="/contact"
        keywords="hotel concierge, corporate stays, events hotel New York, Aurum Grand contact"
      />
      <BookingExperienceShell images={CONTACT_HERO_IMAGES} contentMaxClass="max-w-6xl">
        <div className="text-on-photo pb-6 md:pb-10">
          <header
            data-scroll="fade-up"
            className="relative mb-10 border-b border-white/15 pb-10 text-center md:text-left"
          >
            <span className="absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-500/80 to-transparent md:left-0 md:translate-x-0" />
            <p className="mt-6 text-xs uppercase tracking-[0.38em] text-gold-500">Concierge</p>
            <h1 className="mt-4 font-display text-4xl tracking-tight text-porcelain sm:text-5xl">
              We are listening
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-porcelain-muted md:mx-0 md:max-w-xl">
              Proposals, press, private events, or a simple question — write to us. A human always
              replies.
            </p>
            <ul
              data-scroll="fade-up"
              className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start"
            >
              {['Within 24h', 'English · Español', 'Events & groups'].map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-porcelain-muted backdrop-blur-sm"
                >
                  {label}
                </li>
              ))}
            </ul>
          </header>

          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <aside
              data-scroll="slide-right"
              className="booking-glass-strong flex flex-col gap-6 p-6 md:p-8 lg:col-span-5"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-500/90">
                  Visit
                </p>
                <p className="mt-2 text-sm leading-relaxed text-porcelain-muted">
                  128 Meridian Avenue, New York
                </p>
              </div>
              <div className="h-px bg-gradient-to-r from-gold-500/25 via-white/10 to-transparent" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-500/90">
                  Call
                </p>
                <a
                  href="tel:+12125550123"
                  className="mt-2 inline-block text-lg font-display text-porcelain transition hover:text-gold-300"
                >
                  +1 (212) 555-0123
                </a>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-500/90">
                  Write
                </p>
                <a
                  href="mailto:concierge@aurumgrand.com"
                  className="mt-2 inline-block break-all text-sm text-gold-400/95 underline-offset-4 transition hover:text-gold-300 hover:underline"
                >
                  concierge@aurumgrand.com
                </a>
              </div>
            </aside>

            <div
              data-scroll="slide-left"
              className="booking-glass-strong p-6 md:p-8 lg:col-span-7"
            >
              <h2 className="font-display text-xl text-porcelain">Send a message</h2>
              <p className="mt-1 text-xs text-porcelain-muted">
                Fields marked by validation will highlight if something needs attention.
              </p>
              <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
                <Input
                  label="Name"
                  value={form.name}
                  error={errors.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  error={errors.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                <Textarea
                  label="How may we assist?"
                  value={form.message}
                  error={errors.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
                <Button type="submit" className="w-full sm:w-auto sm:min-w-[200px]">
                  Send message
                </Button>
              </form>
            </div>

            <div
              data-scroll="fade-up"
              className="booking-glass-strong overflow-hidden border-white/20 p-0 lg:col-span-12"
            >
              <div className="border-b border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-500/90">
                Find us
              </div>
              <iframe
                title="Aurum Grand location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-73.98823492404077!3d40.74844097138992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                width="100%"
                height="320"
                className="min-h-[260px] w-full sm:min-h-[320px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </BookingExperienceShell>
    </>
  )
}
