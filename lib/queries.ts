import { groq } from 'next-sanity'

/**
 * GROQ QUERIES
 *
 * Centralized location for all Sanity CMS queries.
 * Using groq template literal provides:
 * - Syntax highlighting in editors with GROQ support
 * - Better type inference
 * - Earlier error detection
 * - Consistent query formatting
 */

/**
 * HOMEPAGE QUERY
 *
 * Fetches the singleton homepage document with all sections.
 *
 * Query breakdown:
 * - *[_type == "homepage"] - Find all homepage documents
 * - [0] - Get first one (homepage is a singleton, only one exists)
 * - hero.heroPhotos[]-> - The []-> syntax "dereferences" the photo references,
 *                         returning full photo objects instead of just IDs
 *
 * Returns: Complete homepage data including:
 * - Hero section (headline, subheadline, photos, CTA)
 * - Featured section (heading, description)
 * - About section (heading, bio, profile image)
 */
export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    _id,
    _type,
    hero {
      headline,
      subheadline,
      heroPhotos[]-> {
        _id,
        title,
        image,
        altText,
        displayQuality,
        watermarkEnabled
      },
      showCTA,
      ctaText,
      ctaLink
    },
    featuredSection {
      heading,
      description
    },
    about {
      heading,
      bio,
      profileImage
    }
  }
`

/**
 * FEATURED PHOTOS QUERY
 *
 * Fetches photos marked as featured, sorted by creation date.
 * Used on the homepage to display a curated selection of work.
 *
 * Query breakdown:
 * - *[_type == "photo" && featured == true] - Filter for featured photos only
 * - | order(_createdAt desc) - Sort by creation date, newest first
 * - [0...6] - Array slice: get first 6 results (pagination)
 *
 * Returns: Array of up to 6 featured photos with display settings
 */
export const featuredPhotosQuery = groq`
  *[_type == "photo" && featured == true] | order(_createdAt desc) [0...6] {
    _id,
    title,
    image,
    altText,
    displayQuality,
    watermarkEnabled,
    featured
  }
`

/**
 * ALL PHOTOS QUERY
 *
 * Fetches all photos with comprehensive metadata.
 * Used on the /photos gallery page.
 *
 * Query breakdown:
 * - *[_type == "photo"] - Get all photo documents
 * - | order(featured desc, _createdAt desc) - Sort by:
 *   1. Featured status (featured photos first)
 *   2. Creation date (newest first)
 *
 * Returns: Array of all photos with complete metadata including:
 * - Image data and display settings
 * - Caption and alt text
 * - Location and timestamp
 * - Tags and featured status
 */
export const allPhotosQuery = groq`
  *[_type == "photo"] | order(featured desc, _createdAt desc) {
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
  }
`

/**
 * NAVIGATION QUERY
 *
 * Fetches the singleton navigation document with all menu items.
 * Menu items maintain their array order from CMS.
 *
 * Query breakdown:
 * - *[_type == "navigation"] - Find all navigation documents
 * - [0] - Get first one (navigation is a singleton, only one exists)
 * - menuItems[] - Get the array of menu items
 *
 * Returns: Navigation data with menu items including:
 * - Label and link type
 * - Internal/external link values
 * - New tab preference
 */
export const navigationQuery = groq`
  *[_type == "navigation"][0] {
    menuItems[] {
      label,
      linkType,
      internalLink,
      externalUrl,
      openInNewTab
    }
  }
`

/**
 * SETTINGS QUERY
 *
 * Fetches site-wide settings including logo, title, and social links.
 * Used in header and footer components.
 *
 * Query breakdown:
 * - *[_type == "settings"] - Find all settings documents
 * - [0] - Get first one (settings is a singleton, only one exists)
 *
 * Returns: Site-wide settings including:
 * - Site title and description
 * - Logo image reference
 * - Social media links
 * - Footer configuration
 */
export const settingsQuery = groq`
  *[_type == "settings"][0] {
    siteTitle,
    siteDescription,
    logo,
    socialLinks,
    footer
  }
`

/**
 * TAG BY SLUG QUERY
 *
 * Fetches a single tag by its slug along with all photos that have that tag.
 * This query powers individual tag pages at /tag/[slug].
 *
 * Query breakdown:
 * - *[_type == "tag" && slug.current == $slug] - Find tag with matching slug
 * - [0] - Get first match (slugs are unique)
 * - "photos": *[...] - Nested query to find all photos with this tag
 * - references(^._id) - Find photos that reference this tag's ID
 * - []-> dereferences the photo array to get full photo objects
 *
 * Parameters:
 * - $slug: string - The tag slug to search for
 *
 * Returns: Tag data with associated photos including:
 * - Tag metadata (name, display name, descriptions, hero image)
 * - Color scheme and layout settings
 * - Navigation settings
 * - Array of all photos tagged with this tag
 */
export const tagBySlugQuery = groq`
  *[_type == "tag" && slug.current == $slug][0] {
    _id,
    _type,
    name,
    slug,
    displayName,
    headerText,
    subheader,
    description,
    heroImage-> {
      _id,
      title,
      image,
      altText,
      displayQuality,
      watermarkEnabled
    },
    layout,
    colorScheme,
    showInNav,
    navOrder,
    "photos": *[_type == "photo" && references(^._id)] | order(_createdAt desc) {
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
    }
  }
`