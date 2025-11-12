'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLightbox } from '@/contexts/LightboxContext'
import type { Photo } from '@/types/sanity'
import { useState, useEffect } from 'react'

interface InfoPanelProps {
  photo: Photo
  isOpen: boolean
}

export default function InfoPanel({ photo, isOpen }: InfoPanelProps) {
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
                                        {photo.tags.map((tag) => {
  // tag may be a dereferenced object or a reference { _ref }
  const tagName = (tag as any).name ?? (tag as any)._ref ?? 'tag'
  // Prefer explicit slug if available
  const slug = (tag as any).slug
    ?? (tag as any)._ref // fallback — may not be a friendly slug

  // if slug contains something like `tag-abc123` you might want to clean it:
  const cleanedSlug = typeof slug === 'string'
    ? slug.replace(/^tag[._-]?/, '') // optional sanitization — adjust to your _ref format
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

              {/* Featured Badge - Minimal, editorial */}
              {photo.featured && (
                <div className="pt-4 border-t border-[var(--border)]">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[var(--accent-warm)] font-light">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </span>
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
            {/* Handle bar for visual affordance - Minimal */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-10 h-0.5 bg-[var(--border)] opacity-50" />
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
                      {photo.tags.map((tag) => {
                      // tag may be a dereferenced object or a reference { _ref }
                      const tagName = (tag as any).name ?? (tag as any)._ref ?? 'tag'
                      // Prefer explicit slug if available
                      const slug = (tag as any).slug?.current
                        ?? (tag as any)._ref // fallback — may not be a friendly slug

                      // if slug contains something like `tag-abc123` you might want to clean it:
                      const cleanedSlug = typeof slug === 'string'
                        ? slug.replace(/^tag[._-]?/, '') // optional sanitization — adjust to your _ref format
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

              {/* Featured Badge - Minimal, editorial */}
              {photo.featured && (
                <div className="pt-4 border-t border-[var(--border)]">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[var(--accent-warm)] font-light">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </span>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
