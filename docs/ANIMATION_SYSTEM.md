# Animation System - Fine Art Gallery Aesthetic

## Philosophy

This portfolio follows a **fine art gallery aesthetic** with animations that are:
- **Slow and deliberate** (0.6-0.8s duration)
- **Contemplative** (gallery exhibition pace)
- **Subtle** (never competing with photography)
- **Accessible** (respects `prefers-reduced-motion`)

## Animation Variants

### 1. Simple Fade In (`animate-fadeIn`)

**Purpose:** Text elements, UI components
**Duration:** 0.6s
**Easing:** ease-out
**Effect:** Opacity 0 → 1

**Usage:**
```html
<h1 className="animate-fadeIn">Your Heading</h1>
```

**Applied to:**
- Hero text (with 0.6s delay)
- UI elements

---

### 2. Fade In + Slight Rise (`animate-fadeInUp`)

**Purpose:** Section headings, card elements
**Duration:** 0.8s
**Easing:** ease-out
**Effect:**
- Opacity: 0 → 1
- Transform: translateY(20px) → translateY(0)

**Usage:**
```html
<h2 className="animate-fadeInUp">Section Heading</h2>
```

**Applied to:**
- Page headings (Photos, Contact, Tag pages)
- Featured section heading
- Photo grid items (first 6)

---

## Stagger Delays

For lists and grids, apply incremental delays to create a cascading entrance effect.

**Available Delays:**
- `animate-delay-100` - 0.1s
- `animate-delay-150` - 0.15s
- `animate-delay-200` - 0.2s
- `animate-delay-250` - 0.25s
- `animate-delay-300` - 0.3s
- `animate-delay-350` - 0.35s
- `animate-delay-600` - 0.6s (hero text)

**Usage:**
```html
<div className="animate-fadeInUp animate-delay-100">Item 1</div>
<div className="animate-fadeInUp animate-delay-150">Item 2</div>
<div className="animate-fadeInUp animate-delay-200">Item 3</div>
```

