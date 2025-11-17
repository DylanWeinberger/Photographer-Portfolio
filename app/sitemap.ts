import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

/**
 * DYNAMIC SITEMAP GENERATION
 *
 * Generates a sitemap.xml file for search engines.
 * Includes all static pages and dynamic routes (tags).
 *
 * Next.js will serve this at /sitemap.xml
 */

interface TagSlug {
  slug: string
  _updatedAt: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://henryjaffephotography.com'

  // Fetch all tag slugs for dynamic routes
  const tags = await client.fetch<TagSlug[]>(
    groq`*[_type == "tag"] { "slug": slug.current, _updatedAt }`
  )

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/photos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic tag pages
  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${baseUrl}/tag/${tag.slug}`,
    lastModified: new Date(tag._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...tagPages]
}
