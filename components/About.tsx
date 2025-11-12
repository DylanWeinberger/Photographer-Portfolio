/**
 * About Section Component
 *
 * Refined biography section with generous spacing and elegant typography.
 * Design philosophy:
 * - Centered max-width text for readability
 * - Profile photo with subtle presentation
 * - Playfair for heading, IBM Plex Sans for body
 * - Massive vertical spacing
 */

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import type { Homepage } from '@/types/sanity'

type AboutProps = {
  about: Homepage['about']
}

// Custom components for PortableText rendering - Fine art styling
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="mb-6 text-[var(--foreground)] leading-[1.9] text-base md:text-lg font-light">
        {children}
      </p>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-playfair text-2xl md:text-3xl font-normal mb-6 text-[var(--foreground)] tracking-tight">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-medium text-[var(--foreground)]">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-[var(--accent-cool)]">{children}</em>
    ),
  },
}

export default function About({ about }: AboutProps) {
  // Image optimization for profile photo:
  // - width/height: 800px (high quality for profile)
  // - quality: 90 (exceptional quality for portrait)
  // - auto('format'): enables WebP/AVIF
  // - sizes: 100vw mobile, 40vw desktop
  const profileImageUrl = about.profileImage.asset
    ? urlFor(about.profileImage)
        .width(800)
        .height(800)
        .quality(90)
        .auto('format')
        .url()
    : null

  return (
    <section className="py-28 md:py-36 lg:py-44 px-6 md:px-20 lg:px-24 bg-[var(--surface)]">
      <div className="max-w-[1400px] mx-auto">
        {/* Heading - Playfair Display, centered */}
        <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-normal text-[var(--foreground)] mb-20 md:mb-28 text-center tracking-tight">
          {about.heading}
        </h2>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-start">
          {/* Profile Image - Subtle borders, no harsh shadows */}
          {profileImageUrl && (
            <div className="order-2 md:order-1">
              <div className="relative aspect-square overflow-hidden image-border">
                <Image
                  src={profileImageUrl}
                  alt="Profile"
                  fill
                  className="object-cover grayscale transition-all duration-[var(--transition-slow)] hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
          )}

          {/* Bio Content - Centered max-width for readability */}
          <div className="order-1 md:order-2 flex items-center">
            <div className="max-w-[650px]">
              <PortableText
                value={about.bio}
                components={portableTextComponents}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
