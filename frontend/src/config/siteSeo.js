/** Public marketing name */
export const SITE_NAME = 'Aurum Grand'

export const SITE_NAME_FULL = 'Aurum Grand Hotel'

export const DEFAULT_DESCRIPTION =
  'A refined urban sanctuary — bespoke suites, intuitive concierge service, spa, dining, and timeless design in the heart of New York.'

/** Stable OG / Twitter preview (luxury lobby — CDN). */
export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=630&fit=crop&q=85'

export const DEFAULT_KEYWORDS =
  'luxury hotel, boutique hotel, New York hotel, suites, spa hotel, fine dining, Aurum Grand, book hotel, concierge'

export const CONTACT_ADDRESS = {
  streetAddress: '128 Meridian Avenue',
  addressLocality: 'New York',
  addressRegion: 'NY',
  addressCountry: 'US',
}

export const CONTACT_PHONE = '+1-212-555-0123'

export function getSiteOrigin() {
  if (typeof window !== 'undefined') return window.location.origin
  const env = import.meta.env.VITE_SITE_URL
  if (typeof env === 'string' && env.startsWith('http')) return env.replace(/\/$/, '')
  return ''
}

export function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return ''
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl
  const origin = getSiteOrigin()
  if (!origin) return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${origin}${path}`
}
