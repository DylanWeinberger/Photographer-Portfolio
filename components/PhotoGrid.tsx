/**
 * PhotoGrid Component
 *
 * Fine art photography grid with generous spacing and subtle presentation.
 * Design philosophy:
 * - Larger gaps for breathing room
 * - 2 columns max for impact (not 3)
 * - Subtle borders on images
 * - Slow hover effects
 *
 * Supports two layouts:
 * - rows2: Clean 2-column grid with equal widths and heights
 * - masonry: True masonry layout where items pack naturally by height
 */

'use client'

import type { Photo } from '@/types/sanity'
import ProtectedImage from './ProtectedImage'
import { useLightbox } from '@/contexts/LightboxContext'
import Masonry from 'react-masonry-css'

interface PhotoGridProps {
  photos: Photo[]
  layout?: 'rows2' | 'masonry'
}

export default function PhotoGrid({ photos, layout = 'rows2' }: PhotoGridProps) {
  const { openLightbox } = useLightbox()

  // Handle empty state
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6">
          <svg
            className="w-8 h-8 text-[var(--subtle-text)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="font-playfair text-2xl font-normal text-[var(--foreground)] mb-2">
          No photos yet
        </h3>
        <p className="text-[var(--subtle-text)] text-sm">
          Add some photos in Sanity Studio to see them here.
        </p>
      </div>
    )
  }

  // Render based on layout type
  if (layout === 'masonry') {
    

    return (
      <>
            <div className="masonry-grid">
      {photos.map((photo, index) => (
        <ProtectedImage
          key={photo._id}
          photo={photo}
          priority={index < 2} // Prioritize loading first 2 images
          onClick={() => openLightbox(photos, index)}
        />
      ))}
    </div>
      </>
    )
  }

  // Default: rows2 layout (2-column grid)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20">
      {photos.map((photo, index) => (
        <ProtectedImage
          key={photo._id}
          photo={photo}
          priority={index < 2} // Prioritize loading first 2 images
          onClick={() => openLightbox(photos, index)}
        />
      ))}
    </div>
  )
}
