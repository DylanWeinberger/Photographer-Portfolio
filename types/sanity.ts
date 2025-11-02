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
