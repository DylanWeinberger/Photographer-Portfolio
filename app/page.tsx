import { client } from '@/sanity/lib/client'
import { homepageQuery, featuredPhotosQuery } from '@/lib/queries'
import type { Homepage, Photo } from '@/types/sanity'

/**
 * Homepage - Server Component
 *
 * This is a Next.js Server Component that fetches data from Sanity CMS.
 * Server Components run on the server and can directly fetch data without
 * exposing API keys to the client.
 *
 * We're fetching:
 * 1. Homepage singleton document (hero, featured section, about)
 * 2. Featured photos to display in the gallery
 */

/**
 * DATA FETCHING
 *
 * Queries are imported from lib/queries.ts for:
 * - Reusability across multiple pages
 * - Centralized maintenance
 * - Better syntax highlighting with groq template literal
 * - Consistent query formatting
 */

/**
 * Fetch homepage data from Sanity
 */
async function getHomepage(): Promise<Homepage | null> {
  try {
    const homepage = await client.fetch<Homepage>(homepageQuery, {}, {
      // Revalidate every 60 seconds in production
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
 *
 * This is the root page (/) of the application.
 * It displays a simple structure to verify data fetching works.
 */
export default async function Home() {
  // Fetch data from Sanity
  // Since this is a Server Component, we can use async/await directly
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
    <main className="max-w-4xl mx-auto p-8 space-y-6">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Homepage Data Test</h1>
        <p className="text-gray-600">
          Verifying data fetching from Sanity CMS works correctly
        </p>
      </div>

      {/* Hero Section Data */}
      <section className="border-2 border-blue-500 p-6 rounded-lg bg-blue-50">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Hero Section</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Headline:</span>{' '}
            {homepage.hero.headline}
          </p>
          {homepage.hero.subheadline && (
            <p>
              <span className="font-semibold">Subheadline:</span>{' '}
              {homepage.hero.subheadline}
            </p>
          )}
          <p>
            <span className="font-semibold">Hero Photos:</span>{' '}
            {homepage.hero.heroPhotos.length} photo(s)
          </p>
          {homepage.hero.heroPhotos.map((photo, i) => (
            <p key={photo._id} className="ml-4 text-gray-700">
              {i + 1}. {photo.title}
            </p>
          ))}
          <p>
            <span className="font-semibold">CTA Enabled:</span>{' '}
            {homepage.hero.showCTA ? 'Yes' : 'No'}
          </p>
          {homepage.hero.showCTA && homepage.hero.ctaText && (
            <>
              <p className="ml-4">
                <span className="font-semibold">Button Text:</span>{' '}
                {homepage.hero.ctaText}
              </p>
              <p className="ml-4">
                <span className="font-semibold">Button Link:</span>{' '}
                {homepage.hero.ctaLink}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Featured Section Data */}
      <section className="border-2 border-green-500 p-6 rounded-lg bg-green-50">
        <h2 className="text-xl font-bold mb-4 text-green-900">
          Featured Photos Section
        </h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Section Heading:</span>{' '}
            {homepage.featuredSection.heading}
          </p>
          {homepage.featuredSection.description && (
            <p>
              <span className="font-semibold">Description:</span>{' '}
              {homepage.featuredSection.description}
            </p>
          )}
          <p>
            <span className="font-semibold">Featured Photos Count:</span>{' '}
            {featuredPhotos.length} photo(s)
          </p>
          {featuredPhotos.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold mb-1">Featured Photos:</p>
              {featuredPhotos.map((photo, i) => (
                <p key={photo._id} className="ml-4 text-gray-700">
                  {i + 1}. {photo.title}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section Data */}
      <section className="border-2 border-purple-500 p-6 rounded-lg bg-purple-50">
        <h2 className="text-xl font-bold mb-4 text-purple-900">About Section</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Section Heading:</span>{' '}
            {homepage.about.heading}
          </p>
          <p>
            <span className="font-semibold">Bio Blocks:</span>{' '}
            {homepage.about.bio.length} block(s) of content
          </p>
          <p>
            <span className="font-semibold">Has Profile Image:</span>{' '}
            {homepage.about.profileImage.asset ? 'Yes' : 'No'}
          </p>
          {homepage.about.profileImage.asset && (
            <p className="ml-4 text-gray-700 text-xs">
              Asset ID: {homepage.about.profileImage.asset._ref}
            </p>
          )}
        </div>
      </section>

      {/* Debug Info */}
      <section className="border-2 border-gray-300 p-6 rounded-lg bg-gray-50">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Debug Info</h2>
        <div className="space-y-2 text-xs text-gray-700 font-mono">
          <p>Homepage ID: {homepage._id}</p>
          <p>Homepage Type: {homepage._type}</p>
          <p>Total Featured Photos: {featuredPhotos.length}</p>
        </div>
      </section>

      {/* Success Message */}
      <div className="border-2 border-green-500 p-6 rounded-lg bg-green-100">
        <p className="text-green-900 font-semibold">
          ✅ Data fetching is working correctly!
        </p>
        <p className="text-green-700 text-sm mt-2">
          All data is being successfully fetched from Sanity CMS. Ready to build
          components!
        </p>
      </div>
    </main>
  )
}

// Generate metadata for the page
export const metadata = {
  title: 'Photographer Portfolio',
  description: 'Professional photography portfolio',
}
