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

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { Navigation, Settings, MenuItem, ChildMenuItem } from '@/types/sanity'
import TransitionLink from '@/components/TransitionLink'


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
   * DROPDOWN STATE
   *
   * Track which parent menu item has its dropdown open.
   * Stores the _key of the open dropdown, or null if none open.
   */
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const dropdownRefs = useRef<Map<string, HTMLElement>>(new Map())
  const mobileMenuRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isInsideDropdown = Array.from(dropdownRefs.current.values()).some(
        (ref) => ref?.contains(target)
      )
      const isInsideMobileMenu = mobileMenuRef.current?.contains(target)
      if (!isInsideDropdown && !isInsideMobileMenu) {
        setOpenDropdown(null)
      }
    }

    if (isMobile && openDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile, openDropdown])

  /**
   * BUILD LINK HREF
   *
   * Generate correct href based on link type:
   * - 'home' → '/'
   * - 'internal' → internalLink value (e.g., '/photos')
   * - 'external' → externalUrl value (e.g., 'https://flickr.com/...')
   * - 'parent' → null (parent items don't have links)
   *
   * This centralizes the link logic so it's consistent across
   * desktop and mobile menu rendering.
   */
  const getHref = (item: MenuItem | ChildMenuItem): string => {
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
  const isExternal = (item: MenuItem | ChildMenuItem): boolean => {
    return item.linkType === 'external'
  }

  /**
   * DROPDOWN HANDLERS
   */
  const handleMouseEnter = (itemKey: string) => {
    if (isMobile) return
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setOpenDropdown(itemKey)
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }

  const handleDropdownClick = (itemKey: string, event?: React.MouseEvent) => {
    // Only toggle on mobile, but don't prevent the function from running
    const screenWidth = window.innerWidth
    if (screenWidth >= 768) return // Don't toggle on desktop

    // Prevent the click from bubbling if it's from a child element
    event?.stopPropagation()
    setOpenDropdown(openDropdown === itemKey ? null : itemKey)
  }

  const handleKeyDown = (
    event: React.KeyboardEvent,
    itemKey: string
  ) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        setOpenDropdown(openDropdown === itemKey ? null : itemKey)
        break
      case 'Escape':
        setOpenDropdown(null)
        break
      case 'ArrowDown':
        if (openDropdown !== itemKey) {
          event.preventDefault()
          setOpenDropdown(itemKey)
        }
        break
      case 'ArrowUp':
        if (openDropdown === itemKey) {
          event.preventDefault()
          setOpenDropdown(null)
        }
        break
    }
  }

  const closeDropdown = () => {
    setOpenDropdown(null)
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
              {navigation.menuItems.map((item, i) => {
                const itemKey = item._key ?? `${item.linkType}-${item.label}-${i}`
                const isParent = item.linkType === 'parent'
                const hasChildren = isParent && item.children && item.children.length > 0
                const isOpen = openDropdown === itemKey

                return (
                  <li
                    key={itemKey}
                    className="nav-dropdown-container"
                    ref={(el) => {
                      if (el && hasChildren) {
                        dropdownRefs.current.set(itemKey, el)
                      } else {
                        dropdownRefs.current.delete(itemKey)
                      }
                    }}
                    onMouseEnter={() => hasChildren && handleMouseEnter(itemKey)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {hasChildren ? (
                      // Parent item with dropdown
                      <>
                        <button
                          className={`nav-item nav-item-parent ${isOpen ? 'active' : ''}`}
                          onClick={() => handleDropdownClick(itemKey)}
                          onKeyDown={(e) => handleKeyDown(e, itemKey)}
                          aria-expanded={isOpen}
                          aria-haspopup="true"
                        >
                          {item.label}
                          <svg
                            className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M1 1L5 5L9 1"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <div className={`nav-dropdown ${isOpen ? 'open' : ''}`}>
                          <ul className="nav-dropdown-list">
                            {item.children?.map((child, childIndex) => {
                              const childKey = child._key ?? `child-${childIndex}`
                              return (
                                <li key={childKey}>
                                  {isExternal(child) ? (
                                    <a
                                      href={getHref(child)}
                                      target={child.openInNewTab ? '_blank' : undefined}
                                      rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                                      className="nav-dropdown-link"
                                      onClick={closeDropdown}
                                    >
                                      {child.label}
                                    </a>
                                  ) : (
                                    <TransitionLink
                                      href={getHref(child)}
                                      className="nav-dropdown-link"
                                      onClick={closeDropdown}
                                    >
                                      {child.label}
                                    </TransitionLink>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </>
                    ) : isExternal(item) ? (
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
                      <TransitionLink
                        href={getHref(item)}
                        className="nav-item"
                      >
                        {item.label}
                        <span></span>
                      </TransitionLink>
                    )}
                  </li>
                )
              })}
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
          <nav ref={mobileMenuRef} className="md:hidden mt-6 pb-2 border-t border-[var(--border)] pt-6">
            <ul className="space-y-4">
              {navigation.menuItems.map((item, i) => {
                const itemKey = item._key ?? `${item.linkType}-${item.label}-${i}`
                const isParent = item.linkType === 'parent'
                const hasChildren = isParent && item.children && item.children.length > 0
                const isOpen = openDropdown === itemKey

                return (
                  <li key={itemKey}>
                    {hasChildren ? (
                      // Parent item with dropdown
                      <>
                        <button
                          className="block w-full text-left py-2 text-sm uppercase tracking-[0.08em] text-[var(--foreground)] transition-colors duration-[var(--transition-medium)] hover:text-[var(--accent-warm)] flex items-center justify-between"
                          onClick={(e) => handleDropdownClick(itemKey, e)}
                          aria-expanded={isOpen}
                        >
                          {item.label}
                          <svg
                            className={`dropdown-arrow-mobile ${isOpen ? 'open' : ''}`}
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M1 1L5 5L9 1"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        {isOpen && (
                          <ul className="mt-2 ml-4 space-y-2">
                            {item.children?.map((child, childIndex) => {
                              const childKey = child._key ?? `child-${childIndex}`
                              return (
                                <li key={childKey}>
                                  {isExternal(child) ? (
                                    <a
                                      href={getHref(child)}
                                      target={child.openInNewTab ? '_blank' : undefined}
                                      rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                                      className="block py-2 text-sm tracking-[0.05em] text-[var(--foreground)] transition-colors duration-[var(--transition-medium)] hover:text-[var(--accent-warm)]"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setMobileMenuOpen(false)
                                      }}
                                    >
                                      {child.label}
                                    </a>
                                  ) : (
                                    <TransitionLink
                                      href={getHref(child)}
                                      className="block py-2 text-sm tracking-[0.05em] text-[var(--foreground)] transition-colors duration-[var(--transition-medium)] hover:text-[var(--accent-warm)]"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setMobileMenuOpen(false)
                                        closeDropdown()
                                      }}
                                    >
                                      {child.label}
                                    </TransitionLink>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </>
                    ) : isExternal(item) ? (
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
                )
              })}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
