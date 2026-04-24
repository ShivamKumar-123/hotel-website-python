import { Helmet } from 'react-helmet-async'
import {
  SITE_NAME_FULL,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  CONTACT_ADDRESS,
  CONTACT_PHONE,
  absoluteUrl,
  getSiteOrigin,
} from '../../config/siteSeo'

/**
 * Hotel structured data for public pages (helps rich results when JS runs).
 */
export default function SiteJsonLd() {
  const origin = getSiteOrigin()
  if (!origin) return null

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: SITE_NAME_FULL,
    description: DEFAULT_DESCRIPTION,
    url: origin,
    image: [absoluteUrl(DEFAULT_OG_IMAGE)],
    telephone: CONTACT_PHONE.replace(/^\+1-/, '+1 '),
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_ADDRESS.streetAddress,
      addressLocality: CONTACT_ADDRESS.addressLocality,
      addressRegion: CONTACT_ADDRESS.addressRegion,
      addressCountry: CONTACT_ADDRESS.addressCountry,
    },
    priceRange: '$$$',
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(payload)}</script>
    </Helmet>
  )
}