**Constraint:** Only stagger first 6 items maximum (gallery aesthetic - don't over-animate)

---

## Components

### AnimateOnScroll Component

For scroll-triggered animations using Intersection Observer.

**Usage:**
```tsx
import AnimateOnScroll from '@/components/AnimateOnScroll'

<AnimateOnScroll animation="fadeInUp">
  <h2>Your Heading</h2>
</AnimateOnScroll>
```

**Props:**
- `animation?: 'fadeIn' | 'fadeInUp'` - Animation type (default: 'fadeIn')
- `delay?: number` - Delay in ms (default: 0)
- `threshold?: number` - Intersection threshold (default: 0.1)
- `className?: string` - Additional CSS classes

**Features:**
- Triggers when element enters viewport
- Unobserves after triggering (no re-animation)
- 50px rootMargin for early trigger
- Respects `prefers-reduced-motion` via CSS

**Applied to:**
- Featured section heading on homepage

---

## Implementation Details

### CSS Location
All animations defined in `/app/globals.css`:

```css
/* Variant 1: Simple Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Variant 2: Fade In + Slight Rise */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Performance Optimizations

1. **GPU-Accelerated Properties**
   - Uses only `opacity` and `transform`
   - Both are GPU-accelerated for 60fps

2. **animation-fill-mode: both**
   - Maintains end state after animation
   - Prevents flash before animation starts

3. **No JavaScript Animations**
   - Pure CSS for performance
   - Intersection Observer only for triggering (not animating)

---

## Accessibility

### Reduced Motion Support

Users who prefer reduced motion see instant appearance (no animation).

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  .animate-fadeIn,
  .animate-fadeInUp {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

**How it works:**
- Detects system preference
- Disables all animations
- Sets instant final state
- Maintains layout and functionality

---

## Current Applications

### ✅ Phase 1 - Implemented

**Homepage:**
- Hero headline - `animate-fadeIn` + 0.6s delay
- Hero subheadline - `animate-fadeIn` + 0.6s delay
- Hero CTA - `animate-fadeIn` + 0.6s delay
- Featured section heading - `animate-fadeInUp` (on scroll)
- First 6 photos - `animate-fadeInUp` with staggered delays (0.05s increment)

**Photos Page:**
- Page heading - `animate-fadeInUp`
- First 6 photos - `animate-fadeInUp` with staggered delays

**Tag Pages:**
- Page heading - `animate-fadeInUp`
- First 6 photos - `animate-fadeInUp` with staggered delays

**Contact Page:**
- Page heading - `animate-fadeInUp`

### ❌ Not Animated (By Design)

- Navigation (should be immediately visible)
- Footer (static, always visible)
- Pagination controls (functional, not decorative)
- Form inputs (functional elements)
- Photos beyond first 6 (reduces visual noise)

---

## Usage Guidelines

### When to Animate ✅

- **First impression elements** - Hero, page headings
- **Section introductions** - Featured section heading
- **Initial content** - First 4-6 photos in grid
- **Attention-worthy changes** - Modal opening, lightbox

### When NOT to Animate ❌

- **Navigation** - Must be instantly accessible
- **Functional elements** - Forms, buttons (use hover only)
- **Repeated content** - Don't animate entire grids
- **Critical information** - Error messages, warnings
- **Below-the-fold repeated sections** - Avoid animation fatigue

---

## Performance Testing

### Expected Metrics
- **FPS:** 60fps during animations
- **Layout Shift:** None (animations use transform/opacity only)
- **Bundle Size:** <1KB CSS overhead
- **JavaScript:** Minimal (only Intersection Observer)

### Testing Commands
```bash
# Run Lighthouse in Chrome DevTools
# Check Performance score
# Verify "Cumulative Layout Shift" is 0

# Test with slow network
# Animations should still be smooth
```

---

## Design Principles

### Timing
- **Standard:** 0.6-0.8s (never faster)
- **Hero elements:** 0.6s delay on mount
- **Stagger increment:** 0.05s per item
- **Maximum stagger:** 0.3s (6 items)

### Easing
- **ease-out** - Default (starts fast, ends slow)
- **ease-in-out** - For two-way animations (future use)
- **Never linear** - Too mechanical for gallery aesthetic

### Movement
- **translateY only** - Vertical rise (20px)
- **No rotation** - Too playful
- **No scale** - Too dramatic
- **No horizontal movement** - Can feel jarring

### Delays
- **Minimal use** - Only for stagger and hero
- **Purposeful** - Must enhance, not slow down
- **Consistent increment** - 0.05s for stagger

---

## Future Enhancements

### Potential Additions (If Needed)

1. **Parallax Scrolling** (very subtle)
   - Hero image slight movement on scroll
   - Maximum 10-20px translate
   - Only on desktop
   - Must maintain 60fps

2. **Image Reveal** (on hover in grid)
   - Subtle brightness increase (already implemented)
   - Could add very slight scale (1.02x)
   - Duration: 0.8s

3. **Modal Animations**
   - Lightbox fade in
   - Info panel slide (already implemented)
   - Keep slow (0.6s+)

4. **Page Transitions** (Next.js 15+)
   - Crossfade between routes
   - 0.4s duration
   - Only if seamless

### What to Avoid ❌

- Fast animations (<0.4s)
- Bouncy easing
- Complex transforms
- Excessive movement
- Auto-playing carousels (except hero with 7s delay)
- Infinite animations
- Sound effects

---

## Troubleshooting

### Animation Not Appearing

1. **Check class name spelling**
   ```html
   <!-- Correct -->
   <div className="animate-fadeInUp">

   <!-- Wrong -->
   <div className="animate-fadeinup">
   ```

2. **Check for conflicting styles**
   - Element might have `display: none`
   - Parent might have `overflow: hidden`

3. **Test with reduced motion OFF**
   - System Settings → Accessibility → Motion
   - Disable "Reduce motion" to see animations

### Animation Janky/Stuttering

1. **Check element count**
   - Only animate first 6 items
   - Too many animations = poor performance

2. **Avoid layout properties**
   - Don't animate `width`, `height`, `margin`
   - Stick to `opacity` and `transform`

3. **Check for will-change overuse**
   - Should only be on actively animating elements
   - Remove after animation completes

### Animation Too Fast/Slow

- Edit duration in `/app/globals.css`
- `fadeIn`: 0.6s
- `fadeInUp`: 0.8s
- Always test on actual device

---

## Code References

**CSS Animations:**
`/app/globals.css` - Lines 127-239

**AnimateOnScroll Component:**
`/components/AnimateOnScroll.tsx`

**PhotoGrid Component (with stagger):**
`/components/PhotoGrid.tsx` - Lines 60-64

**Hero Component (with delays):**
`/components/Hero.tsx` - Lines 114-130

---

## Changelog

### 2024-11-17 - Initial Implementation
- Created 2 animation variants (fadeIn, fadeInUp)
- Added stagger delays (6 variants)
- Applied to homepage hero text
- Applied to section headings across site
- Applied to first 6 photos in grids
- Added accessibility (prefers-reduced-motion)
- Created AnimateOnScroll component
- Build verified - no errors

---

## Resources

- [Web Animation Guidelines](https://web.dev/animations-guide/)
- [Reduced Motion Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [GPU Accelerated Properties](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
