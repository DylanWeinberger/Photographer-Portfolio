/**
 * Footer Component
 *
 * Site-wide footer with branding, navigation, social links, and copyright.
 * Displays on every page (rendered in root layout).
 *
 * Features:
 * - Logo/site title (links to homepage)
 * - Key navigation links (About, Contact)
 * - Social media link (Flickr)
 * - Copyright information with current year
 * - Responsive layout
 */

import Link from 'next/link'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import type { Settings } from '@/types/sanity'

interface FooterProps {
  settings: Settings
}

export default function Footer({ settings }: FooterProps) {
  const { logo, siteTitle, socialLinks, footer } = settings
  const currentYear = new Date().getFullYear()

  // Check if any social links exist
  const hasSocialLinks = socialLinks && (socialLinks.flickr || socialLinks.email)

  return (
    <footer className="border-t bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            {logo?.asset ? (
              <div className="relative w-12 h-12">
                <Image
                  src={urlFor(logo).width(96).height(96).url()}
                  alt={logo.alt || `${siteTitle} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                <Camera className="w-6 h-6 text-gray-600" />
              </div>
            )}
            <span className="text-lg font-semibold bebas">{siteTitle}</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="mb-8">
          <ul className="flex flex-wrap justify-center gap-6 md:gap-8">
            <li>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-base"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/photos"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-base"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-base"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Social Links Section */}
        {hasSocialLinks && footer?.showSocialLinks && (
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            {socialLinks.flickr && (
              <a
                href={socialLinks.flickr}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                aria-label="Flickr"
              >
                <Camera className="w-5 h-5" />
                <span className="text-sm">Flickr</span>
              </a>
            )}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                aria-label="Email"
              >
                Email
              </a>
            )}
          </div>
        )}

        {/* Copyright Section */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>
            © {currentYear} {footer?.copyrightText || siteTitle}. All rights
            reserved.
          </p>

          {footer?.additionalText && <p>{footer.additionalText}</p>}
        </div>
      </div>
    </footer>
  )
}
