import { urlFor } from '@/sanity/lib/image'
import type { SanityImage } from '@/types/sanity'

/**
 * Image Builder Helpers for Sanity Images
 *
 * These helpers use Sanity's image CDN to automatically:
 * - Resize images to appropriate dimensions
 * - Convert to modern formats (WebP, AVIF)
 * - Apply quality settings
 * - Generate blur placeholders
 *
 * Quality Strategy:
 * - High (85): Hero images, lightbox, featured work, profile photos
 * - Medium (75): Grid thumbnails, general display
 * - Low (60): Backgrounds, small images
 */

// Quality settings optimized for different contexts
const qualityMap = {
  high: 85,    // Hero, lightbox, profile - needs excellent quality
  medium: 75,  // Grid thumbnails - good balance of quality/size
  low: 60,     // Backgrounds, small images - acceptable quality
} as const

/**
 * Generate optimized thumbnail URL for grid views
 * @param source - Sanity image object
 * @param quality - Quality level from photo settings
 * @returns Optimized image URL
 */
export function getThumbnailUrl(
  source: SanityImage,
  quality: 'high' | 'medium' | 'low' = 'medium'
): string {
  return urlFor(source)
    .width(600)
    .height(600)
    .fit('crop')
    .quality(qualityMap[quality])
    .auto('format') // Automatically serve WebP/AVIF when supported
    .url() || ''
}

/**
 * Generate blur placeholder for loading states
 * @param source - Sanity image object
 * @returns Low quality blurred image URL for placeholder
 */
export function getBlurDataURL(source: SanityImage): string {
  return urlFor(source)
    .width(20)
    .height(20)
    .quality(20)
    .blur(50)
    .url() || ''
}

/**
 * Generate full-size image URL
 * @param source - Sanity image object
 * @param quality - Quality level from photo settings
 * @param maxWidth - Maximum width in pixels
 * @returns Optimized image URL
 */
export function getFullImageUrl(
  source: SanityImage,
  quality: 'high' | 'medium' | 'low' = 'high',
  maxWidth: number = 2000
): string {
  return urlFor(source)
    .width(maxWidth)
    .quality(qualityMap[quality])
    .auto('format')
    .url() || ''
}

/**
 * Get responsive image URLs for srcset
 * @param source - Sanity image object
 * @param quality - Quality level from photo settings
 * @returns Object with URLs for different viewport sizes
 */
export function getResponsiveImageUrls(
  source: SanityImage,
  quality: 'high' | 'medium' | 'low' = 'medium'
) {
  return {
    small: urlFor(source).width(400).quality(qualityMap[quality]).auto('format').url() || '',
    medium: urlFor(source).width(800).quality(qualityMap[quality]).auto('format').url() || '',
    large: urlFor(source).width(1200).quality(qualityMap[quality]).auto('format').url() || '',
    xlarge: urlFor(source).width(1600).quality(qualityMap[quality]).auto('format').url() || '',
  }
}
