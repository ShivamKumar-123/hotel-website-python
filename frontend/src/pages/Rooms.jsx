import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import SEO from '../components/common/SEO'
import Loader from '../components/common/Loader'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import AppPagination from '../components/common/AppPagination'
import LazyRoomImage from '../components/rooms/LazyRoomImage'
import { fetchRooms } from '../services/api'
import { formatMoney } from '../utils/format'
import { cn } from '../utils/cn'

const PAGE_SIZE = 9

const empty = {
  min_price: '',
  max_price: '',
  bed_type: '',
  search: '',
  has_ac: '',
  has_balcony: '',
  garden_facing: '',
  washroom_type: '',
  min_guests: '',
  max_guests: '',
  guests_exact: '',
}

function RoomBadges({ room }) {
  const tags = []
  if (room.has_ac) tags.push('AC')
  else tags.push('Non-AC')
  if (room.has_balcony) tags.push('Balcony')
  if (room.garden_facing) tags.push('Garden')
  const wash = room.washroom_type || 'western'
  tags.push(wash === 'indian' ? 'Indian bath' : 'Western bath')
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-full border border-porcelain/15 bg-porcelain/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-wider text-porcelain-muted"
        >
          {t}
        </span>
      ))}
    </div>
  )
}

export default function Rooms() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(empty)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const skipScrollRef = useRef(true)

  const params = useMemo(() => {
    const p = {}
    if (filters.min_price) p.min_price = filters.min_price
    if (filters.max_price) p.max_price = filters.max_price
    if (filters.bed_type) p.bed_type = filters.bed_type
    if (filters.search) p.search = filters.search
    if (filters.has_ac === 'true' || filters.has_ac === 'false') p.has_ac = filters.has_ac
    if (filters.has_balcony === 'true' || filters.has_balcony === 'false') p.has_balcony = filters.has_balcony
    if (filters.garden_facing === 'true' || filters.garden_facing === 'false') {
      p.garden_facing = filters.garden_facing
    }
    if (filters.washroom_type) p.washroom_type = filters.washroom_type
    if (filters.min_guests) p.min_guests = filters.min_guests
    if (filters.max_guests) p.max_guests = filters.max_guests
    if (filters.guests_exact) p.guests = filters.guests_exact
    return p
  }, [filters])

  const paramsKey = useMemo(() => JSON.stringify(params), [params])

  useEffect(() => {
    setPage(1)
  }, [paramsKey])

  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const data = await fetchRooms({ ...params, page, page_size: PAGE_SIZE })
        if (cancelled) return
        const list = data.results ?? data
        setItems(Array.isArray(list) ? list : [])
        setTotalCount(typeof data.count === 'number' ? data.count : list.length)
      } catch {
        if (!cancelled) toast.error('Unable to load suites.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [params, page])

  function clearFilters() {
    setFilters(empty)
  }

  const hasActive = Object.values(filters).some((v) => v !== '' && v != null)

  const filterForm = (
    <div className="space-y-5 rounded-2xl border border-porcelain/15 bg-porcelain/5 p-4 md:p-5">
      <div className="border-b border-porcelain/10 pb-3">
        <p className="font-display text-lg text-porcelain">Refine</p>
        <p className="mt-1 text-xs text-porcelain-muted">Narrow the collection to your rhythm.</p>
      </div>
      <Input
        label="Search"
        placeholder="Name or description"
        value={filters.search}
        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
      />
      <Input
        label="Min rate / night"
        type="number"
        min="0"
        value={filters.min_price}
        onChange={(e) => setFilters((f) => ({ ...f, min_price: e.target.value }))}
      />
      <Input
        label="Max rate / night"
        type="number"
        min="0"
        value={filters.max_price}
        onChange={(e) => setFilters((f) => ({ ...f, max_price: e.target.value }))}
      />
      <Select
        label="Bed"
        value={filters.bed_type}
        onChange={(e) => setFilters((f) => ({ ...f, bed_type: e.target.value }))}
      >
        <option value="">Any</option>
        <option value="King">King</option>
        <option value="Queen">Queen</option>
        <option value="Twin">Twin</option>
      </Select>
      <Select
        label="Climate"
        value={filters.has_ac}
        onChange={(e) => setFilters((f) => ({ ...f, has_ac: e.target.value }))}
      >
        <option value="">Any</option>
        <option value="true">Air-conditioned</option>
        <option value="false">Non-AC</option>
      </Select>
      <Select
        label="Balcony"
        value={filters.has_balcony}
        onChange={(e) => setFilters((f) => ({ ...f, has_balcony: e.target.value }))}
      >
        <option value="">Any</option>
        <option value="true">With balcony</option>
        <option value="false">No balcony</option>
      </Select>
      <Select
        label="View"
        value={filters.garden_facing}
        onChange={(e) => setFilters((f) => ({ ...f, garden_facing: e.target.value }))}
      >
        <option value="">Any</option>
        <option value="true">Garden / courtyard side</option>
        <option value="false">Not garden side</option>
      </Select>
      <Select
        label="Washroom"
        value={filters.washroom_type}
        onChange={(e) => setFilters((f) => ({ ...f, washroom_type: e.target.value }))}
      >
        <option value="">Any</option>
        <option value="western">Western</option>
        <option value="indian">Indian</option>
      </Select>
      <Input
        label="Min. guest capacity"
        type="number"
        min="1"
        placeholder="Sleeps at least"
        value={filters.min_guests}
        onChange={(e) => setFilters((f) => ({ ...f, min_guests: e.target.value }))}
      />
      <Input
        label="Max. guest capacity"
        type="number"
        min="1"
        placeholder="Sleeps at most"
        value={filters.max_guests}
        onChange={(e) => setFilters((f) => ({ ...f, max_guests: e.target.value }))}
      />
      <Input
        label="Exact capacity"
        type="number"
        min="1"
        placeholder="Max guests ="
        value={filters.guests_exact}
        onChange={(e) => setFilters((f) => ({ ...f, guests_exact: e.target.value }))}
      />
      {hasActive && (
        <button
          type="button"
          className="w-full rounded-xl border border-porcelain/20 py-2.5 text-xs uppercase tracking-widest text-gold-500/90 transition hover:border-gold-500/40 hover:text-gold-400"
          onClick={clearFilters}
        >
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <>
      <SEO
        title="Suites & Rooms"
        description="Explore Aurum Grand suites — filter by climate, balcony, garden outlook, bath type, and guest capacity."
        path="/rooms"
        keywords="hotel suites, luxury rooms, New York hotel rooms, Aurum Grand suites, book suite"
      />
      <div className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <header data-scroll="fade-up" className="mb-10 border-b border-porcelain/10 pb-8 lg:mb-12 lg:pb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-500">Residences</p>
          <h1 className="mt-3 font-display text-4xl text-porcelain md:text-5xl">Suites & chambers</h1>
          <p className="mt-4 max-w-2xl text-sm text-porcelain-muted">
            Use the panel on the left to filter. Results load in pages — images appear as you scroll for a
            lighter page.
          </p>
        </header>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          <aside className="scrollbar-themed w-full shrink-0 lg:sticky lg:top-24 lg:w-[min(100%,280px)] lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1 xl:w-[300px]">
            {filterForm}
          </aside>

          <div className="min-w-0 flex-1">
            {loading ? (
              <Loader label="Gathering availability…" variant="section" />
            ) : (
              <>
                {(items || []).length === 0 ? (
                  <p className="rounded-2xl border border-porcelain/15 bg-porcelain/5 px-6 py-16 text-center text-sm text-porcelain-muted">
                    No suites match these filters. Try relaxing one of the criteria.
                  </p>
                ) : (
                  <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3" data-scroll-stagger="0.1">
                    {(items || []).map((room, index) => (
                      <Link key={room.id} to={`/rooms/${room.slug}`} className={cn('group block')}>
                        <Card className="h-full !rounded-2xl">
                          <div className="relative aspect-[5/3] overflow-hidden rounded-t-2xl">
                            <LazyRoomImage
                              src={room.cover_image}
                              alt={room.name}
                              priority={index < 3}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />
                            {room.is_featured && (
                              <span className="absolute left-3 top-3 rounded-full bg-gold-500/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink">
                                Curated
                              </span>
                            )}
                          </div>
                          <div className="space-y-3 p-5">
                            <h2 className="font-display text-xl text-porcelain">{room.name}</h2>
                            <RoomBadges room={room} />
                            <p className="text-xs uppercase tracking-[0.2em] text-gold-500">
                              {formatMoney(room.price_per_night)} / night
                            </p>
                            <p className="text-sm text-porcelain-muted">
                              Up to {room.max_guests} guests · {room.bed_type}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                <AppPagination
                  className="mt-12"
                  page={page}
                  totalCount={totalCount}
                  pageSize={PAGE_SIZE}
                  loading={loading}
                  onPageChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
