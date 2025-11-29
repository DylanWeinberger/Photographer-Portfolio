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
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Photo } from '@/types/sanity'
import { getThumbnailUrl, getBlurDataURL } from '@/lib/imageBuilder'

interface ProtectedImageProps {
  photo: Photo
  priority?: boolean
  onClick?: () => void
}

export default function ProtectedImage({ photo, priority = false, onClick }: ProtectedImageProps) {
  const [showWarning, setShowWarning] = useState(false)
  const [isHoverDevice, setIsHoverDevice] = useState(true)

  // Detect if device supports hover (desktop vs touch)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsHoverDevice(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Handle right-click attempts
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowWarning(true)

    // Hide warning after 2 seconds
    setTimeout(() => {
      setShowWarning(false)
    }, 2000)
  }

  // Use altText if provided, otherwise fallback to title
  const altText = photo.altText || photo.title

  // Get optimized image URLs
  const imageUrl = getThumbnailUrl(photo.image, photo.displayQuality)
  const blurDataURL = getBlurDataURL(photo.image)

  // Gallery spotlight hover animation (subtle scale + brightness + shadow)
  const hoverAnimation = isHoverDevice
    ? {
        scale: 1.01,
        filter: 'brightness(1.15)',
        boxShadow: '0 4px 8px rgba(255, 255, 255, 0.05)',
      }
    : undefined

  // Focus state (keyboard navigation - same as hover + visible ring)
  const focusAnimation = {
    scale: 1.01,
    filter: 'brightness(1.15)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8), 0 0 0 2px #d4c5b0',
  }

  // Tap feedback for mobile (brief, subtle)
  const tapAnimation = {
    scale: 1.01,
  }

  // Transition config for all animations
  const transitionConfig = {
    duration: 0.4,
  }

  const tapTransitionConfig = {
    duration: 0.1,
  }

  return (
    <div className="relative group overflow-hidden">
      {/* Warning Message - Refined styling */}
      {showWarning && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-[var(--background)]/90 text-[var(--foreground)] px-5 py-3 text-xs uppercase tracking-[0.1em] animate-fade-in border border-[var(--border)]">
          Image protected
        </div>
      )}

      {/* Protected Image - Natural aspect ratio with subtle border */}
      <motion.div
        onContextMenu={handleContextMenu}
        onClick={onClick}
        data-cursor="image"
        className={`relative overflow-hidden image-border ${
          onClick ? 'cursor-pointer' : 'cursor-default'
        }`}
        whileHover={hoverAnimation}
        whileFocus={focusAnimation}
        whileTap={tapAnimation}
        transition={transitionConfig}
        tabIndex={0}
        role="button"
        aria-label={`View ${photo.title || 'photo'}`}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onClick()
          }
        }}
        style={{
          transformOrigin: 'center',
          outline: 'none', // Custom focus style via whileFocus
          // Use aspect ratio from image metadata for proper sizing
          aspectRatio: photo.image.asset.metadata.dimensions.aspectRatio,
        }}
      >
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
          className="object-cover protected-image transition-all duration-[var(--transition-slow)] group-hover:brightness-105"
          placeholder="blur"
          blurDataURL={blurDataURL}
          priority={priority}
          draggable={false}
        />

        {/* Very subtle overlay on hover */}
        <div className="absolute inset-0 bg-[var(--background)]/0 group-hover:bg-[var(--background)]/5 transition-all duration-[var(--transition-slow)] pointer-events-none" />
      </motion.div>
    </div>
  )
}
