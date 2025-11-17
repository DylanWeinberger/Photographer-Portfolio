import { Metadata } from 'next'
import { urlFor } from '@/sanity/lib/image'
import type { Photo, SanityImage } from '@/types/sanity'

/**
 * METADATA UTILITIES
 *
 * Centralized configuration and utilities for SEO metadata across all pages.
 * Follows Next.js 15+ App Router metadata API best practices.
 */

// Site configuration
export const siteConfig = {
  name: 'Henry Jaffe Photography',
  description: 'Professional photography portfolio showcasing fine art and editorial work',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://henryjaffephotography.com',
  ogImage: '/og-default.jpg', // Default OG image fallback
  twitterHandle: '@henryjaffe', // Update with actual Twitter handle if available
}

/**
 * Generate Open Graph image URL from a Sanity image
 * Optimized for social media sharing (1200x630px recommended)
 */
export function getOGImageUrl(image: SanityImage | Photo['image']): string {
  try {
    return urlFor(image)
      .width(1200)
      .height(630)
      .fit('crop')
      .quality(85)
      .auto('format')
      .url()
  } catch (error) {
    console.error('Error generating OG image URL:', error)
    return `${siteConfig.url}${siteConfig.ogImage}`
  }
}

/**
 * Generate canonical URL for a page
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash and ensure path starts with /
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '')
  return `${siteConfig.url}${cleanPath}`
}

/**
 * Create base metadata that's shared across all pages
 * Can be extended with page-specific metadata
 */
export function createMetadata({
  title,
  description,
  image,
  path = '/',
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
}: {
  title: string
  description: string
  image?: string
  path?: string
  noIndex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}): Metadata {
  const canonicalUrl = getCanonicalUrl(path)
  const ogImage = image || `${siteConfig.url}${siteConfig.ogImage}`

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale: 'en_US',
      url: canonicalUrl,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: siteConfig.twitterHandle,
    },
  }

  // Add article-specific metadata
  if (type === 'article' && (publishedTime || modifiedTime)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
    }
  }

  // Add robots noindex if needed
  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    }
  }

  return metadata
}

/**
 * Generate structured data (JSON-LD) for a photo
 * Helps search engines understand the content
 */
export function generatePhotoJsonLd(photo: Photo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Photograph',
    name: photo.title,
    description: photo.caption || photo.altText || photo.title,
    ...(photo.location && { contentLocation: photo.location }),
    ...(photo.takenAt && { dateCreated: photo.takenAt }),
    creator: {
      '@type': 'Person',
      name: siteConfig.name,
    },
  }
}

/**
 * Generate structured data for the photographer (Person/Organization)
 */
export function generatePhotographerJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: 'Photographer',
    ...(siteConfig.twitterHandle && {
      sameAs: [`https://twitter.com/${siteConfig.twitterHandle.replace('@', '')}`],
    }),
  }
}

/**
 * Generate structured data for an image gallery
 */
export function generateImageGalleryJsonLd(photos: Photo[], name: string, description?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name,
    ...(description && { description }),
    creator: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    image: photos.slice(0, 10).map((photo) => ({
      '@type': 'ImageObject',
      name: photo.title,
      description: photo.caption || photo.altText || photo.title,
      ...(photo.location && { contentLocation: photo.location }),
    })),
  }
}
