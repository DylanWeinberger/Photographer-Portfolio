# SEO Metadata Implementation

This document describes the comprehensive SEO metadata implementation for the photographer portfolio.

## Overview

All pages include:
- **Dynamic metadata** generated from Sanity CMS content
- **Open Graph tags** for social media sharing (Facebook, LinkedIn, etc.)
- **Twitter Card tags** for Twitter/X sharing
- **Canonical URLs** to prevent duplicate content issues
- **JSON-LD structured data** for enhanced search engine understanding
- **Responsive images** optimized for social sharing (1200x630px)

## Configuration

### Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Production: https://yourdomain.com
```

### Site Configuration

Edit `/lib/metadata.ts` to customize:

```typescript
export const siteConfig = {
  name: 'Henry Jaffe Photography',
  description: 'Professional photography portfolio showcasing fine art and editorial work',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://henryjaffephotography.com',
  ogImage: '/og-default.jpg', // Default fallback image
  twitterHandle: '@henryjaffe', // Update with actual Twitter handle
}
```

## Page-by-Page Implementation

### 1. Homepage (`/`)

**Dynamic Content:**
- Title from hero headline or default
- Description from hero subheadline or featured section
- Open Graph image from first featured photo or hero photo

**Structured Data:**
- `ImageGallery` schema for featured photos
- Includes up to 10 featured photos in gallery

**Example Output:**
```html
<title>Henry Jaffe Photography</title>
<meta name="description" content="Professional photography portfolio..." />
<meta property="og:image" content="https://cdn.sanity.io/.../photo.jpg" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Featured Work",
  "creator": { "@type": "Person", "name": "Henry Jaffe Photography" }
}
</script>
```

### 2. Photos Page (`/photos`)

**Dynamic Content:**
- Total photo count in description
- Latest photo date for freshness indication
- Open Graph image from first photo on current page
- Pagination-aware titles and descriptions

**Structured Data:**
- `ImageGallery` schema on page 1
- Includes photos from current page

**Example Output:**
```html
<title>Photo Gallery | Henry Jaffe Photography</title>
<meta name="description" content="Browse my complete photography portfolio featuring 48 photographs. Latest additions from November 2024." />
<meta property="og:image" content="https://cdn.sanity.io/.../photo.jpg" />
```

### 3. Tag Pages (`/tag/[slug]`)

**Dynamic Content:**
- Title from tag's displayName or headerText
- Description from tag description with photo count
- Open Graph image from hero image or first photo
- Pagination support

**Structured Data:**
- `ImageGallery` schema on page 1
- Uses tag name and description

**Example Output:**
```html
<title>Landscape Photography | Henry Jaffe Photography</title>
<meta name="description" content="Explore 24 photographs in the landscape collection." />
<meta property="og:image" content="https://cdn.sanity.io/.../hero.jpg" />
```

### 4. Contact Page (`/contact`)

**Dynamic Content:**
- Description pulls from site settings if available
- Includes call-to-action about commissions and editorial work

**Structured Data:**
- `ContactPage` schema
- `Person` schema with contact information
- Email included if available in settings

**Example Output:**
```html
<title>Contact | Henry Jaffe Photography</title>
<meta name="description" content="Get in touch to discuss photography projects, collaborations, or inquiries." />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "mainEntity": {
    "@type": "Person",
    "name": "Henry Jaffe Photography",
    "email": "contact@example.com"
  }
}
</script>
```

### 5. Root Layout (`/layout.tsx`)

**Global Metadata:**
- Sets `metadataBase` for all relative URLs
- Title template: `%s | Henry Jaffe Photography`
- Default description and keywords
- Robots configuration for optimal indexing
- Google Bot specific directives

## Metadata Utilities

### `createMetadata()`

Main utility function for generating consistent metadata across pages.

```typescript
import { createMetadata } from '@/lib/metadata'

const metadata = createMetadata({
  title: 'Page Title',
  description: 'Page description',
  image: 'https://example.com/image.jpg', // Optional
  path: '/page-path',
  noIndex: false, // Optional, defaults to false
  type: 'website', // or 'article'
})
```

### `getOGImageUrl()`

Generates optimized Open Graph images from Sanity images:

```typescript
import { getOGImageUrl } from '@/lib/metadata'

const ogImage = getOGImageUrl(photo.image)
// Returns: "https://cdn.sanity.io/...?w=1200&h=630&fit=crop&q=85"
```

### `getCanonicalUrl()`

Creates proper canonical URLs:

```typescript
import { getCanonicalUrl } from '@/lib/metadata'

