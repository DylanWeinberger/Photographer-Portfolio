/**
 * Footer Component
 *
 * Almost invisible footer with minimal presence.
 * Design philosophy: Necessary info only, doesn't compete with content.
 *
 * Features:
 * - Minimal navigation links
 * - Subtle social link (Flickr)
 * - Copyright in barely-there text
 * - Generous spacing, sophisticated presence
 */

import Link from 'next/link'
import { Camera } from 'lucide-react'
import type { Settings } from '@/types/sanity'

interface FooterProps {
  settings: Settings
}

export default function Footer({ settings }: FooterProps) {
  const { siteTitle, socialLinks, footer } = settings
  const currentYear = new Date().getFullYear()

  // Check if any social links exist
  const hasSocialLinks = socialLinks && (socialLinks.flickr || socialLinks.email)

  return (
    <footer className="border-t border-[var(--border)] mt-auto bg-[var(--background)]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-20 lg:px-24 py-20 md:py-28 lg:py-32">

        {/* Navigation Links - Minimal, centered */}
        <nav className="mb-12 md:mb-16">
          <ul className="flex flex-wrap justify-center gap-8 md:gap-12">
            <li>
              <Link
                href="/photos"
                className="text-xs md:text-sm uppercase tracking-[0.1em] text-[var(--subtle-text)] transition-colors duration-[var(--transition-medium)] hover:text-[var(--foreground)]"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-xs md:text-sm uppercase tracking-[0.1em] text-[var(--subtle-text)] transition-colors duration-[var(--transition-medium)] hover:text-[var(--foreground)]"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Social Links Section - Very subtle */}
        {hasSocialLinks && footer?.showSocialLinks && (
          <div className="flex flex-wrap gap-8 justify-center mb-12 md:mb-16">
            {socialLinks.flickr && (
              <a
                href={socialLinks.flickr}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--subtle-text)] transition-all duration-[var(--transition-medium)] hover:text-[var(--foreground)] flex items-center gap-2"
                aria-label="Flickr"
              >
                <Camera className="w-4 h-4" />
                <span className="text-xs uppercase tracking-[0.1em]">Flickr</span>
              </a>
            )}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="text-xs uppercase tracking-[0.1em] text-[var(--subtle-text)] transition-colors duration-[var(--transition-medium)] hover:text-[var(--foreground)]"
                aria-label="Email"
              >
                Email
              </a>
            )}
          </div>
        )}

        {/* Copyright Section - Almost invisible */}
        <div className="text-center text-xs text-[var(--subtle-text)] space-y-2">
          <p>
            © {currentYear} {footer?.copyrightText || siteTitle}
          </p>

          {footer?.additionalText && (
            <p className="text-[var(--subtle-text)]">{footer.additionalText}</p>
          )}
        </div>
      </div>
    </footer>
  )
}
