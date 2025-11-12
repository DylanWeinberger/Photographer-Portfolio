'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLightbox } from '@/contexts/LightboxContext'
import { urlFor } from '@/sanity/lib/image'
import InfoPanel from './InfoPanel'

export default function Lightbox() {
  const { isOpen, photos, currentIndex, closeLightbox, nextPhoto, prevPhoto } =
    useLightbox()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const currentPhoto = photos[currentIndex]

  // Toggle info panel
  const toggleInfo = () => setShowInfo((prev) => !prev)

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          // Close info panel first if open, then close lightbox
          if (showInfo) {
            setShowInfo(false)
          } else {
            closeLightbox()
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          nextPhoto()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prevPhoto()
          break
        case 'i':
        case 'I':
          // Toggle info with 'I' key
          toggleInfo()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, showInfo, closeLightbox, nextPhoto, prevPhoto])

  // Reset states when photo changes
  useEffect(() => {
    setImageLoaded(false)
    // Keep info panel open if user had it open
  }, [currentIndex])

  // Reset info panel when lightbox closes
  useEffect(() => {
    if (!isOpen) {
      setShowInfo(false)
    }
  }, [isOpen])

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          {/* Top Controls Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6">
            {/* Photo Counter */}
            <div className="text-light text-sm md:text-base font-medium">
              {currentIndex + 1} / {photos.length}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Info Button */}
              <button
                onClick={toggleInfo}
                className={`p-2 md:p-2.5 rounded-lg transition-all ${
                  showInfo
                    ? 'bg-white text-black'
                    : 'text-light hover:bg-white/10'
                }`}
                aria-label="Toggle photo information"
                aria-pressed={showInfo}
              >
                <svg
                  className="w-6 h-6 md:w-7 md:h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="text-light hover:text-gray-300 transition-colors p-2"
                aria-label="Close lightbox"
              >
                <svg
                  className="w-8 h-8 md:w-10 md:h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Photo Container - adjusts when info panel is open */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              marginRight: showInfo ? '20rem' : '0', // 320px = 20rem (sidebar width on desktop)
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-full max-h-full">
              <img
                src={imageUrl}
                alt={currentPhoto.altText || currentPhoto.title}
                className={`object-contain select-none transition-all duration-300 ${
                  showInfo
                    ? 'max-h-[70vh] md:max-h-[85vh]'
                    : 'max-h-[70vh] md:max-h-[85vh]'
                }`}
                style={{
                  maxWidth: showInfo ? 'calc(100vw - 24rem)' : '100vw',
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
            </div>
          </motion.div>

          {/* Navigation Controls */}
          {photos.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevPhoto()
                }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-50 text-light hover:text-gray-300 transition-colors p-2 md:p-3 bg-black/30 hover:bg-black/50 rounded-full"
                aria-label="Previous photo"
              >
                <svg
                  className="w-6 h-6 md:w-8 md:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Next Button - adjusts position when info panel is open on desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextPhoto()
                }}
                className="absolute top-1/2 -translate-y-1/2 z-50 text-light hover:text-gray-300 transition-all p-2 md:p-3 bg-black/30 hover:bg-black/50 rounded-full"
                style={{
                  right: showInfo ? 'calc(20rem + 1.5rem)' : '0.5rem',
                  transition: 'right 0.3s ease-out',
                }}
                aria-label="Next photo"
              >
                <svg
                  className="w-6 h-6 md:w-8 md:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
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

          {/* Info Panel */}
          <InfoPanel photo={currentPhoto} isOpen={showInfo} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
