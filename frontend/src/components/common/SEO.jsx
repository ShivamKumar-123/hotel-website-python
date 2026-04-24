import { Helmet } from 'react-helmet-async'
import {
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_KEYWORDS,
  absoluteUrl,
  getSiteOrigin,
} from '../../config/siteSeo'

/**
 * Per-route SEO: title, description, canonical, Open Graph, Twitter, robots.
 */
export default function SEO({
  title,
  description,
  path = '/',
  keywords,
  /** Absolute image URL for sharing (e.g. suite hero). */
  image,
  /** Staff / private surfaces — ask crawlers not to index. */
  noindex = false,
  ogType = 'website',
}) {
  const site = SITE_NAME
  const fullTitle = title ? `${title} · ${site}` : `${site} · Luxury hotel`
  const desc = description || DEFAULT_DESCRIPTION
  const origin = getSiteOrigin()
  const url = origin ? `${origin}${path.startsWith('/') ? path : `/${path}`}` : ''
  const ogImage = absoluteUrl(image || DEFAULT_OG_IMAGE)
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  const kw = keywords || DEFAULT_KEYWORDS

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={kw} />
      <meta name="author" content={site} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      {url ? <link rel="canonical" href={url} /> : null}

      <meta property="og:site_name" content={site} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {url ? <meta property="og:url" content={url} /> : null}
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_US" />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      {ogImage ? <meta property="og:image:width" content="1200" /> : null}
      {ogImage ? <meta property="og:image:height" content="630" /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

      <meta name="theme-color" content="#070707" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#f5ebd8" media="(prefers-color-scheme: light)" />
    </Helmet>
  )
}
