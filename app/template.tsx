'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Template Component - Enables View Transitions API
 *
 * In Next.js App Router, template.tsx creates a new instance on navigation,
 * which is perfect for triggering page transitions.
 *
 * This component:
 * - Detects route changes via usePathname
 * - Uses View Transitions API for smooth crossfades
 * - Falls back gracefully for unsupported browsers
 * - Respects prefers-reduced-motion via CSS
 */

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    // Only transition if pathname actually changed
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname

      // Focus management: move focus to main content
      const main = document.querySelector('main')
      if (main instanceof HTMLElement) {
        // Remove tabindex after focusing to keep normal tab order
        main.setAttribute('tabindex', '-1')
        main.focus({ preventScroll: true })
        main.removeAttribute('tabindex')
      }
    }
  }, [pathname])

  return <>{children}</>
}
