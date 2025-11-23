'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLightbox } from '@/contexts/LightboxContext'
import type { Photo } from '@/types/sanity'
import { useState, useEffect } from 'react'

interface InfoPanelProps {
  photo: Photo
  isOpen: boolean
  onClose: () => void
}

export default function InfoPanel({ photo, isOpen, onClose }: InfoPanelProps) {
  const { closeLightbox } = useLightbox()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return null
    }
  }

  const displayDate = photo.takenAt
    ? formatDate(photo.takenAt)
    : formatDate(photo._createdAt)

  // Animation duration - respect reduced motion preference
  const panelDuration = prefersReducedMotion ? 0.2 : 0.6

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Desktop Sidebar - Editorial styling with slow, dramatic slide */}
          <motion.aside
            initial={{ x: prefersReducedMotion ? 0 : '100%', opacity: prefersReducedMotion ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: prefersReducedMotion ? 0 : '100%', opacity: prefersReducedMotion ? 0 : 1 }}
            transition={{ duration: panelDuration, ease: [0.4, 0, 0.2, 1] }}
            className="hidden md:block fixed right-0 top-0 bottom-0 w-80 lg:w-96 bg-[#0a0a0a]/95 backdrop-blur-md text-[var(--foreground)] overflow-y-auto z-50 border-l border-[var(--border)]"
            onClick={(e) => e.stopPropagation()}
            role="complementary"
            aria-label="Photo information panel"
          >
            {/* Close Button */}
            <div className="absolute top-6 right-6 z-10">
              <button
                onClick={onClose}
                className="text-[var(--foreground)] opacity-50 hover:opacity-100 transition-opacity duration-[var(--transition-medium)] p-2"
                aria-label="Close info panel (press Escape)"
              >
                <svg
                  className="w-5 h-5"
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

            <div className="p-8 lg:p-10 space-y-8 lg:space-y-10">
              {/* Title - Playfair Display for editorial feel */}
              <div>
                <h2 className="font-playfair text-3xl lg:text-4xl font-normal leading-tight tracking-tight">
                  {photo.title || 'Untitled'}
                </h2>
              </div>

              {/* Caption - Refined typography */}
              {photo.caption && (
                <div>
                  <p className="text-base lg:text-lg font-light leading-relaxed opacity-80">
                    {photo.caption}
                  </p>
                </div>
              )}

              {/* Location - Minimal labels */}
              {photo.location && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--subtle-text)] mb-3">
                    Location
                  </h3>
                  <p className="text-sm font-light opacity-80">{photo.location}</p>
                </div>
              )}

              {/* Date - Minimal labels */}
              {displayDate && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--subtle-text)] mb-3">
                    Date
                  </h3>
                  <p className="text-sm font-light opacity-80">{displayDate}</p>
                </div>
              )}

              {/* Tags - Minimal, text-based styling */}
              {photo.tags && photo.tags.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--subtle-text)] mb-3">
                    Collections
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {photo.tags
                      .map((tag) => {
                        // tag may be a dereferenced object or a reference { _ref }
                        const tagName = (tag as any).name ?? (tag as any)._ref ?? 'tag'
                        // Prefer explicit slug if available
                        const slug = (tag as any).slug ?? (tag as any)._ref

                        // if slug contains something like `tag-abc123` you might want to clean it:
                        const cleanedSlug = typeof slug === 'string'
                          ? slug.replace(/^tag[._-]?/, '')
                          : undefined

                        const href = cleanedSlug ? `/tag/${cleanedSlug}` : `/tag/${encodeURIComponent(String(slug))}`

                        return (
                          <Link
                            key={(tag as any)._id ?? (tag as any)._ref ?? tagName}
                            href={href}
                            onClick={() => {
                              closeLightbox();
                            }}
                            className="text-sm font-light opacity-70 hover:opacity-100 transition-opacity duration-[var(--transition-medium)] underline underline-offset-4 decoration-[var(--border)] hover:decoration-[var(--foreground)]"
                          >
                            {tagName}
                          </Link>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>

          {/* Mobile Bottom Sheet - Editorial styling with slow slide */}
          <motion.aside
            initial={{ y: prefersReducedMotion ? 0 : '100%', opacity: prefersReducedMotion ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: prefersReducedMotion ? 0 : '100%', opacity: prefersReducedMotion ? 0 : 1 }}
            transition={{ duration: panelDuration, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-md text-[var(--foreground)] overflow-y-auto z-50 border-t border-[var(--border)]"
            style={{ maxHeight: '60vh' }}
            onClick={(e) => e.stopPropagation()}
            role="complementary"
            aria-label="Photo information panel"
          >
            {/* Handle bar and close button for visual affordance - Minimal */}
            <div className="flex items-center justify-between pt-4 pb-2 px-6">
              <div className="w-10 h-0.5 bg-[var(--border)] opacity-50" />
              <button
                onClick={onClose}
                className="text-[var(--foreground)] opacity-50 hover:opacity-100 transition-opacity duration-[var(--transition-medium)] p-2 -mr-2"
                aria-label="Close info panel"
              >
                <svg
                  className="w-5 h-5"
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

            <div className="p-6 sm:p-8 space-y-6">
              {/* Title - Playfair Display */}
              <div>
                <h2 className="font-playfair text-2xl sm:text-3xl font-normal leading-tight tracking-tight">
                  {photo.title || 'Untitled'}
                </h2>
              </div>

              {/* Caption - Refined typography */}
              {photo.caption && (
                <div>
                  <p className="text-sm sm:text-base font-light leading-relaxed opacity-80">
                    {photo.caption}
                  </p>
                </div>
              )}

              {/* Metadata row - Refined */}
              <div className="flex flex-wrap gap-4 text-sm">
                {photo.location && (
                  <div>
                    <span className="text-[var(--subtle-text)] uppercase tracking-[0.1em] text-xs">Location: </span>
                    <span className="font-light opacity-80">{photo.location}</span>
                  </div>
                )}
                {displayDate && (
                  <div>
                    <span className="text-[var(--subtle-text)] uppercase tracking-[0.1em] text-xs">Date: </span>
                    <span className="font-light opacity-80">{displayDate}</span>
                  </div>
                )}
              </div>

              {/* Tags - Minimal, text-based styling */}
              {photo.tags && photo.tags.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--subtle-text)] mb-2">
                    Collections
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {photo.tags
                      .map((tag) => {
                        // tag may be a dereferenced object or a reference { _ref }
                        const tagName = (tag as any).name ?? (tag as any)._ref ?? 'tag'
                        // Prefer explicit slug if available
                        const slug = (tag as any).slug?.current ?? (tag as any)._ref

                        // if slug contains something like `tag-abc123` you might want to clean it:
                        const cleanedSlug = typeof slug === 'string'
                          ? slug.replace(/^tag[._-]?/, '')
                          : undefined

                        const href = cleanedSlug ? `/tag/${cleanedSlug}` : `/tag/${encodeURIComponent(String(slug))}`

                        return (
                          <Link
                            key={(tag as any)._id ?? (tag as any)._ref ?? tagName}
                            href={href}
                            className="text-sm font-light opacity-70 hover:opacity-100 transition-opacity duration-[var(--transition-medium)] underline underline-offset-4 decoration-[var(--border)] hover:decoration-[var(--foreground)]"
                          >
                            {tagName}
                          </Link>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
