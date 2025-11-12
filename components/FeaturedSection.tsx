/**
 * Featured Section Component
 *
 * Introduction to featured photography with refined typography.
 * Design philosophy:
 * - Centered, editorial layout
 * - Playfair Display heading
 * - Subtle description text
 * - Minimal decorative element
 * - Massive vertical spacing
 */

import type { Homepage } from '@/types/sanity'

type FeaturedSectionProps = {
  featuredSection: Homepage['featuredSection']
}

export default function FeaturedSection({ featuredSection }: FeaturedSectionProps) {
  return (
    <section className="py-24 md:py-32 lg:py-40 px-6 md:px-20 lg:px-24">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading - Large Playfair Display */}
        <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-normal text-[var(--foreground)] mb-8 md:mb-10 tracking-tight">
          {featuredSection.heading}
        </h2>

        {/* Description - Subtle, airy */}
        {featuredSection.description && (
          <p className="text-base md:text-lg text-[var(--foreground)]/70 leading-[1.9] max-w-2xl mx-auto font-light tracking-wide">
            {featuredSection.description}
          </p>
        )}

        {/* Minimal decorative divider */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <div className="w-20 h-px bg-[var(--border)]" />
        </div>
      </div>
    </section>
  )
}
