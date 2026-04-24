import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import SEO from '../components/common/SEO'
import Loader from '../components/common/Loader'
import HeroCarousel from '../components/common/HeroCarousel'
import RevealSection from '../components/common/RevealSection'
import WaveSeparator from '../components/common/WaveSeparator'
import HomeImageGallery from '../components/home/HomeImageGallery'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { fetchHomeContent, fetchReviews, fetchRooms } from '../services/api'
import { formatMoney } from '../utils/format'
import { DEFAULT_HERO_CAROUSEL } from '../constants/homeContentDefaults'

const EXPERIENCES = [
  {
    title: 'Thermal rituals',
    copy: 'Hammam, vitality pool, and bespoke oils — each journey timed to your pulse.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
  },
  {
    title: 'Private dining',
    copy: 'Chef’s table, wine pairings, and a sommelier who remembers how you like your glass held.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  },
  {
    title: 'Sky atelier',
    copy: 'Sunrise yoga, evening jazz, and a terrace reserved for suite guests after dark.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  },
]

const STATS = [
  { value: '24 / 7', label: 'Concierge attunement' },
  { value: '42', label: 'Suites & residences' },
  { value: '1896', label: 'Heritage of the building' },
  { value: '∞', label: 'Small gestures remembered' },
]

function CarouselTitle({ title, highlight }) {
  if (!highlight || !title.includes(highlight)) {
    return <span>{title}</span>
  }
  const parts = title.split(highlight)
  return (
    <>
      {parts[0]}
      <span className="text-gradient-gold">{highlight}</span>
      {parts[1]}
    </>
  )
}

export default function Home() {
  const [homeContent, setHomeContent] = useState(null)
  const [rooms, setRooms] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const rawSlides = useMemo(() => {
    const fromApi = homeContent?.hero_carousel
    if (Array.isArray(fromApi) && fromApi.length > 0) return fromApi
    return DEFAULT_HERO_CAROUSEL
  }, [homeContent])

  const slidesForCarousel = useMemo(
    () =>
      rawSlides.map((s) => ({
        ...s,
        title: <CarouselTitle title={s.title} highlight={s.titleHighlight} />,
      })),
    [rawSlides],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [r1, r2, hc] = await Promise.all([
          fetchRooms({ featured: true, page_size: 3 }),
          fetchReviews({ page_size: 6 }),
          fetchHomeContent().catch(() => null),
        ])
        if (!cancelled) {
          setRooms(r1.results || r1)
          setReviews(r2.results || r2)
          setHomeContent(hc)
        }
      } catch {
        if (!cancelled) toast.error('Could not load featured content.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <SEO
        title="Luxury hotel New York"
        description="Bespoke suites, luminous design, spa, dining, and intuitive concierge service — Aurum Grand in the heart of the city."
        path="/"
        keywords="luxury hotel New York, boutique hotel, five star suites, spa hotel, Aurum Grand, book suite"
      />

      <HeroCarousel slides={slidesForCarousel} />

      <div className="bg-ink">
        <WaveSeparator variant="aurum" fill="ink" overlapIntoNext />
      </div>

      <RevealSection
        waveOverlap
        bgImage="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&q=80"
        className="px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold-500">A note from the house</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-porcelain md:text-4xl">
              Hospitality, composed as <span className="text-gradient-gold">quiet theatre</span>
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-porcelain-muted md:text-base">
              Aurum Grand is not a lobby you cross — it is a sequence of rooms that lower the volume of the world.
              We believe luxury is the absence of friction: keys that appear before you reach, tea that knows your
              hour, and windows that frame the city like a private collection.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-porcelain-muted md:text-base">
              Whether you arrive for one night or one month, our team choreographs light, scent, and silence so you
              can hear yourself think again.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button as={Link} to="/contact" variant="outlineGold" className="!text-xs">
                Request the house journal
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/25 shadow-[0_40px_100px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
            <img
              src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1000&q=80"
              alt=""
              className="aspect-[4/5] w-full object-cover md:aspect-auto md:min-h-[420px]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 font-display text-xl text-porcelain md:text-2xl">
              “We do not rush the first impression — we lengthen it.”
            </p>
          </div>
        </div>
      </RevealSection>

      <div className="bg-ink">
        <WaveSeparator variant="crest" fill="ink-soft" />
      </div>

      <RevealSection className="bg-ink-soft/40 mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Signature stays</p>
            <h2 className="mt-2 font-display text-3xl text-porcelain md:text-4xl">Featured suites</h2>
            <p className="mt-3 max-w-xl text-sm text-porcelain-muted">
              Hand-picked residences with the finest light, materials, and outlook — each one a small private
              universe.
            </p>
          </div>
          <Button as={Link} to="/rooms" variant="outlineGold" className="!text-xs">
            Full collection
          </Button>
        </div>
        {loading ? (
          <Loader label="Curating suites…" variant="section" />
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-3" data-scroll-stagger="0.12">
            {(rooms || []).slice(0, 3).map((room) => (
              <Link key={room.id} to={`/rooms/${room.slug}`} className="group block">
                <Card className="overflow-hidden !rounded-2xl border-porcelain/15 bg-porcelain/[0.05] shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={room.cover_image}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <p className="absolute bottom-4 left-4 font-display text-xl text-porcelain">{room.name}</p>
                  </div>
                  <div className="space-y-2 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-gold-500/90">
                      From {formatMoney(room.price_per_night)} / night
                    </p>
                    <p className="text-sm text-porcelain-muted">
                      {room.max_guests} guests · {room.bed_type}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </RevealSection>

      <div className="bg-ink-soft/40">
        <WaveSeparator variant="ripple" fill="ink-soft/40" overlapIntoNext />
      </div>

      <RevealSection
        waveOverlap
        bgImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80"
        className="px-4 py-20 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Curated for you</p>
          <h2 className="mt-2 font-display text-3xl text-porcelain md:text-4xl">Experiences beyond the keycard</h2>
          <p className="mt-3 max-w-2xl text-sm text-porcelain-muted">
            Three threads of the Aurum story — each can be woven into your stay with a single conversation at the
            desk.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3" data-scroll-stagger="0.12">
            {EXPERIENCES.map((ex) => (
              <Card key={ex.title} className="overflow-hidden !rounded-2xl border-white/20 !bg-slate-950/75 !p-0 shadow-xl backdrop-blur-md">
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img src={ex.image} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                  <p className="absolute bottom-4 left-4 font-display text-xl text-white">{ex.title}</p>
                </div>
                <p className="p-5 text-sm leading-relaxed text-stone-300">{ex.copy}</p>
              </Card>
            ))}
          </div>
        </div>
      </RevealSection>

      <div className="bg-ink">
        <WaveSeparator variant="aurum" fill="ink" />
      </div>

      <RevealSection className="border-y border-porcelain/10 bg-ink px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4" data-scroll-stagger="0.1">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-porcelain/15 bg-porcelain/[0.04] px-6 py-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm"
            >
              <p className="font-display text-3xl text-gold-400 md:text-4xl">{s.value}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-porcelain-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      <div className="bg-ink">
        <WaveSeparator variant="gentle" fill="ink-soft/35" />
      </div>

      <RevealSection className="bg-ink-soft/35 px-4 py-16 md:px-6 md:py-24">
        <HomeImageGallery items={homeContent?.home_gallery} />
      </RevealSection>

      <div className="bg-ink-soft/35">
        <WaveSeparator variant="crest" fill="ink-soft/35" overlapIntoNext />
      </div>

      <RevealSection
        waveOverlap
        bgImage="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1920&q=80"
        className="px-4 py-20 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Voices</p>
          <h2 className="mt-2 font-display text-3xl text-porcelain md:text-4xl">Guest reflections</h2>
          <p className="mt-3 max-w-xl text-sm text-porcelain-muted">
            Every published note has passed our care team — truth, gently edited for privacy.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3" data-scroll-stagger="0.11">
            {(reviews || []).slice(0, 3).map((rev) => (
              <Card key={rev.id} className="border-white/15 !bg-slate-950/75 p-6 !rounded-2xl backdrop-blur-xl">
                <p className="text-amber-300">{'★'.repeat(rev.rating)}</p>
                <p className="mt-4 text-sm leading-relaxed text-stone-200">{rev.comment}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-stone-400">— Verified guest</p>
              </Card>
            ))}
          </div>
        </div>
      </RevealSection>

      <div className="bg-ink">
        <WaveSeparator variant="gentle" fill="ink-soft" />
      </div>

      <RevealSection className="bg-ink-soft/35 mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Wellness & table</p>
            <h2 className="mt-3 font-display text-3xl text-porcelain md:text-4xl">
              Two floors, one philosophy: <span className="text-gradient-gold">slowness</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-porcelain-muted md:text-base">
              Below street level, hydrotherapy and sound-proofed treatment suites erase the clock. Above, our
              dining salon opens to a terrace of olive trees in pots — a wink of Mediterranean calm in the urban
              core.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-porcelain-muted">
              <li className="flex gap-3">
                <span className="text-gold-500">·</span>
                Seasonal tasting menus & vegan arc available on 48h notice
              </li>
              <li className="flex gap-3">
                <span className="text-gold-500">·</span>
                In-suite dining with the same plates as the restaurant — no compromise
              </li>
              <li className="flex gap-3">
                <span className="text-gold-500">·</span>
                Private sommelier sessions for collectors and curious beginners alike
              </li>
            </ul>
            <Button as={Link} to="/contact" className="mt-8">
              Plan an evening
            </Button>
          </div>
          <div className="order-1 space-y-4 lg:order-2">
            <div className="overflow-hidden rounded-3xl border border-porcelain/15 shadow-[0_28px_70px_rgba(0,0,0,0.18)]">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80"
                alt=""
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="grid grid-cols-2 gap-4" data-scroll-stagger="0.12">
              <div className="overflow-hidden rounded-2xl border border-porcelain/15 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80"
                  alt=""
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden rounded-2xl border border-porcelain/15 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"
                  alt=""
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      <div className="bg-ink-soft/35">
        <WaveSeparator variant="aurum" fill="ink-soft/35" overlapIntoNext />
      </div>

      <RevealSection
        waveOverlap
        bgImage="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1920&q=80"
        className="px-4 py-16 md:px-6 md:py-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 text-center lg:flex-row lg:justify-between lg:text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Accolades</p>
            <h2 className="mt-2 font-display text-2xl text-porcelain md:text-3xl">Recognised, never loud</h2>
            <p className="mt-3 max-w-lg text-sm text-porcelain-muted">
              Condé Nast Traveler Hot List · World Luxury Hotel Awards · LEED Gold core & shell
            </p>
          </div>
          <div
            className="flex flex-wrap justify-center gap-8 text-xs uppercase tracking-[0.25em] text-stone-200 lg:justify-end"
            data-scroll-stagger="0.08"
          >
            <span className="rounded-full border border-white/30 bg-black/40 px-5 py-2 backdrop-blur-sm">
              Forbes Five-Star Spa
            </span>
            <span className="rounded-full border border-white/30 bg-black/40 px-5 py-2 backdrop-blur-sm">
              Wine Spectator Award
            </span>
            <span className="rounded-full border border-white/30 bg-black/40 px-5 py-2 backdrop-blur-sm">
              Accessible luxury certified
            </span>
          </div>
        </div>
      </RevealSection>

      <div className="bg-ink">
        <WaveSeparator variant="aurum" fill="ink" />
      </div>

      <RevealSection className="bg-ink mx-auto max-w-4xl px-4 py-24 text-center md:px-6 md:py-28">
        <h2 className="font-display text-3xl text-porcelain md:text-4xl">Your next chapter begins quietly.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-porcelain-muted md:text-base">
          Speak with our concierge for celebrations, extended stays, or a tailored floor. We reply with the same care
          we bring to your room — precise, warm, and never hurried.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button as={Link} to="/contact">
            Contact concierge
          </Button>
          <Button as={Link} to="/booking" variant="ghost">
            Check availability
          </Button>
        </div>
      </RevealSection>
    </>
  )
}
