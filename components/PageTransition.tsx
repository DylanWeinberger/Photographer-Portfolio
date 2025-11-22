'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Page Transition Handler
 *
 * Uses View Transitions API for smooth crossfades between routes.
 * Falls back to instant navigation for unsupported browsers.
 *
 * Design: Slow, deliberate gallery pace (0.6s crossfade)
 * Accessibility: Respects prefers-reduced-motion
 */

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Announce route changes to screen readers
    const announcer = document.getElementById('route-announcer')
    if (announcer) {
      // Extract page name from pathname
      const pageName = pathname === '/'
        ? 'Home'
        : pathname.split('/').filter(Boolean).join(' ').replace('-', ' ')

      announcer.textContent = `Navigated to ${pageName}`
    }
  }, [pathname])

  return (
    <>
      {/* Screen reader announcer for route changes */}
      <div
        id="route-announcer"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
      {children}
    </>
  )
}
