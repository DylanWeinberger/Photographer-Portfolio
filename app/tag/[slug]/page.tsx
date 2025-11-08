import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { tagBySlugQuery, paginatedTagPhotosQuery } from '@/lib/queries'
import { getColorSchemeStyles } from '@/lib/colorSchemes'
import { getFullImageUrl } from '@/lib/imageBuilder'
import type { Tag, Photo } from '@/types/sanity'
import PhotoGrid from '@/components/PhotoGrid'
import Pagination from '@/components/Pagination'

/**
 * TAG PAGE - Dynamic Route with Pagination
 *
 * Displays a tag page at /tag/[slug] with:
 * - Tag information (header, subheader, description)
 * - Optional hero image
 * - Paginated photos tagged with this tag
 * - Custom color scheme
 * - Custom layout (grid-3, grid-4, masonry)
 *
 * This approach combines tag-based organization with page-like customization.
 */

// Photos per page - divisible by 2, 3, 4, 6 for responsive grid
const PHOTOS_PER_PAGE = 24

interface TagPageData extends Tag {
  photos: Photo[]
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{ page?: string }>
}

/**
 * Fetch tag data (metadata only, without photos)
 */
async function getTagData(slug: string): Promise<TagPageData | null> {
  try {
    const data = await client.fetch<TagPageData>(
      tagBySlugQuery,
      { slug },
      {
        // Revalidate every 60 seconds
        next: { revalidate: 60 }
      }
    )
    return data
  } catch (error) {
    console.error('Error fetching tag data:', error)
    return null
  }
}

/**
 * Fetch paginated photos for a specific tag
 */
async function getPaginatedTagPhotos(slug: string, page: number): Promise<{
  photos: Photo[]
  total: number
}> {
  try {
    const start = (page - 1) * PHOTOS_PER_PAGE
    const end = start + PHOTOS_PER_PAGE

    const result = await client.fetch<{ photos: Photo[]; total: number }>(
      paginatedTagPhotosQuery,
      { slug, start, end },
      {
        // Cache for 60 seconds, then revalidate in background
        next: { revalidate: 60 },
      }
    )

    return result
  } catch (error) {
    console.error('Error fetching paginated tag photos:', error)
    return { photos: [], total: 0 }
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params, searchParams }: PageProps) {
  const { slug } = await params
  const tagData = await getTagData(slug)
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1

  if (!tagData) {
    return {
      title: 'Tag Not Found',
    }
  }

  const title = tagData.displayName || tagData.name
  const description = tagData.description || `View all ${tagData.name} photos`

  if (page === 1) {
    return {
      title: `${title} | Photographer Portfolio`,
      description,
    }
  }

  return {
    title: `${title} - Page ${page} | Photographer Portfolio`,
    description: `${description} - Page ${page}`,
  }
}

/**
 * Tag Page Component
 */
export default async function TagPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const tagData = await getTagData(slug)

  // Handle 404 if tag doesn't exist
  if (!tagData) {
    notFound()
  }

  // Parse and validate page number
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  // Fetch paginated photos
  const { photos, total } = await getPaginatedTagPhotos(slug, page)

  // Calculate total pages
  const totalPages = Math.ceil(total / PHOTOS_PER_PAGE)

  // Calculate range for display
  const startRange = (page - 1) * PHOTOS_PER_PAGE + 1
  const endRange = Math.min(page * PHOTOS_PER_PAGE, total)

  // Get color scheme styles
  const colors = getColorSchemeStyles(tagData.colorScheme)

  // Determine header and subheader text
  const headerText = tagData.headerText || tagData.displayName || tagData.name
  const subheaderText = tagData.subheader

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.backgroundColor,
        color: colors.textColor,
      }}
    >
      {/* Hero Image (if provided) */}
      {tagData.heroImage && (
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative w-full h-64 md:h-96 lg:h-[32rem] rounded-lg overflow-hidden">
              <img
                src={getFullImageUrl(tagData.heroImage.image, tagData.heroImage.displayQuality)}
                alt={tagData.heroImage.altText || tagData.heroImage.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <header className="border-b" style={{ borderColor: `${colors.textColor}20` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {headerText}
          </h1>
          {subheaderText && (
            <p className="text-xl md:text-2xl opacity-80 mb-4">
              {subheaderText}
            </p>
          )}
          {tagData.description && (
            <p className="text-base md:text-lg opacity-70 max-w-3xl">
              {tagData.description}
            </p>
          )}
          <p className="mt-4 text-sm opacity-60">
            {total > 0 ? (
              <>
                Showing {startRange}–{endRange} of {total} photo
                {total === 1 ? '' : 's'}
              </>
            ) : (
              '0 photos'
            )}
          </p>
        </div>
      </header>

      {/* Photos Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {photos.length > 0 ? (
          <>
            <PhotoGrid photos={photos} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/tag/${slug}`}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: `${colors.textColor}10` }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: colors.textColor, opacity: 0.4 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1">No photos yet</h3>
            <p style={{ opacity: 0.6 }}>
              Photos tagged with &quot;{tagData.name}&quot; will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

/**
 * Enable dynamic rendering
 * This ensures the page is rendered on each request to show the latest photos
 */
export const dynamic = 'force-dynamic'
