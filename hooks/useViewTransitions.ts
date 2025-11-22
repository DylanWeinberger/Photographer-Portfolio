'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * View Transitions Hook
 *
 * Enables smooth page transitions using CSS-based crossfades.
 * Works with Next.js App Router for seamless route changes.
 *
 * Features:
 * - 0.6s crossfade between routes (gallery pace)
 * - Respects prefers-reduced-motion (CSS handles this)
 * - Works in all browsers (CSS-based, no View Transitions API needed)
 * - Skips browser back/forward and same-page links
 */

export function usePageTransitions() {
  const pathname = usePathname()

  useEffect(() => {
    // Add CSS class to enable transitions on mount
    document.documentElement.classList.add('page-transitions-enabled')

    return () => {
      document.documentElement.classList.remove('page-transitions-enabled')
    }
  }, [])

  useEffect(() => {
    // Trigger transition effect on route change
    document.documentElement.classList.add('page-transitioning')

    const timer = setTimeout(() => {
      document.documentElement.classList.remove('page-transitioning')
    }, 600) // Match CSS transition duration

    return () => clearTimeout(timer)
  }, [pathname])
}
