/**
 * Footer Component
 *
 * Site-wide footer with social links and copyright information.
 * Displays on every page (rendered in root layout).
 *
 * Features:
 * - Social media links (Instagram, Facebook, Email)
 * - Copyright text
 * - Additional footer text
 * - Conditional rendering (only shows if data exists)
 */

import type { Settings } from '@/types/sanity'

interface FooterProps {
  settings: Settings
}

/**
 * FOOTER COMPONENT
 *
 * Displays social media links and footer text.
 * Social links only render if they're populated in Settings.
 *
 * This is a server component (no 'use client') because it has
 * no interactivity - just displays static data passed as props.
 */
export default function Footer({ settings }: FooterProps) {
  const { socialLinks, footer } = settings

  /**
   * CHECK IF ANY SOCIAL LINKS EXIST
   *
   * We check this to avoid rendering an empty social links
   * section if the user hasn't configured any social media.
   */
  const hasSocialLinks = socialLinks && (
    socialLinks.instagram ||
    socialLinks.facebook ||
    socialLinks.email
  )

  return (
    <footer className="border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* SOCIAL LINKS SECTION */}
        {/* Only render if at least one social link exists */}
        {hasSocialLinks && footer?.showSocialLinks && (
          <div className="flex gap-6 justify-center mb-6">
            {/* Instagram */}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                /**
                 * rel="noopener noreferrer" is a security best practice
                 * for external links with target="_blank":
                 * - noopener: Prevents new page from accessing window.opener
                 * - noreferrer: Doesn't send referrer info to destination
                 */
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                Instagram
              </a>
            )}

            {/* Facebook */}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                Facebook
              </a>
            )}

            {/* Twitter */}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                Twitter
              </a>
            )}

            {/* Email - uses mailto: protocol to open mail client */}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="hover:opacity-70 transition-opacity"
              >
                Email
              </a>
            )}
          </div>
        )}

        {/* FOOTER TEXT SECTION */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          {/* Copyright text - typically "© 2024 Photographer Name" */}
          {footer?.copyrightText && (
            <p>{footer.copyrightText}</p>
          )}

          {/* Additional text - for disclaimers, taglines, etc. */}
          {footer?.additionalText && (
            <p>{footer.additionalText}</p>
          )}
        </div>
      </div>
    </footer>
  )
}
