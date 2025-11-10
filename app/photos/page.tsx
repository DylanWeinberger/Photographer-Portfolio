import { client } from '@/sanity/lib/client'
import { paginatedPhotosQuery } from '@/lib/queries'
import type { Photo } from '@/types/sanity'
import PhotoGrid from '@/components/PhotoGrid'
import Pagination from '@/components/Pagination'
import { Metadata } from 'next'

/**
 * Photos Page - Server Component with Pagination
 *
 * Fetches paginated photos from Sanity CMS and displays them in a grid.
 * Uses URL query parameters for page navigation (?page=2).
 */

// Photos per page - divisible by 2, 3, 4, 6 for responsive grid
const PHOTOS_PER_PAGE = 24

interface PageProps {
  searchParams: { page?: string }
}

async function getPaginatedPhotos(page: number): Promise<{
  photos: Photo[]
  total: number
}> {
  try {
    const start = (page - 1) * PHOTOS_PER_PAGE
    const end = start + PHOTOS_PER_PAGE

    const result = await client.fetch<{ photos: Photo[]; total: number }>(
      paginatedPhotosQuery,
      { start, end }
    )

    return result
  } catch (error) {
    console.error('Error fetching photos:', error)
    return { photos: [], total: 0 }
  }
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const page = Number(searchParams.page) || 1

  if (page === 1) {
    return {
      title: 'Photo Gallery',
      description: 'Browse my photography portfolio',
    }
  }

  return {
    title: `Photo Gallery - Page ${page}`,
    description: `Browse my photography portfolio - Page ${page}`,
  }
}

export default async function PhotosPage({ searchParams }: PageProps) {
  // Parse and validate page number
  const rawPage = searchParams.page
  const page = Math.max(1, Number(rawPage) || 1)

  // Fetch paginated photos
  const { photos, total } = await getPaginatedPhotos(page)

  // Calculate total pages
  const totalPages = Math.ceil(total / PHOTOS_PER_PAGE)

  // Calculate range for display
  const startRange = (page - 1) * PHOTOS_PER_PAGE + 1
  const endRange = Math.min(page * PHOTOS_PER_PAGE, total)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bebas">
            Photo Gallery
          </h1>
          <p className="mt-2 text-gray-600">
            {total > 0 ? (
              <>
                Showing {startRange}–{endRange} of {total} photo
                {total === 1 ? '' : 's'}
              </>
            ) : (
              'Building your photography portfolio'
            )}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {photos.length > 0 ? (
          <>
            <PhotoGrid photos={photos} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/photos"
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No photos yet
            </h3>
            <p className="text-gray-500">
              Add some photos in Sanity Studio to see them here.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

// ISR: Revalidate every 30 minutes (1800 seconds)
// Reasoning: Photo gallery changes when new photos are added or removed
// 30 minutes provides a good balance between showing new content and performance
// Each paginated page is cached independently for optimal performance
export const revalidate = 1800
