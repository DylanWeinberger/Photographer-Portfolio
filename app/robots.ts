import { MetadataRoute } from 'next'

/**
 * ROBOTS.TXT GENERATION
 *
 * Tells search engines which pages to crawl and index.
 * Next.js will serve this at /robots.txt
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://henryjaffephotography.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // Don't crawl API routes
          '/sanity/',        // Don't crawl Sanity Studio
          '/_next/',         // Don't crawl Next.js internals
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
