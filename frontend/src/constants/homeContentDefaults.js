/**
 * Built-in hero + gallery when API returns empty arrays (or request fails).
 * Title fields are plain strings; Home maps titleHighlight for gradient span.
 */
export const DEFAULT_HERO_CAROUSEL = [
  {
    id: 'slide-arrival',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80',
    kicker: 'Private · Refined · Serene',
    title: 'Where light rests on linen',
    titleHighlight: 'linen',
    subtitle:
      'An intimate tower residence with curated art, a whisper-quiet spa, and suites shaped for slow mornings.',
    primaryLabel: 'View suites',
    primaryTo: '/rooms',
    secondaryLabel: 'Reserve your stay',
    secondaryTo: '/booking',
  },
  {
    id: 'slide-spa',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80',
    kicker: 'Sanctuary',
    title: 'Still water, slow breath',
    titleHighlight: 'breath',
    subtitle:
      'Our sub-level thermal circuit, hammam, and treatment ateliers are reserved for a handful of guests each day.',
    primaryLabel: 'Speak with concierge',
    primaryTo: '/contact',
    secondaryLabel: 'Explore rooms',
    secondaryTo: '/rooms',
  },
  {
    id: 'slide-table',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80',
    kicker: 'The table',
    title: 'Evenings in low gold',
    titleHighlight: 'gold',
    subtitle:
      'Chef’s tasting menus, rare wines, and candlelit corners — composed like a private dinner party above the city.',
    primaryLabel: 'Dining & events',
    primaryTo: '/contact',
    secondaryLabel: 'Book a suite',
    secondaryTo: '/booking',
  },
  {
    id: 'slide-sky',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80',
    kicker: 'Sky lounge',
    title: 'Dawn belongs to you',
    titleHighlight: 'you',
    subtitle:
      'Floor-to-ceiling glass, a silent espresso bar, and a horizon line that stretches the day open.',
    primaryLabel: 'Join as guest',
    primaryTo: '/register',
    secondaryLabel: 'Member sign in',
    secondaryTo: '/login',
  },
]

/** Bento grid presets by index (md+); first 8 match original design. */
export const GALLERY_LAYOUT_PRESETS = [
  { area: '1 / 1 / 3 / 3', minH: 'min-h-[200px] md:min-h-[280px]' },
  { area: '1 / 3 / 2 / 4', minH: 'min-h-[120px] md:min-h-[140px]' },
  { area: '1 / 4 / 2 / 5', minH: 'min-h-[120px] md:min-h-[140px]' },
  { area: '2 / 3 / 3 / 5', minH: 'min-h-[120px] md:min-h-[140px]' },
  { area: '3 / 1 / 5 / 2', minH: 'min-h-[200px] md:min-h-[220px]' },
  { area: '3 / 2 / 4 / 3', minH: 'min-h-[100px] md:min-h-[120px]' },
  { area: '4 / 2 / 5 / 3', minH: 'min-h-[100px] md:min-h-[120px]' },
  { area: '3 / 3 / 5 / 5', minH: 'min-h-[200px] md:min-h-[240px]' },
]

export const DEFAULT_HOME_GALLERY = [
  {
    id: 'salon',
    src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1400&q=85',
    caption: 'Evening salon',
  },
  {
    id: 'lobby',
    src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&q=85',
    caption: 'Arrival hall',
  },
  {
    id: 'suite',
    src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85',
    caption: 'Corner suite',
  },
  {
    id: 'pool',
    src: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&q=85',
    caption: 'Vitality pool',
  },
  {
    id: 'spa',
    src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=85',
    caption: 'Thermal suite',
  },
  {
    id: 'dining',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=85',
    caption: 'Chef’s table',
  },
  {
    id: 'terrace',
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=85',
    caption: 'Sky terrace',
  },
  {
    id: 'detail',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85',
    caption: 'Private residence',
  },
]

export function mergeGalleryWithLayouts(items) {
  const list = Array.isArray(items) && items.length > 0 ? items : DEFAULT_HOME_GALLERY
  return list.slice(0, 12).map((it, i) => ({
    id: String(it.id || `g-${i}`),
    src: it.src,
    caption: it.caption || '',
    area: it.area || GALLERY_LAYOUT_PRESETS[i]?.area,
    minH: it.minH || GALLERY_LAYOUT_PRESETS[i]?.minH || 'min-h-[120px] md:min-h-[140px]',
  }))
}
