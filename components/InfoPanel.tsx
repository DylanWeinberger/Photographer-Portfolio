'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLightbox } from '@/contexts/LightboxContext'
import type { Photo } from '@/types/sanity'

interface InfoPanelProps {
  photo: Photo
  isOpen: boolean
}

export default function InfoPanel({ photo, isOpen }: InfoPanelProps) {
  const { closeLightbox } = useLightbox()
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Desktop Sidebar - slides in from right */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="hidden md:block fixed right-0 top-0 bottom-0 w-80 lg:w-96 bg-black/90 backdrop-blur-sm text-white overflow-y-auto z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 lg:p-8 space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
                  {photo.title || 'Untitled'}
                </h2>
              </div>

              {/* Caption */}
              {photo.caption && (
                <div>
                  <p className="text-base text-gray-200 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>
              )}

              {/* Location */}
              {photo.location && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Location
                  </h3>
                  <p className="text-sm text-gray-200">{photo.location}</p>
                </div>
              )}

              {/* Date */}
              {displayDate && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Date
                  </h3>
                  <p className="text-sm text-gray-200">{displayDate}</p>
                </div>
              )}

              {/* Tags */}
              {photo.tags && photo.tags.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
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
      className="inline-block px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm text-gray-200 transition-colors"
    >
      #{tagName}
    </Link>
  )
})}
                  </div>
                </div>
              )}

              {/* Featured Badge */}
              {photo.featured && (
                <div>
                  <span className="inline-flex items-center px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-sm text-yellow-200 font-medium">
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured Photo
                  </span>
                </div>
              )}
            </div>
          </motion.aside>

          {/* Mobile Bottom Sheet - slides up from bottom */}
          <motion.aside
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm text-white overflow-y-auto z-50"
            style={{ maxHeight: '60vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar for visual affordance */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-400 rounded-full" />
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {/* Title */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                  {photo.title || 'Untitled'}
                </h2>
              </div>

              {/* Caption */}
              {photo.caption && (
                <div>
                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>
              )}

              {/* Metadata row */}
              <div className="flex flex-wrap gap-4 text-sm">
                {photo.location && (
                  <div>
                    <span className="text-gray-400">Location: </span>
                    <span className="text-gray-200">{photo.location}</span>
                  </div>
                )}
                {displayDate && (
                  <div>
                    <span className="text-gray-400">Date: </span>
                    <span className="text-gray-200">{displayDate}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {photo.tags && photo.tags.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
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
                          className="inline-block px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm text-gray-200 transition-colors"
                        >
                          #{tagName}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Featured Badge */}
              {photo.featured && (
                <div>
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs text-yellow-200 font-medium">
                    <svg
                      className="w-3 h-3 mr-1"
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
