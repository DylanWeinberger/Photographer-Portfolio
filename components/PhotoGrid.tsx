/**
 * PhotoGrid Component
 *
 * Fine art photography grid using justified rows layout.
 * Design philosophy:
 * - Equal row heights with variable image widths
 * - Images maintain natural aspect ratios
 * - Generous spacing for breathing room
 * - Subtle borders and slow hover effects
 */

'use client'

import { RowsPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/rows.css'
import type { Photo } from '@/types/sanity'
import ProtectedImage from './ProtectedImage'
import { useLightbox } from '@/contexts/LightboxContext'

interface PhotoGridProps {
  photos: Photo[]
  targetRowHeight?: number
}

export default function PhotoGrid({ photos, targetRowHeight = 300 }: PhotoGridProps) {
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

  // Transform photos to react-photo-album format
  const albumPhotos = photos.map((photo) => ({
    src: photo.image.asset.url,
    width: photo.image.asset.metadata.dimensions.width,
    height: photo.image.asset.metadata.dimensions.height,
    alt: photo.altText || photo.title,
    // Store original photo data for custom rendering
    photo,
  }))

  return (
    <RowsPhotoAlbum
      photos={albumPhotos}
      targetRowHeight={targetRowHeight}
      rowConstraints={{ minPhotos: 1, maxPhotos: 4 }}
      spacing={40}
      render={{
        image: (_props, { photo: albumPhoto }) => {
          const originalPhoto = (albumPhoto as typeof albumPhotos[number]).photo
          const index = photos.findIndex((p) => p._id === originalPhoto._id)
          return (
            <ProtectedImage
              photo={originalPhoto}
              priority={index < 4}
              onClick={() => openLightbox(photos, index)}
            />
          )
        },
      }}
    />
  )
}
