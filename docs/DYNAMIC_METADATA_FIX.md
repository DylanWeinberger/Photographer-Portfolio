# Dynamic Metadata Fix for Paginated Pages

## Problem

Pages with pagination were failing to build with this error:
```
Error: Dynamic server usage: Route /photos couldn't be rendered statically because it used `await searchParams`, `searchParams.then`, or similar
```

## Root Cause

In Next.js 15+, accessing `searchParams` in the `generateMetadata` function makes the entire route dynamic and prevents static generation during build time. This happened on:
- `/app/photos/page.tsx` - Photo gallery with pagination
- `/app/tag/[slug]/page.tsx` - Tag collection pages with pagination

## Solution

### Key Principle
**Separate metadata generation from page rendering:**
- `generateMetadata()` - Should NOT access `searchParams` (static metadata)
- Page component - CAN access `searchParams` for pagination logic (dynamic rendering)

### Implementation

#### Before (Broken)
```typescript
export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  // ❌ This makes the route dynamic and breaks build
  
  return {
    title: page === 1 ? 'Gallery' : `Gallery - Page ${page}`,
    // ...
  }
}
```

#### After (Fixed)
```typescript
export async function generateMetadata(): Promise<Metadata> {
  // ✅ No searchParams access - metadata is static
  // Fetch data for first page to get total count and images
  const result = await client.fetch(query, { start: 0, end: 24 })
  
  return {
    title: 'Photo Gallery',
    description: `Browse my portfolio featuring ${total} photographs`,
    // ...
  }
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  // ✅ Page component CAN use searchParams
  // ...
}
```

## Files Modified

### 1. `/app/photos/page.tsx`

**Changes:**
- Removed `searchParams` parameter from `generateMetadata()`
- Metadata now uses data from first page (page 1)
- Still includes dynamic photo count and latest date
- Page component still uses `searchParams` for pagination

**Result:**
- Build succeeds ✅
- SEO metadata remains comprehensive
- Pagination works correctly
- ISR revalidation maintained (30 minutes)

### 2. `/app/tag/[slug]/page.tsx`

**Changes:**
- Removed `searchParams` parameter from `generateMetadata()`
- Metadata now based only on `params.slug` (static)
- Fetches first page of tag photos for count/images
- Page component still uses `searchParams` for pagination

**Result:**
- Build succeeds ✅
- SEO metadata includes tag name, description, photo count
- Pagination works correctly
- ISR revalidation maintained (30 minutes)

## Impact on SEO

### What We Kept ✅
- Dynamic photo counts from CMS
- Latest photo dates for freshness
- Open Graph images from actual photos
- Tag-specific titles and descriptions
- Canonical URLs
- JSON-LD structured data

### What Changed 📝
- Metadata no longer shows page numbers (e.g., "Page 2 of 5")
- All paginated pages share the same metadata
- Open Graph images always from first page

### Why This is Acceptable

1. **Search engines primarily index page 1** - Paginated pages rarely get indexed as separate entities
2. **Users share page 1 URLs** - Social media shares almost always use the base URL
3. **Better performance** - Static metadata generation is faster
4. **Cleaner URLs** - Canonical URL points to base path without query params

## Build Results

### Before Fix
```
Error generating photos page metadata: Error: Dynamic server usage...
Build failed ❌
```

### After Fix
```
✓ Compiled successfully in 31.4s
✓ Generating static pages (10/10)

Route (app)              Revalidate  Expire
├ ƒ /photos              30m         1y
└ ƒ /tag/[slug]          30m         1y

Build succeeded ✅
```

## Testing Checklist

- [x] Build succeeds without errors
- [x] Homepage metadata works
- [x] Photos page metadata includes photo count
- [x] Tag page metadata includes tag description
- [x] Pagination navigation works correctly
- [x] ISR revalidation times maintained
- [x] Open Graph images display correctly
- [x] JSON-LD structured data renders

## Best Practices for Future

### ✅ DO
- Use `generateMetadata()` for SEO-critical static metadata
- Access `params` in `generateMetadata()` for dynamic routes
- Fetch CMS data to populate metadata
- Use `searchParams` in page components for UI logic

### ❌ DON'T
- Access `searchParams` in `generateMetadata()`
- Make metadata depend on query parameters
- Use cookies or headers in `generateMetadata()`
- Rely on client-side data in metadata

## Related Documentation

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Static and Dynamic Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

## Questions?

**Q: Why do paginated pages show the same metadata?**
A: This is a Next.js limitation. Metadata must be static to allow pre-rendering. Pagination is a UI concern, not an SEO concern.

**Q: Will this hurt SEO?**
A: No. Search engines primarily care about page 1 content. Paginated pages are usually marked with `rel="next"` and `rel="prev"` (which we could add if needed).

**Q: Can we add page numbers back to titles?**
A: Not without making the route fully dynamic. The trade-off isn't worth it for SEO.

**Q: What about social media shares of page 2, 3, etc.?**
A: Very rare. Users share collections, not specific pages. If needed, client-side JavaScript could update meta tags, but it won't affect SSR.
