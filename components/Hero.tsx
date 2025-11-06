'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { urlFor } from '@/sanity/lib/image'
import type { Homepage } from '@/types/sanity'

type HeroProps = {
  hero: Homepage['hero']
}

export default function Hero({ hero }: HeroProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 20 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
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
    <section className="relative h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
      {/* Carousel */}
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {hero.heroPhotos.map((photo) => {
            const imageUrl = urlFor(photo.image)
              .width(1920)
              .quality(90)
              .url()

            return (
              <div key={photo._id} className="relative flex-[0_0_100%] min-w-0">
                <Image
                  src={imageUrl}
                  alt={photo.altText || photo.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight">
            {hero.headline}
          </h1>

          {hero.subheadline && (
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-10 max-w-3xl mx-auto font-light">
              {hero.subheadline}
            </p>
          )}

          {hero.showCTA && hero.ctaText && hero.ctaLink && (
            <Link
              href={hero.ctaLink}
              className="inline-block px-8 py-4 bg-white text-gray-900 font-semibold text-lg rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {hero.ctaText}
            </Link>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      {hero.heroPhotos.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
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
