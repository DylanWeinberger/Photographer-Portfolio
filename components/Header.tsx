/**
 * Header Component
 *
 * Site-wide header with logo, site title, and navigation.
 * Displays on every page (rendered in root layout).
 *
 * Features:
 * - Logo and site title from Settings
 * - Navigation menu from Navigation schema
 * - Responsive: horizontal menu on desktop, hamburger menu on mobile
 * - Handles internal and external links
 * - Opens external links in new tab when configured
 */

'use client'

/**
 * WHY 'use client'?
 *
 * This component needs client-side interactivity for:
 * - Mobile menu toggle (useState)
 * - Click handlers for hamburger button
 *
 * The data is still fetched server-side in layout.tsx
 * and passed down as props.
 */

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { Navigation, Settings, MenuItem } from '@/types/sanity'

interface HeaderProps {
  navigation: Navigation
  settings: Settings
}

export default function Header({ navigation, settings }: HeaderProps) {
  /**
   * MOBILE MENU STATE
   *
   * Track whether mobile menu is open or closed.
   * Only affects mobile view - desktop always shows menu.
   */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  /**
   * BUILD LINK HREF
   *
   * Generate correct href based on link type:
   * - 'home' → '/'
   * - 'internal' → internalLink value (e.g., '/photos')
   * - 'external' → externalUrl value (e.g., 'https://flickr.com/...')
   *
   * This centralizes the link logic so it's consistent across
   * desktop and mobile menu rendering.
   */
  const getHref = (item: MenuItem): string => {
    if (item.linkType === 'home') {
      return '/'
    }
    if (item.linkType === 'internal' && item.internalLink) {
      return item.internalLink
    }
    if (item.linkType === 'external' && item.externalUrl) {
      return item.externalUrl
    }
    // Fallback to home if link is misconfigured
    return '/'
  }

  /**
   * CHECK IF LINK IS EXTERNAL
   *
   * External links need different handling:
   * - Use <a> tag instead of Next.js <Link>
   * - Add target="_blank" if openInNewTab is true
   * - Add rel="noopener noreferrer" for security
   */
  const isExternal = (item: MenuItem): boolean => {
    return item.linkType === 'external'
  }

  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-20 lg:px-24 py-6 md:py-8">
        <div className="flex items-center justify-between">
          {/* LOGO AND TITLE - Minimal, refined */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo if exists */}
            {settings.logo?.asset && (
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image
                  src={urlFor(settings.logo).width(80).height(80).url()}
                  alt={settings.logo.alt || settings.siteTitle}
                  fill
                  className="object-contain transition-opacity duration-[var(--transition-medium)] group-hover:opacity-70"
                />
              </div>
            )}
            {/* Site title - Playfair Display, elegant sizing */}
            <span className="text-lg md:text-xl font-normal font-playfair text-[var(--foreground)] transition-colors duration-[var(--transition-medium)] group-hover:text-[var(--accent-warm)]">
              {settings.siteTitle}
            </span>
          </Link>

          {/* DESKTOP NAVIGATION - Minimal, editorial style */}
          {/* hidden: Hide on mobile */}
          {/* md:flex: Show on medium screens and up */}
          <nav className="hidden md:block">
            <ul className="flex gap-8 lg:gap-10">
              {navigation.menuItems.map((item, i) => (
                // Use Sanity's generated `_key` when available. If it's missing or
                // duplicates (rare), fall back to a deterministic string using
                // linkType, label and the index to keep the key stable across renders.
                <li key={item._key ?? `${item.linkType}-${item.label}-${i}`}>
                  {isExternal(item) ? (
                    // External link - use <a> tag
                    <a
                      href={getHref(item)}
                      target={item.openInNewTab ? '_blank' : undefined}
                      rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                      className="nav-item"
                    >
                      {item.label}
                      <span></span>
                    </a>
                  ) : (
                    // Internal link - use Next.js <Link>
                    <Link
                      href={getHref(item)}
                      className="nav-item"
                    >
                      {item.label}
                      <span></span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* MOBILE MENU BUTTON - Refined */}
          {/* md:hidden: Hide on medium screens and up */}
          <button
            className="md:hidden text-xl p-2 text-[var(--foreground)] transition-colors duration-[var(--transition-medium)] hover:text-[var(--accent-warm)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* MOBILE NAVIGATION - Elegant slide-in */}
        {/* Conditional rendering: only show when mobileMenuOpen is true */}
        {/* md:hidden: Hide on medium screens and up */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-6 pb-2 border-t border-[var(--border)] pt-6">
            <ul className="space-y-4">
              {navigation.menuItems.map((item, i) => (
                // Mobile menu uses the same fallback strategy for keys
                <li key={item._key ?? `${item.linkType}-${item.label}-${i}`}>
                  {isExternal(item) ? (
                    // External link - use <a> tag
                    <a
                      href={getHref(item)}
                      target={item.openInNewTab ? '_blank' : undefined}
                      rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                      className="block py-2 text-sm uppercase tracking-[0.08em] text-[var(--foreground)] transition-colors duration-[var(--transition-medium)] hover:text-[var(--accent-warm)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    // Internal link - use Next.js <Link>
                    <Link
                      href={getHref(item)}
                      className="block py-2 text-sm uppercase tracking-[0.08em] text-[var(--foreground)] transition-colors duration-[var(--transition-medium)] hover:text-[var(--accent-warm)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
