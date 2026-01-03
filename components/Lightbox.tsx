'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLightbox } from '@/contexts/LightboxContext'
import { urlFor } from '@/sanity/lib/image'


export default function Lightbox() {
  const { isOpen, photos, currentIndex, closeLightbox, nextPhoto, prevPhoto } =
    useLightbox()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const currentPhoto = photos[currentIndex]

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Focus management - trap focus within lightbox
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Focus close button when lightbox opens for keyboard accessibility
      closeButtonRef.current.focus()
    }
  }, [isOpen])

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowRight':
          e.preventDefault()
          nextPhoto()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prevPhoto()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeLightbox, nextPhoto, prevPhoto])

  // Reset states when photo changes
  useEffect(() => {
    setImageLoaded(false)
  }, [currentIndex])

  if (!isOpen || !currentPhoto) return null

  // Generate optimized image URL
  const getQuality = () => {
    switch (currentPhoto.displayQuality) {
      case 'high':
        return 80
      case 'medium':
        return 60
      case 'low':
        return 40
      default:
        return 80
    }
  }

  const imageUrl = urlFor(currentPhoto.image)
    .width(1920)
    .quality(getQuality())
    .auto('format')
    .url()

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeLightbox()
    }
  }

  // Animation durations - respect reduced motion preference
  const backdropDuration = prefersReducedMotion ? 0.2 : 0.7
  const photoDuration = prefersReducedMotion ? 0.2 : 1.0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: backdropDuration, ease: 'easeOut' }}
          className="fixed inset-0 z-50 bg-[#0a0a0a] backdrop-blur-sm flex items-center justify-center"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox viewer"
        >
          {/* Top Controls Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6">
            {/* Photo Counter - Minimal, editorial */}
            <div className="text-[var(--foreground)] text-xs uppercase tracking-[0.15em] opacity-60">
              {currentIndex + 1} / {photos.length}
            </div>

            {/* Close Button - Minimal, editorial */}
            <button
              ref={closeButtonRef}
              onClick={closeLightbox}
              className="text-[var(--foreground)] opacity-50 hover:opacity-100 transition-opacity duration-[var(--transition-medium)] p-2.5 md:p-3"
              aria-label="Close lightbox (press Escape)"
            >
              <svg
                className="w-6 h-6 md:w-7 md:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Main Photo Container - Slow, dramatic transitions */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
            transition={{
              duration: photoDuration,
              ease: [0.4, 0, 0.2, 1] // Custom easing for contemplative pace
            }}
            className="relative w-full h-full flex items-center justify-center p-4 md:p-12 lightbox-img-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-full max-h-full">
              <img
                src={imageUrl}
                alt={currentPhoto.altText || currentPhoto.title}
                className="object-contain select-none transition-all duration-300 max-h-[55vh] md:max-h-[85vh] lightbox-img mx-auto"
                style={{
                  maxWidth: 'calc(100vw - 24rem)',
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
              {/* Title - Playfair Display for editorial feel */}
              <div>
                <h2 className="font-playfair text-3xl lg:text-4xl font-normal leading-tight tracking-tight mt-5">
                  {currentPhoto.title || 'Untitled'}
                </h2>
              </div>

              {/* Caption - Refined typography */}
              {currentPhoto.caption && (
                <div>
                  <p className="text-base lg:text-lg font-light leading-relaxed opacity-80">
                    {currentPhoto.caption}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Navigation Controls - Highly visible */}
          {photos.length > 1 && (
            <>
              {/* Previous Button - Large and visible */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevPhoto()
                }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[60] text-[var(--foreground)] opacity-80 hover:opacity-100 transition-all duration-[var(--transition-medium)] p-3 md:p-4 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm"
                aria-label="Previous photo"
              >
                <svg
                  className="w-8 h-8 md:w-10 md:h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Next Button - Large, visible */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextPhoto()
                }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[60] text-[var(--foreground)] opacity-80 hover:opacity-100 transition-all duration-[var(--transition-medium)] p-3 md:p-4 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm lighthouse-next-btn"
                aria-label="Next photo"
              >
                <svg
                  className="w-8 h-8 md:w-10 md:h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Watermark Overlay (subtle) */}
          {currentPhoto.watermarkEnabled && (
            <div className="absolute bottom-8 right-8 text-light/30 text-xs md:text-sm pointer-events-none select-none">
              © All Rights Reserved
            </div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  )
}
