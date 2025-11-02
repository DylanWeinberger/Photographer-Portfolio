/**
 * TypeScript types for Sanity CMS data
 *
 * These interfaces match our Sanity schema definitions
 * and provide type safety when working with CMS data.
 */

// Tag reference type
export interface TagReference {
  _ref: string
  _type: 'reference'
}

// Image asset type from Sanity
export interface SanityImageAsset {
  _ref: string
  _type: 'reference'
}

// Image type with asset reference
export interface SanityImage {
  asset: SanityImageAsset
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

// Photo document type matching our Sanity schema
export interface Photo {
  _id: string
  _type: 'photo'
  _createdAt: string
  title: string
  image: SanityImage
  altText?: string // Optional, falls back to title
  caption?: string
  displayQuality: 'high' | 'medium' | 'low'
  watermarkEnabled: boolean
  featured: boolean
  tags?: TagReference[]
  takenAt?: string
  location?: string
}

// Tag document type
export interface Tag {
  _id: string
  _type: 'tag'
  name: string
  slug: {
    current: string
  }
  description?: string
}

/**
 * Block Content Types
 *
 * Sanity uses "Portable Text" (block content) for rich text fields.
 * These blocks represent paragraphs, headings, and formatted text.
 */

// Individual text span within a block
export interface Span {
  _key: string
  _type: 'span'
  marks: string[] // e.g., ['strong', 'em'] for bold/italic
  text: string
}

// Block content (rich text) type - represents a paragraph or heading
export interface Block {
  _key: string
  _type: 'block'
  children: Span[]
  markDefs: any[] // Link definitions, annotations, etc.
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote'
}

/**
 * Homepage Document Type
 *
 * Singleton document that contains all homepage content.
 * This interface matches the homepage schema defined in Sanity.
 */
export interface Homepage {
  _id: string
  _type: 'homepage'

  // Hero section - Large banner at top of page
  hero: {
    headline: string
    subheadline?: string
    // heroPhotos are dereferenced (->) in GROQ, so we get full Photo objects
    heroPhotos: Photo[]
    showCTA: boolean
    ctaText?: string
    ctaLink?: string
  }

  // Featured photos section configuration
  featuredSection: {
    heading: string
    description?: string
  }

  // About section - Information about the photographer
  about: {
    heading: string
    bio: Block[] // Rich text content using Portable Text format
    profileImage: SanityImage
  }
}
