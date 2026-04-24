import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'
import RevealSection from '../components/common/RevealSection'
import WaveSeparator from '../components/common/WaveSeparator'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const PILLARS = [
  {
    title: 'Quiet luxury',
    text: 'We believe true luxury is the absence of noise — visual, acoustic, and social. Every corridor and suite is tuned for calm.',
  },
  {
    title: 'Anticipatory care',
    text: 'Our team trains in observation, not interruption. Preferences are remembered across stays, without a single reminder from you.',
  },
  {
    title: 'Honest materials',
    text: 'Stone, oak, brass, and linen age with dignity. We source slowly and maintain obsessively so the hotel feels lived-in, never tired.',
  },
]

const MILESTONES = [
  { year: '1896', label: 'Meridian House opens as a private club for artists and patrons of the city.' },
  { year: '1962', label: 'The tower addition brings the first glass curtain wall on the avenue — still preserved today.' },
  { year: '2018', label: 'Aurum Grand debuts after a five-year restoration led by atelier architects and master craftspeople.' },
  { year: 'Today', label: 'A living residence for guests who treat travel as a form of editing — life, reduced to what matters.' },
]

/**
 * Brand story, values, and heritage — public About page.
 */
export default function About() {
  return (
    <>
      <SEO
        title="About Aurum Grand"
        description="Heritage, philosophy, and the people behind Aurum Grand — a luxury hotel built on quiet craft, honest materials, and anticipatory service."
        path="/about"
        keywords="about Aurum Grand, luxury hotel story, boutique hotel heritage, New York"
      />

      <header className="relative overflow-hidden px-4 pb-16 pt-8 md:px-6 md:pb-24 md:pt-12">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,98,0.2)_0%,transparent_70%)] blur-3xl" />
        </div>
        <div data-scroll="scale" className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-500">Our story</p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-porcelain md:text-6xl">
            Built for <span className="text-gradient-gold">stillness</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-porcelain-muted md:text-base">
            Aurum Grand is a house first and a hotel second — a sequence of rooms where light, texture, and human attention
            align. We host a small number of guests so that service never becomes a script.
          </p>
        </div>
      </header>

      <div className="bg-ink">
        <WaveSeparator variant="aurum" fill="ink" overlapIntoNext />
      </div>

      <RevealSection
        waveOverlap
        bgImage="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1920&q=80"
        className="px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-3xl border border-white/25 shadow-[0_40px_100px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
            <img
              src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1000&q=80"
              alt=""
              className="aspect-[5/4] w-full object-cover md:aspect-auto md:min-h-[380px]"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl text-porcelain md:text-4xl">A living landmark</h2>
            <p className="mt-5 text-sm leading-relaxed text-porcelain-muted md:text-base">
              The building began as a meeting place for painters, composers, and collectors — minds who understood that
              beauty requires patience. When we restored the property, we stripped away decades of cosmetic layers to
              recover original ironwork, terrazzo, and oak parquetry.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-porcelain-muted md:text-base">
              New interventions — the spa circuit, the sky lounge, the private dining salon — were designed to feel like
              they had always belonged here: restrained, warm, and unafraid of empty space.
            </p>
          </div>
        </div>
      </RevealSection>

      <div className="bg-ink">
        <WaveSeparator variant="crest" fill="ink-soft" />
      </div>

      <RevealSection className="mx-auto max-w-6xl bg-ink-soft/40 px-4 py-16 md:px-6 md:py-24">
        <h2 className="text-center font-display text-3xl text-porcelain md:text-4xl">Heritage in motion</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-porcelain-muted">
          Four moments that trace how the house became Aurum Grand.
        </p>
        <div className="mt-14 space-y-10 border-l border-gold-500/25 pl-8 md:pl-12" data-scroll-stagger="0.14">
          {MILESTONES.map((m) => (
            <div key={m.year} className="relative">
              <span className="absolute -left-[calc(2rem+5px)] top-1 flex h-3 w-3 -translate-x-px rounded-full border-2 border-gold-500 bg-porcelain md:-left-[calc(3rem+5px)]" />
              <p className="font-display text-xl text-gold-400">{m.year}</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-porcelain-muted">{m.label}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      <div className="bg-ink-soft/40">
        <WaveSeparator variant="ripple" fill="ink-soft/40" overlapIntoNext />
      </div>

      <RevealSection
        waveOverlap
        bgImage="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80"
        className="px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-display text-3xl text-porcelain md:text-4xl">What we stand for</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-porcelain-muted">
            Three pillars — practical, never printed on a keycard, always visible in how we move through the day.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3" data-scroll-stagger>
            {PILLARS.map((p) => (
              <Card key={p.title} className="border-white/20 !bg-slate-950/75 p-8 !rounded-2xl backdrop-blur-md">
                <h3 className="font-display text-xl text-porcelain">{p.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-porcelain-muted">{p.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </RevealSection>

      <div className="bg-ink">
        <WaveSeparator variant="aurum" fill="ink-soft" />
      </div>

      <RevealSection className="mx-auto max-w-6xl bg-ink-soft/35 px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-display text-3xl text-porcelain md:text-4xl">Architecture & art</h2>
            <p className="mt-5 text-sm leading-relaxed text-porcelain-muted md:text-base">
              The public floors host a rotating collection of contemporary works chosen for dialogue with the building’s
              Beaux-Arts bones — never for spectacle. Suites feature a single large piece per room so the eye can rest.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-porcelain-muted md:text-base">
              Natural light is our primary material: south-facing glass is treated to soften glare; north light fills
              the spa and treatment rooms like a studio.
            </p>
          </div>
          <div className="order-1 grid grid-cols-2 gap-3 lg:order-2">
            <div className="overflow-hidden rounded-2xl border border-porcelain/15 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80"
                alt=""
                className="aspect-[3/4] h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-8 space-y-3">
              <div className="overflow-hidden rounded-2xl border border-porcelain/15 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80"
                  alt=""
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden rounded-2xl border border-porcelain/15 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80"
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
        <WaveSeparator variant="crest" fill="ink-soft/35" overlapIntoNext />
      </div>

      <RevealSection
        waveOverlap
        bgImage="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80"
        className="px-4 py-16 md:px-6 md:py-20"
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-amber-400/30 bg-slate-950/80 p-8 text-center shadow-xl backdrop-blur-md md:p-12">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Responsibility</p>
          <h2 className="mt-3 font-display text-2xl text-porcelain md:text-3xl">Quiet sustainability</h2>
          <p className="mt-4 text-sm leading-relaxed text-porcelain-muted md:text-base">
            LEED Gold core, refillable bath amenities, a kitchen that sources within 200 miles where season allows, and
            linen refreshed on request rather than by default. We measure impact the same way we measure service — in
            details no one should have to ask for.
          </p>
        </div>
      </RevealSection>

      <div className="bg-ink">
        <WaveSeparator variant="aurum" fill="ink" />
      </div>

      <RevealSection className="mx-auto max-w-3xl bg-ink px-4 py-20 text-center md:px-6 md:py-28">
        <h2 className="font-display text-3xl text-porcelain md:text-4xl">Visit the house</h2>
        <p className="mt-4 text-sm text-porcelain-muted md:text-base">
          Whether you are planning a first stay or a return, our concierge will answer with the same patience we bring to
          the lobby each morning.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button as={Link} to="/rooms">
            View suites
          </Button>
          <Button as={Link} to="/contact" variant="ghost">
            Write to us
          </Button>
        </div>
      </RevealSection>
    </>
  )
}
