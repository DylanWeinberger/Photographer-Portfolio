import { Metadata } from 'next'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { settingsQuery } from '@/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Settings } from '@/types/sanity'
import { createMetadata } from '@/lib/metadata'

/**
 * Generate metadata for about page
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await client.fetch<Settings>(settingsQuery)

    const description = settings?.siteDescription
      ? `About ${settings.siteTitle}. ${settings.siteDescription}`
      : 'Learn more about the photographer, their journey, and passion for capturing moments through the lens.'

    return createMetadata({
      title: 'About',
      description,
      path: '/about',
    })
  } catch (error) {
    console.error('Error generating about page metadata:', error)
    // Fallback metadata
    return createMetadata({
      title: 'About',
      description: 'Learn more about the photographer, their journey, and passion for capturing moments through the lens.',
    })
  }
}

async function getSettings(): Promise<Settings | null> {
  try {
    const settings = await client.fetch<Settings>(settingsQuery)
    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
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

export default async function AboutPage() {
  const settings = await getSettings()

  if (!settings?.about) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="font-playfair text-4xl font-normal mb-6">About</h1>
        <p className="text-lg text-[var(--foreground)]">
          About content not yet configured. Please add about section in Site Settings.
        </p>
      </div>
    )
  }

  const { about } = settings

  // Image optimization for profile photo:
  // - width/height: 800px (high quality for profile)
  // - quality: 90 (exceptional quality for portrait)
  // - auto('format'): enables WebP/AVIF
  // - sizes: 100vw mobile, 40vw desktop
  const profileImageUrl = about.profileImage?.asset
    ? urlFor(about.profileImage)
        .width(800)
        .height(800)
        .quality(90)
        .auto('format')
        .url()
    : null

  return (
    <section className="py-8 md:py-16 px-6 md:px-20 lg:px-24 bg-[var(--surface)]">
      <div className="max-w-[1400px] mx-auto">
        {/* Heading - Playfair Display, centered */}
        <h1 className="font-playfair text-4xl mb-8 md:mb-16 sm:text-5xl md:text-6xl font-normal text-[var(--foreground)] text-center tracking-tight">
          {about.heading}
        </h1>

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

// ISR: Revalidate every 1 hour (3600 seconds)
// Reasoning: About page content changes very infrequently
// Longer revalidation time is appropriate since about info is relatively static
// Provides fast page loads while keeping content current
export const revalidate = 3600
