import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { tagBySlugQuery, paginatedTagPhotosQuery } from '@/lib/queries'
import { getFullImageUrl } from '@/lib/imageBuilder'
import type { Tag, Photo } from '@/types/sanity'
import PhotoGrid from '@/components/PhotoGrid'
import Pagination from '@/components/Pagination'
import { createMetadata, getOGImageUrl, generateImageGalleryJsonLd } from '@/lib/metadata'

/**
 * TAG PAGE - Dynamic Route with Pagination
 *
 * Displays a tag page at /tag/[slug] with:
 * - Tag information (header, subheader, description)
 * - Optional hero image
 * - Paginated photos tagged with this tag
 * - Dark theme styling
 * - Custom layout (rows2 or masonry)
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
 * Generate comprehensive metadata for SEO
 *
 * Note: We use static metadata (based only on params, not searchParams)
 * to allow the page to be pre-rendered. Accessing searchParams would make
 * the route dynamic and prevent static generation during build.
 *
 * The metadata works for all paginated pages of a tag collection.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const tagData = await getTagData(slug)

    if (!tagData) {
      return {
        title: 'Tag Not Found',
        description: 'The requested collection could not be found.',
      }
    }

    // Fetch first page of photos to get count and images for OG
    const { photos, total } = await client.fetch<{ photos: Photo[]; total: number }>(
      paginatedTagPhotosQuery,
      { slug, start: 0, end: PHOTOS_PER_PAGE }
    )

    // Build title from tag data
    const title = tagData.displayName || tagData.headerText || tagData.name

    // Build description with photo count
    const photoCountText = total === 1 ? '1 photograph' : `${total} photographs`
    const description = tagData.description ||
      `Explore ${photoCountText} in the ${tagData.name} collection.`

    // Get Open Graph image - priority: hero image, first photo, fallback
    let ogImage: string | undefined
    if (tagData.heroImage?.image) {
      ogImage = getOGImageUrl(tagData.heroImage.image)
    } else if (photos.length > 0) {
      ogImage = getOGImageUrl(photos[0].image)
    }

    return createMetadata({
      title,
      description,
      image: ogImage,
      path: `/tag/${slug}`,
    })
  } catch (error) {
    console.error('Error generating tag page metadata:', error)
    const { slug } = await params

    // Fallback metadata
    return createMetadata({
      title: 'Photo Collection',
      description: 'Browse this photography collection',
      path: `/tag/${slug}`,
    })
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

  // Determine header and subheader text
  const headerText = tagData.headerText || tagData.displayName || tagData.name
  const subheaderText = tagData.subheader

  // Generate JSON-LD structured data for page 1
  const jsonLd = page === 1 && photos.length > 0
    ? generateImageGalleryJsonLd(
        photos,
        headerText,
        tagData.description || tagData.subheader
      )
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
            {/* Header Section - Generous spacing, editorial layout */}
      <header className="border-b border-[var(--border)] pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-20 lg:px-24 text-center">
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-normal text-[var(--foreground)] mb-6 md:mb-8 tracking-tight animate-fadeInUp">
            {headerText}
          </h1>
          <p className="mt-8 text-sm uppercase tracking-[0.15em] text-[var(--subtle-text)]">
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
      {/* Hero Image (if provided) - Full width, subtle presentation */}
      {tagData.heroImage && (
        <div className="w-full pt-20 md:pt-24">
          <div className="max-w-[1800px] mx-auto px-6 md:px-20 lg:px-24">
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden image-border">
              <img
                src={getFullImageUrl(tagData.heroImage.image, tagData.heroImage.displayQuality)}
                alt={tagData.heroImage.altText || tagData.heroImage.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Photos Grid - Generous spacing */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-20 lg:px-24 py-20 md:py-28 lg:py-32">
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
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-[var(--surface)]">
              <svg
                className="w-8 h-8 text-[var(--subtle-text)] opacity-40"
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
            <h3 className="font-playfair text-2xl font-normal text-[var(--foreground)] mb-2">No photographs in this collection</h3>
            <p className="text-sm text-[var(--subtle-text)]">
              Photographs tagged with &quot;{tagData.name}&quot; will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

// ISR: Revalidate every 30 minutes (1800 seconds)
// Reasoning: Tag collections change when photos are added, removed, or retagged
// 30 minutes ensures content freshness while providing excellent cached performance
// Each tag slug is cached independently - first request generates, subsequent requests served from cache
// Works seamlessly with pagination - each page is cached separately
export const revalidate = 1800