const canonical = getCanonicalUrl('/photos')
// Returns: "https://henryjaffephotography.com/photos"
```

### JSON-LD Generators

Generate structured data for different content types:

```typescript
import {
  generateImageGalleryJsonLd,
  generatePhotoJsonLd,
  generatePhotographerJsonLd,
} from '@/lib/metadata'

// For galleries
const galleryData = generateImageGalleryJsonLd(photos, 'Gallery Name', 'Description')

// For individual photos
const photoData = generatePhotoJsonLd(photo)

// For about/contact pages
const photographerData = generatePhotographerJsonLd()
```

## Social Media Preview

### Open Graph (Facebook, LinkedIn)

All pages include:
- `og:type` - 'website' or 'article'
- `og:locale` - 'en_US'
- `og:url` - Canonical URL
- `og:site_name` - Site name
- `og:title` - Page title
- `og:description` - Page description
- `og:image` - 1200x630px optimized image

### Twitter Cards

All pages include:
- `twitter:card` - 'summary_large_image'
- `twitter:title` - Page title
- `twitter:description` - Page description
- `twitter:image` - Same as Open Graph image
- `twitter:creator` - Photographer's Twitter handle

## Best Practices Implemented

### ✅ Dynamic Content
- Metadata pulls from CMS (Sanity) when possible
- Fallbacks for missing data
- Error handling for failed fetches

### ✅ Image Optimization
- Open Graph images: 1200x630px (Facebook recommended)
- Automatic format conversion (WebP when supported)
- Quality optimization (85% for balance of size/quality)
- Crop to maintain aspect ratio

### ✅ Canonical URLs
- Prevents duplicate content penalties
- Handles pagination correctly
- Absolute URLs (required by search engines)

### ✅ Structured Data
- JSON-LD format (Google recommended)
- Schema.org vocabulary
- Rich snippets eligible for:
  - Image search results
  - Gallery carousels
  - Contact information
  - Author attribution

### ✅ Pagination Handling
- Page numbers in titles for pages 2+
- Updated descriptions per page
- Fresh Open Graph images per page
- Proper canonical URLs

### ✅ Performance
- Metadata generated at build time (ISR)
- Cached with page data
- No client-side fetching
- Parallel data fetching where possible

## Testing Your Metadata

### 1. Local Testing

View page source and search for:
```html
<meta property="og:
<meta name="twitter:
<link rel="canonical"
<script type="application/ld+json">
```

### 2. Social Media Debuggers

**Facebook/Meta:**
https://developers.facebook.com/tools/debug/

**Twitter:**
https://cards-dev.twitter.com/validator

**LinkedIn:**
https://www.linkedin.com/post-inspector/

### 3. Google Rich Results Test

https://search.google.com/test/rich-results

Test your JSON-LD structured data here.

### 4. Schema Markup Validator

https://validator.schema.org/

Validates JSON-LD syntax and structure.

## Troubleshooting

### Issue: Images not showing in social previews

**Solution:**
1. Ensure `NEXT_PUBLIC_SITE_URL` is set correctly in production
2. Verify images are publicly accessible
3. Check image dimensions (should be at least 1200x630)
4. Clear social media cache using debugger tools

### Issue: Canonical URLs pointing to localhost

**Solution:**
Update `NEXT_PUBLIC_SITE_URL` in your production environment variables.

### Issue: Dynamic metadata not updating

**Solution:**
1. Check ISR revalidation times in page files
2. Use on-demand revalidation: `/api/revalidate?secret=YOUR_SECRET`
3. Clear Next.js cache: `rm -rf .next`

### Issue: Missing Open Graph images

**Solution:**
1. Ensure photos have images in Sanity
2. Check Sanity image asset permissions (should be public)
3. Verify `urlFor()` configuration in `/sanity/lib/image.ts`

## Production Checklist

Before deploying:

- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Update Twitter handle in `/lib/metadata.ts`
- [ ] Create default OG image at `/public/og-default.jpg` (1200x630px)
- [ ] Test all pages with social media debuggers
- [ ] Verify JSON-LD with Google Rich Results Test
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics (optional)
- [ ] Configure robots.txt if needed

## Future Enhancements

Potential additions:

1. **Individual Photo Pages**
   - Dedicated pages for each photo
   - Full EXIF data in metadata
   - High-resolution previews
   - Share buttons

2. **Sitemap Generation**
   - Dynamic XML sitemap
   - Include all photos and tags
   - Update frequency hints
   - Priority levels

3. **RSS Feed**
   - Latest photos feed
   - Tag-specific feeds
   - Featured photos feed

4. **Breadcrumb Schema**
   - Navigation breadcrumbs
   - Structured data markup
   - Better UX and SEO

5. **Multiple Languages**
   - i18n support
   - `hreflang` tags
   - Locale-specific metadata

## Additional Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
