import { client } from '@/sanity/lib/client'
import { paginatedPhotosQuery } from '@/lib/queries'
import type { Photo } from '@/types/sanity'
import PhotoGrid from '@/components/PhotoGrid'
import Pagination from '@/components/Pagination'
import { Metadata } from 'next'
import { createMetadata, getOGImageUrl, generateImageGalleryJsonLd } from '@/lib/metadata'

/**
 * Photos Page - Server Component with Pagination
 *
 * Fetches paginated photos from Sanity CMS and displays them in a grid.
 * Uses URL query parameters for page navigation (?page=2).
 */

// Photos per page - divisible by 2, 3, 4, 6 for responsive grid
const PHOTOS_PER_PAGE = 24

interface PageProps {
  searchParams: Promise<{ page?: string }>
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

/**
 * Static metadata for photos page
 *
 * Note: We use static metadata here to allow the page to be pre-rendered.
 * Accessing searchParams in generateMetadata would make the route dynamic
 * and prevent static generation during build.
 *
 * The metadata is SEO-friendly and works for all paginated pages.
 * Dynamic content (page numbers, photo counts) is rendered in the page itself.
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch first page of photos to get total count and latest image
    const result = await client.fetch<{ photos: Photo[]; total: number }>(
      paginatedPhotosQuery,
      { start: 0, end: PHOTOS_PER_PAGE }
    )

    const { photos, total } = result

    // Get latest photo date for freshness indication
    const latestPhotoDate = photos.length > 0 && photos[0]._createdAt
      ? new Date(photos[0]._createdAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : null

    // Create description with photo count and latest additions
    const photoCountText = total === 1 ? '1 photograph' : `${total} photographs`
    const freshnessText = latestPhotoDate ? ` Latest additions from ${latestPhotoDate}.` : ''

    const description = `Browse my complete photography portfolio featuring ${photoCountText}.${freshnessText}`

    // Get Open Graph image from first photo
    const ogImage = photos.length > 0 ? getOGImageUrl(photos[0].image) : undefined

    return createMetadata({
      title: 'Photo Gallery',
      description,
      image: ogImage,
      path: '/photos',
    })
  } catch (error) {
    console.error('Error generating photos page metadata:', error)
    // Fallback metadata
    return createMetadata({
      title: 'Photo Gallery',
      description: 'Browse my complete photography portfolio showcasing fine art and editorial work.',
      path: '/photos',
    })
  }
}

export default async function PhotosPage({ searchParams }: PageProps) {
  // Parse and validate page number
  const params = await searchParams
  const rawPage = params.page
  const page = Math.max(1, Number(rawPage) || 1)

  // Fetch paginated photos
  const { photos, total } = await getPaginatedPhotos(page)

  // Calculate total pages
  const totalPages = Math.ceil(total / PHOTOS_PER_PAGE)

  // Calculate range for display
  const startRange = (page - 1) * PHOTOS_PER_PAGE + 1
  const endRange = Math.min(page * PHOTOS_PER_PAGE, total)

  // Generate JSON-LD structured data for page 1
  const jsonLd = page === 1 && photos.length > 0
    ? generateImageGalleryJsonLd(photos, 'Photo Gallery', 'Complete photography portfolio')
    : null

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* JSON-LD Structured Data for SEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Page Header - Minimal, elegant */}
      <header className="border-b border-[var(--border)] pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-20 lg:px-24 text-center">
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-normal text-[var(--foreground)] mb-6 md:mb-8 tracking-tight animate-fadeInUp">
            Photography
          </h1>
          <p className="text-sm uppercase tracking-[0.15em] text-[var(--subtle-text)]">
            {total > 0 ? (
              <>
                {startRange}–{endRange} of {total} Photograph{total === 1 ? '' : 's'}
              </>
            ) : (
              'Collection'
            )}
          </p>
        </div>
      </header>

      {/* Main Content - Generous spacing */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-20 lg:px-24 py-20 md:py-28 lg:py-32">
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
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6">
              <svg
                className="w-8 h-8 text-[var(--subtle-text)]"
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
            <h3 className="font-playfair text-2xl font-normal text-[var(--foreground)] mb-2">
              No photographs yet
            </h3>
            <p className="text-[var(--subtle-text)] text-sm">
              Add photographs in Sanity Studio to begin your collection.
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
