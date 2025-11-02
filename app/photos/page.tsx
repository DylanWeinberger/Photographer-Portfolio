import { client } from '@/sanity/lib/client'
import type { Photo } from '@/types/sanity'
import PhotoGrid from '@/components/PhotoGrid'

/**
 * Photos Page - Server Component
 *
 * Fetches photos from Sanity CMS and displays them in a grid.
 * Uses Next.js 15 Server Components for data fetching.
 */

// GROQ query to fetch photos with all needed fields
const PHOTOS_QUERY = `*[_type == "photo"] | order(featured desc, _createdAt desc) {
  _id,
  _type,
  _createdAt,
  title,
  image,
  altText,
  caption,
  displayQuality,
  watermarkEnabled,
  featured,
  tags,
  takenAt,
  location
}`

async function getPhotos(): Promise<Photo[]> {
  try {
    const photos = await client.fetch<Photo[]>(PHOTOS_QUERY, {}, {
      // Cache for 60 seconds, then revalidate in background
      next: { revalidate: 60 }
    })
    return photos
  } catch (error) {
    console.error('Error fetching photos:', error)
    return []
  }
}

export default async function PhotosPage() {
  const photos = await getPhotos()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Photo Gallery</h1>
          <p className="mt-2 text-gray-600">
            {photos.length > 0
              ? `${photos.length} photo${photos.length === 1 ? '' : 's'} in collection`
              : 'Building your photography portfolio'
            }
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PhotoGrid photos={photos} />
      </main>
    </div>
  )
}

// Generate metadata for the page
export const metadata = {
  title: 'Photo Gallery | Photographer Portfolio',
  description: 'Browse my photography portfolio',
}
