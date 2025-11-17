import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { homepageQuery, featuredPhotosQuery } from '@/lib/queries'
import type { Homepage, Photo } from '@/types/sanity'
import Hero from '@/components/Hero'
import FeaturedSection from '@/components/FeaturedSection'
import PhotoGrid from '@/components/PhotoGrid'
import About from '@/components/About'
import { createMetadata, getOGImageUrl, generateImageGalleryJsonLd } from '@/lib/metadata'

/**
 * Fetch homepage data from Sanity
 */
async function getHomepage(): Promise<Homepage | null> {
  try {
    const homepage = await client.fetch<Homepage>(homepageQuery)
    return homepage
  } catch (error) {
    console.error('Error fetching homepage:', error)
    return null
  }
}

/**
 * Fetch featured photos from Sanity
 */
async function getFeaturedPhotos(): Promise<Photo[]> {
  try {
    const photos = await client.fetch<Photo[]>(featuredPhotosQuery)
    return photos
  } catch (error) {
    console.error('Error fetching featured photos:', error)
    return []
  }
}

/**
 * Homepage Component
 */
export default async function Home() {
  const homepage = await getHomepage()
  const featuredPhotos = await getFeaturedPhotos()

  // Handle case where homepage doesn't exist yet
  if (!homepage) {
    return (
      <main className="max-w-4xl mx-auto p-8">
        <div className="border-2 border-red-500 p-6 rounded-lg bg-red-50">
          <h1 className="text-2xl font-bold text-red-900 mb-2">No Homepage Found</h1>
          <p className="text-red-700">
            Please create a homepage document in Sanity Studio at{' '}
            <a href="/sanity" className="underline font-medium">
              /sanity
            </a>
          </p>
        </div>
      </main>
    )
  }

  // Generate JSON-LD structured data for SEO
  const jsonLd = featuredPhotos.length > 0
    ? generateImageGalleryJsonLd(
        featuredPhotos,
        homepage.featuredSection?.heading || 'Featured Work',
        homepage.featuredSection?.description
      )
    : null

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Hero Section - Full width, edge-to-edge, dramatic */}
      <Hero hero={homepage.hero} />

      {/* Featured Section Introduction - Generous spacing */}
      <FeaturedSection featuredSection={homepage.featuredSection} />

      {/* Featured Photos Grid - Wide container, generous spacing */}
      <section className="pb-28 md:pb-36 lg:pb-44 px-6 md:px-20 lg:px-24">
        <div className="max-w-[1600px] mx-auto">
          <PhotoGrid photos={featuredPhotos} />
        </div>
      </section>

      {/* About Section - Full width with subtle background */}
      <About about={homepage.about} />
    </>
  )
}

/**
 * Generate dynamic metadata for homepage
 * Uses featured photos for Open Graph images
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const [homepage, featuredPhotos] = await Promise.all([
      client.fetch<Homepage>(homepageQuery),
      client.fetch<Photo[]>(featuredPhotosQuery),
    ])

    // Use hero headline for title, or fallback to default
    const title = homepage?.hero?.headline || 'Henry Jaffe Photography'
    const description =
      homepage?.hero?.subheadline ||
      homepage?.featuredSection?.description ||
      'Professional photography portfolio showcasing fine art and editorial work'

    // Get Open Graph image from first featured photo or hero photo
    let ogImage: string | undefined
    if (featuredPhotos && featuredPhotos.length > 0) {
      ogImage = getOGImageUrl(featuredPhotos[0].image)
    } else if (homepage?.hero?.heroPhotos && homepage.hero.heroPhotos.length > 0) {
      ogImage = getOGImageUrl(homepage.hero.heroPhotos[0].image)
    }

    return createMetadata({
      title,
      description,
      image: ogImage,
      path: '/',
    })
  } catch (error) {
    console.error('Error generating homepage metadata:', error)
    // Fallback metadata if Sanity fetch fails
    return createMetadata({
      title: 'Henry Jaffe Photography',
      description: 'Professional photography portfolio showcasing fine art and editorial work',
      path: '/',
    })
  }
}

// ISR: Revalidate every 1 hour (3600 seconds)
// Reasoning: Homepage content (hero, featured work, about) is curated and changes infrequently
// This provides fast page loads while keeping content reasonably fresh
// Can be adjusted if content updates more/less frequently
export const revalidate = 3600
