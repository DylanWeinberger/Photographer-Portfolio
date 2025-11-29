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

// Image asset type from Sanity (reference form)
export interface SanityImageAssetRef {
  _ref: string
  _type: 'reference'
}

// Image asset type from Sanity (expanded/dereferenced form)
export interface SanityImageAssetExpanded {
  _id: string
  url: string
  metadata: {
    dimensions: {
      width: number
      height: number
      aspectRatio: number
    }
  }
}

// Image type with asset reference (for schemas/mutations)
export interface SanityImage {
  asset: SanityImageAssetRef
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

// Image type with expanded asset (for queries with dimensions)
export interface SanityImageExpanded {
  asset: SanityImageAssetExpanded
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
  image: SanityImageExpanded
  altText?: string // Optional, falls back to title
  caption?: string
  displayQuality: 'high' | 'medium' | 'low'
  watermarkEnabled: boolean
  featured: boolean
  tags?: TagReference[]
  takenAt?: string
  location?: string
}


/**
 * Tag Document Type
 *
 * Tags serve dual purposes:
 * 1. Photo organization (tagging system)
 * 2. Portfolio pages (automatically generated at /tag/[slug])
 *
 * This combines the simplicity of tag-based organization with the flexibility
 * of custom page styling and content.
 */
export interface Tag {
  _id: string
  _type: 'tag'
  // Basic info (required)
  name: string
  slug: {
    current: string
  }
  // Page display settings (optional)
  displayName?: string
  headerText?: string
  subheader?: string
  description?: string
  heroImage?: Photo
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

/**
 * Navigation Document Type
 *
 * Singleton document that contains the main navigation menu.
 * Menu items can link to internal pages, external URLs, or home.
 */
export interface Navigation {
  _id: string
  _type: 'navigation'
  title: string
  menuItems: MenuItem[]
}

// Child menu item in navigation dropdown
export interface ChildMenuItem {
  _key: string
  label: string
  linkType: 'home' | 'internal' | 'external'
  internalLink?: string
  externalUrl?: string
  openInNewTab?: boolean
}

// Individual menu item in navigation
export interface MenuItem {
  _key: string
  label: string
  linkType: 'home' | 'internal' | 'external' | 'parent'
  internalLink?: string
  externalUrl?: string
  openInNewTab?: boolean
  children?: ChildMenuItem[]
}

/**
 * Settings Document Type
 *
 * Singleton document that contains site-wide configuration.
 * Includes branding, social links, and footer settings.
 */
export interface Settings {
  _id: string
  _type: 'settings'
  siteTitle: string
  siteDescription?: string
  logo?: SanityImage & {
    alt: string
  }
  socialLinks?: {
    flickr?: string
    email?: string
  }
  footer?: {
    copyrightText?: string
    additionalText?: string
    showSocialLinks: boolean
  }
}

