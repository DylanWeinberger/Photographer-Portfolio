/**
 * Hero Slider Component
 *
 * Dramatic, slow-motion slider for fine art photography.
 * Design philosophy:
 * - SLOW crossfades (1.2-1.5s transitions)
 * - 6-8 second auto-advance
 * - Subtle scale effects
 * - Minimal, refined navigation dots
 * - Full viewport impact
 */

'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import { urlFor } from '@/sanity/lib/image'
import type { Homepage } from '@/types/sanity'

type HeroProps = {
  hero: Homepage['hero']
}

export default function Hero({ hero }: HeroProps) {
  // DRAMATIC SLOW TRANSITIONS
  // - Fade effect for crossfade instead of slide
  // - 1500ms (1.5s) transition duration - SLOW and deliberate
  // - 7000ms (7s) autoplay delay
  // - Stop on interaction: false - keeps playing for contemplative experience
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 150, // SLOW 1.5s crossfade
    },
    [
      Fade(), // Crossfade effect, not slide
      Autoplay({
        delay: 7000, // 7 seconds per slide
        stopOnInteraction: false // Continues playing
      })
    ]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  return (
    <section className="relative h-[80vh] md:h-[85vh] lg:h-[90vh] overflow-hidden bg-[var(--background)]">
      {/* Carousel with dramatic slow crossfades */}
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {hero.heroPhotos.map((photo, index) => {
            // Image optimization:
            // - width: 2400px for exceptional hero quality
            // - quality: 90 (hero images demand highest quality)
            // - auto('format'): enables WebP/AVIF for modern browsers
            // - priority: only first image (critical for LCP)
            // - loading='eager': prevents lazy-loading of first image (LCP optimization)
            // - fetchPriority='high': browser prioritizes first image download (LCP optimization)
            // - sizes: 100vw (hero is full width on all devices)
            const imageUrl = urlFor(photo.image)
              .width(2400)
              .quality(90)
              .auto('format')
              .url()

            return (
              <div key={photo._id} className="relative flex-[0_0_100%] min-w-0">
                <Image
                  src={imageUrl}
                  alt={photo.altText || photo.title}
                  fill
                  priority={index === 0} // Only prioritize first image for LCP
                  loading={index === 0 ? 'eager' : 'lazy'} // LCP optimization: eager load first image
                  fetchPriority={index === 0 ? 'high' : 'auto'} // LCP optimization: high priority for first image
                  className="object-cover animate-image-fade-in"
                  sizes="100vw"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Dark overlay for text readability - more opaque for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

      {/* Content overlay - Playfair Display for dramatic typography */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 md:px-20 lg:px-24 text-center">
          {/* Hero headline - Large, elegant Playfair Display with delayed fade in */}
          <h1 className="font-ibm text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[var(--foreground)] mb-6 md:mb-8 tracking-tight leading-[1.1] animate-fadeIn animate-delay-600">
            {hero.headline}
          </h1>

          {/* Subheadline - Lighter, more subtle */}
          {hero.subheadline && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[var(--foreground)]/90 mb-10 md:mb-12 max-w-3xl mx-auto font-light tracking-wide leading-relaxed animate-fadeIn animate-delay-600">
              {hero.subheadline}
            </p>
          )}

          {/* CTA - Minimal, refined styling */}
          {hero.showCTA && hero.ctaText && hero.ctaLink && (
            <Link
              href={hero.ctaLink}
              className="inline-block px-10 py-4 border border-[var(--foreground)] text-[var(--foreground)] text-sm uppercase tracking-[0.15em] transition-all duration-[var(--transition-medium)] hover:bg-[var(--foreground)] hover:text-[var(--background)] animate-fadeIn animate-delay-600"
            >
              {hero.ctaText}
            </Link>
          )}
        </div>
      </div>

      {/* Minimal dot indicators - Subtle, refined */}
      {hero.heroPhotos.length > 1 && (
        <div className="absolute bottom-10 md:bottom-12 left-0 right-0 flex justify-center gap-3 z-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`rounded-full transition-all duration-[var(--transition-medium)] ${
                index === selectedIndex
                  ? 'w-8 h-1.5 bg-[var(--foreground)]'
                  : 'w-1.5 h-1.5 bg-[var(--foreground)]/40 hover:bg-[var(--foreground)]/70'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
