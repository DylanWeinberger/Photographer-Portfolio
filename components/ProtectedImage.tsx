/**
 * ProtectedImage Component
 *
 * Fine art image presentation with subtle borders and slow interactions.
 * Design philosophy:
 * - Subtle borders (image-border class)
 * - SLOW hover effects (0.8s)
 * - Minimal info overlay
 * - No harsh shadows or effects
 * - Protection against right-click/drag
 */

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
    <div className="relative group">
      {/* Warning Message - Refined styling */}
      {showWarning && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-[var(--background)]/90 text-[var(--foreground)] px-5 py-3 text-xs uppercase tracking-[0.1em] animate-fade-in border border-[var(--border)]">
          Image protected
        </div>
      )}

      {/* Protected Image - Aspect ratio with subtle border */}
      <div
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onClick={onClick}
        data-cursor="image"
        className={`relative aspect-[4/5] overflow-hidden image-border ${
          onClick ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover protected-image transition-all duration-[var(--transition-slow)] group-hover:brightness-105"
          placeholder="blur"
          blurDataURL={blurDataURL}
          priority={priority}
          draggable={false}
        />

        {/* Very subtle overlay on hover */}
        <div className="absolute inset-0 bg-[var(--background)]/0 group-hover:bg-[var(--background)]/5 transition-all duration-[var(--transition-slow)]" />
      </div>

      {/* Photo Info - Minimal, refined */}
      {(photo.title || photo.caption) && (
        <div className="mt-4">
          {photo.title && (
            <h3 className="text-sm text-[var(--foreground)] font-normal mb-1 tracking-wide">
              {photo.title}
            </h3>
          )}
          {photo.caption && (
            <p className="text-xs text-[var(--subtle-text)] line-clamp-2 leading-relaxed">
              {photo.caption}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
