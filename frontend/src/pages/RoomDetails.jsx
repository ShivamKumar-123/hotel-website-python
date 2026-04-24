import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import SEO from '../components/common/SEO'
import Loader from '../components/common/Loader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { fetchRoom } from '../services/api'
import { formatMoney } from '../utils/format'

export default function RoomDetails() {
  const { slug } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchRoom(slug)
        if (!cancelled) setRoom(data)
      } catch {
        if (!cancelled) toast.error('Suite not found.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return <Loader label="Opening the doors…" variant="section" />
  }

  if (!room) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-porcelain-muted">This suite is unavailable.</p>
        <Button as={Link} to="/rooms" className="mt-6">
          Return to collection
        </Button>
      </div>
    )
  }

  const gallery = Array.isArray(room.gallery) ? room.gallery : []

  return (
    <>
      <SEO
        title={room.name}
        description={room.description?.slice(0, 155)}
        path={`/rooms/${slug}`}
        image={room.cover_image}
        keywords={`${room.name}, Aurum Grand suite, luxury hotel room, New York`}
      />
      <article data-scroll="fade-soft" className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div data-scroll-parallax>
            <div className="overflow-hidden rounded-3xl border border-porcelain/15">
              <img
                src={room.cover_image}
                alt=""
                className="aspect-[16/10] w-full object-cover"
                loading="eager"
              />
            </div>
            {gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3" data-scroll-stagger="0.09">
                {gallery.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt=""
                    className="h-28 w-full rounded-xl object-cover md:h-36"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>
          <div data-scroll="slide-left">
            <p className="text-xs uppercase tracking-[0.35em] text-gold-500">Suite</p>
            <h1 className="mt-2 font-display text-4xl text-porcelain">{room.name}</h1>
            <p className="mt-2 text-sm text-porcelain-muted">
              {room.size_sqm} m² · up to {room.max_guests} guests · {room.bed_type}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-wider text-porcelain-muted">
              <li className="rounded-full border border-porcelain/20 px-2.5 py-1">
                {room.has_ac !== false ? 'Air-conditioned' : 'Non-AC (natural ventilation)'}
              </li>
              {room.has_balcony && (
                <li className="rounded-full border border-gold-500/35 bg-gold-500/10 px-2.5 py-1 text-gold-300">
                  Balcony
                </li>
              )}
              <li className="rounded-full border border-porcelain/20 px-2.5 py-1">
                {room.garden_facing ? 'Garden / courtyard outlook' : 'Interior / city outlook'}
              </li>
              <li className="rounded-full border border-porcelain/20 px-2.5 py-1">
                {(room.washroom_type || 'western') === 'indian'
                  ? 'Indian-style washroom'
                  : 'Western-style washroom'}
              </li>
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-porcelain-muted">{room.description}</p>
            <p className="mt-6 font-display text-2xl text-gold-400">
              {formatMoney(room.price_per_night)}
              <span className="text-sm font-sans text-porcelain-muted"> / night</span>
            </p>
            {Array.isArray(room.amenities) && room.amenities.length > 0 && (
              <Card className="mt-8 p-5 !rounded-2xl">
                <p className="text-xs uppercase tracking-[0.2em] text-gold-500">Amenities</p>
                <ul className="mt-3 grid gap-2 text-sm text-porcelain-muted">
                  {room.amenities.map((a) => (
                    <li key={a}>· {a}</li>
                  ))}
                </ul>
              </Card>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button as={Link} to={`/booking?room=${room.id}`}>
                Reserve this suite
              </Button>
              <Button as={Link} to="/rooms" variant="ghost">
                Back to collection
              </Button>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
