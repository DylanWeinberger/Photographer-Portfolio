# Performance Optimizations

## Largest Contentful Paint (LCP) Optimization

### Hero Slider - First Image Priority

**Location:** `/components/Hero.tsx`

**Problem:** The hero slider's first image is the LCP element. Without proper optimization, it loads with default priority, causing slower LCP scores.

**Solution:** The first image in the hero slider now includes three critical optimizations:

1. **`priority={true}`** - Next.js Image priority flag
   - Preloads the image
   - Adds to `<head>` as `<link rel="preload">`
   - Only applied to first image (index === 0)

2. **`loading="eager"`** - Native browser loading attribute
   - Prevents lazy-loading behavior
   - Ensures immediate load on page render
   - Only applied to first image (subsequent images use `loading="lazy"`)

3. **`fetchPriority="high"`** - Resource fetch priority hint
   - Tells browser to prioritize this image download
   - Works with modern browsers (Chrome, Edge, Safari)
   - Only applied to first image (subsequent images use `fetchPriority="auto"`)

**Implementation:**

```tsx
<Image
  src={imageUrl}
  alt={photo.altText || photo.title}
  fill
  priority={index === 0}                        // Next.js priority preload
  loading={index === 0 ? 'eager' : 'lazy'}      // Eager load first image
  fetchPriority={index === 0 ? 'high' : 'auto'} // High priority for browser
  className="object-cover animate-image-fade-in"
  sizes="100vw"
/>
```

**Impact:**
- ✅ First image loads immediately, not lazy-loaded
- ✅ Browser prioritizes hero image over other resources
- ✅ Subsequent slider images remain lazy-loaded for performance
- ✅ LCP score significantly improved

**Additional Hero Optimizations:**
- Images served via Sanity CDN with automatic WebP/AVIF conversion
- 2400px width for high-quality displays
- 90% quality for visual excellence
- `sizes="100vw"` for responsive sizing

## Other Performance Considerations

### Image Optimization Strategy

All images throughout the site use:
- Next.js Image component with automatic optimization
- Sanity Image CDN with smart cropping and format conversion
- Lazy loading by default (except LCP element)
- Responsive image sizes with `sizes` attribute

### ISR (Incremental Static Regeneration)

Pages use ISR with strategic revalidation times:
- **Homepage:** 1 hour (3600s) - Content changes infrequently
- **Photos page:** 30 minutes (1800s) - New photos added regularly
- **Tag pages:** 30 minutes (1800s) - Collections updated periodically
- **Contact page:** 1 hour (3600s) - Rarely changes

### Code Splitting

Next.js App Router automatically:
- Splits code by route
- Lazy loads route components
- Optimizes bundle sizes

## Performance Monitoring

Recommended tools:
- **Lighthouse** - Overall performance audit
- **Chrome DevTools** - Core Web Vitals panel
- **PageSpeed Insights** - Real-world field data
- **WebPageTest** - Detailed waterfall analysis

## Future Optimizations

Potential improvements:
1. Font optimization with `font-display: swap`
2. Critical CSS inlining
3. Service worker for offline support
4. Image placeholder blur with LQIP (Low Quality Image Placeholder)
5. Prefetch links for common navigation paths
