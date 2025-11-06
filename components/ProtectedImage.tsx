'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Photo } from '@/types/sanity'
import { getThumbnailUrl, getBlurDataURL } from '@/lib/imageBuilder'

interface ProtectedImageProps {
  photo: Photo
  priority?: boolean
  onClick?: () => void
}

/**
 * ProtectedImage Component
 *
 * Displays a single photo with protection against:
 * - Right-click/context menu
 * - Drag and drop
 * - Text selection
 *
 * Uses Next.js Image component for automatic optimization.
 */
export default function ProtectedImage({ photo, priority = false, onClick }: ProtectedImageProps) {
  const [showWarning, setShowWarning] = useState(false)

  // Handle right-click attempts
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowWarning(true)

    // Hide warning after 2 seconds
    setTimeout(() => {
      setShowWarning(false)
    }, 2000)
  }

  // Prevent dragging
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Use altText if provided, otherwise fallback to title
  const altText = photo.altText || photo.title

  // Get optimized image URLs
  const imageUrl = getThumbnailUrl(photo.image, photo.displayQuality)
  const blurDataURL = getBlurDataURL(photo.image)

  return (
    <div className="relative group overflow-hidden rounded-lg bg-gray-100">
      {/* Warning Message */}
      {showWarning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/80 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg animate-fade-in">
          Image protected
        </div>
      )}

      {/* Protected Image */}
      <div
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onClick={onClick}
        className={`relative aspect-square ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover protected-image transition-transform duration-300 group-hover:scale-105"
          placeholder="blur"
          blurDataURL={blurDataURL}
          priority={priority}
          draggable={false}
        />

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Photo Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">
          {photo.title}
        </h3>
        {photo.caption && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {photo.caption}
          </p>
        )}
        {photo.featured && (
          <span className="inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⭐ Featured
          </span>
        )}
      </div>
    </div>
  )
}
