'use client'

import type { Photo } from '@/types/sanity'
import ProtectedImage from './ProtectedImage'
import { useLightbox } from '@/contexts/LightboxContext'

interface PhotoGridProps {
  photos: Photo[]
}

/**
 * PhotoGrid Component
 *
 * Displays photos in a responsive grid layout:
 * - 1 column on mobile
 * - 2 columns on tablet
 * - 3 columns on desktop
 */
export default function PhotoGrid({ photos }: PhotoGridProps) {
  const { openLightbox } = useLightbox()
  // Handle empty state
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
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
        <h3 className="text-lg font-medium text-gray-900 mb-1">No photos yet</h3>
        <p className="text-gray-500">
          Add some photos in Sanity Studio to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo, index) => (
        <ProtectedImage
          key={photo._id}
          photo={photo}
          priority={index < 3} // Prioritize loading first 3 images
          onClick={() => openLightbox(photos, index)}
        />
      ))}
    </div>
  )
}
