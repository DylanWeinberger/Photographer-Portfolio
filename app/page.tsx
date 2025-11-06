import { client } from '@/sanity/lib/client'
import { homepageQuery, featuredPhotosQuery } from '@/lib/queries'
import type { Homepage, Photo } from '@/types/sanity'
import Hero from '@/components/Hero'
import FeaturedSection from '@/components/FeaturedSection'
import PhotoGrid from '@/components/PhotoGrid'
import About from '@/components/About'

/**
 * Fetch homepage data from Sanity
 */
async function getHomepage(): Promise<Homepage | null> {
  try {
    const homepage = await client.fetch<Homepage>(homepageQuery, {}, {
      next: { revalidate: 60 }
    })
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
    const photos = await client.fetch<Photo[]>(featuredPhotosQuery, {}, {
      next: { revalidate: 60 }
    })
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

  return (
    <>
      {/* Hero Section - Full width, edge-to-edge */}
      <Hero hero={homepage.hero} />

      {/* Featured Section Introduction - Contained */}
      <FeaturedSection featuredSection={homepage.featuredSection} />

      {/* Featured Photos Grid - Contained */}
      <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <PhotoGrid photos={featuredPhotos} />
        </div>
      </section>

      {/* About Section - Full width with background */}
      <About about={homepage.about} />
    </>
  )
}

// Generate metadata for the page
export const metadata = {
  title: 'Photographer Portfolio',
  description: 'Professional photography portfolio',
}
