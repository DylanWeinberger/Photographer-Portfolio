import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { tagBySlugQuery } from '@/lib/queries'
import { getColorSchemeStyles } from '@/lib/colorSchemes'
import { getFullImageUrl } from '@/lib/imageBuilder'
import type { Tag, Photo } from '@/types/sanity'
import PhotoGrid from '@/components/PhotoGrid'

/**
 * TAG PAGE - Dynamic Route
 *
 * Displays a tag page at /tag/[slug] with:
 * - Tag information (header, subheader, description)
 * - Optional hero image
 * - All photos tagged with this tag
 * - Custom color scheme
 * - Custom layout (grid-3, grid-4, masonry)
 *
 * This approach combines tag-based organization with page-like customization.
 */

interface TagPageData extends Tag {
  photos: Photo[]
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Fetch tag data and associated photos
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
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const tagData = await getTagData(slug)

  if (!tagData) {
    return {
      title: 'Tag Not Found',
    }
  }

  const title = tagData.displayName || tagData.name
  const description = tagData.description || `View all ${tagData.name} photos`

  return {
    title: `${title} | Photographer Portfolio`,
    description,
  }
}

/**
 * Tag Page Component
 */
export default async function TagPage({ params }: PageProps) {
  const { slug } = await params
  const tagData = await getTagData(slug)

  // Handle 404 if tag doesn't exist
  if (!tagData) {
    notFound()
  }

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
            {tagData.photos.length} photo{tagData.photos.length === 1 ? '' : 's'}
          </p>
        </div>
      </header>

      {/* Photos Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tagData.photos.length > 0 ? (
          <PhotoGrid photos={tagData.photos} />
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
