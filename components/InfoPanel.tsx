'use client'

import { motion } from 'framer-motion'
import type { Photo } from '@/types/sanity'
import { useState, useEffect } from 'react'

interface InfoPanelProps {
  photo: Photo
}

export default function InfoPanel({ photo }: InfoPanelProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Animation duration - respect reduced motion preference
  const panelDuration = prefersReducedMotion ? 0.2 : 0.6

  return (
    <>
      {/* Desktop Sidebar - Editorial styling, always visible */}
      <motion.aside
        initial={{ x: prefersReducedMotion ? 0 : '100%', opacity: prefersReducedMotion ? 0 : 1 }}
        animate={{ x: 0, opacity: 1 }}
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
        </div>
      </motion.aside>

      {/* Mobile Bottom Sheet - Editorial styling, always visible, compact to maximize image space */}
      <motion.aside
        initial={{ y: prefersReducedMotion ? 0 : '100%', opacity: prefersReducedMotion ? 0 : 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: panelDuration, ease: [0.4, 0, 0.2, 1] }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-md text-[var(--foreground)] overflow-y-auto z-50 border-t border-[var(--border)]"
        style={{ maxHeight: '35vh' }}
        onClick={(e) => e.stopPropagation()}
        role="complementary"
        aria-label="Photo information panel"
      >
        {/* Handle bar for visual affordance */}
        <div className="flex items-center pt-3 pb-1 px-4">
          <div className="w-10 h-0.5 bg-[var(--border)] opacity-50" />
        </div>

        <div className="px-4 pb-4 space-y-3">
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

          {/* Location - Minimal labels */}
          {photo.location && (
            <div>
              <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--subtle-text)] mb-3">
                Location
              </h3>
              <p className="text-sm font-light opacity-80">{photo.location}</p>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  )
}
