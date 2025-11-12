# Custom Cursor Documentation

**Editorial Enhancement for Fine Art Photography Portfolio**

The custom cursor adds a sophisticated, gallery-quality interaction layer to the portfolio, enhancing the editorial aesthetic without being gimmicky or distracting.

---

## Design Overview

### Cursor Style: Dot + Ring

**Philosophy:**
- Minimal, sophisticated presence
- Editorial magazine / gallery catalog feel
- Subtle enhancement, not attention-grabbing
- Complements dark, moody design system

**Visual Components:**
1. **Center Dot** - Small (6px), solid, fast-following
2. **Trailing Ring** - Larger (32px), outline, slow-following with parallax effect

**Why This Design:**
- Most editorial and dynamic of cursor options
- Trailing ring creates sophisticated parallax effect
- Clear visual feedback for interaction states
- Fits perfectly with fine art aesthetic

---

## Technical Implementation

### Component Architecture

**File:** `components/CustomCursor.tsx`

**Type:** Client component ('use client')
- Requires mouse tracking
- Manages cursor position and state
- Renders only on desktop with hover capability

**Key Technologies:**
- **RAF (RequestAnimationFrame)** - Smooth 60fps cursor movement
- **Lerp (Linear Interpolation)** - Smooth following with easing
- **GPU-Accelerated Transforms** - translate3d for performance
- **React Hooks** - useRef for position tracking, useEffect for listeners

---

## Cursor States

### Default State
**When:** Normal browsing, no hover
**Visual:**
- Dot: 6px, white
- Ring: 32px, white outline (1.5px)
- Scale: 1.0

### Link Hover
**When:** Hovering links, navigation items
**Visual:**
- Scale: 1.4
- Ring color: Warm sepia accent (#d4c5b0)
- Transition: 0.4s ease-out

### Image Hover
**When:** Hovering photos in grid
**Visual:**
- Scale: 1.8 (larger for emphasis)
- Ring color: Warm sepia accent
- Opacity: 0.8
- Indicates photo is clickable for lightbox

### Button Hover
**When:** Hovering buttons, CTAs
**Visual:**
- Scale: 1.4
- Ring color: Warm sepia accent
- Same as link hover

---

## Movement & Animation

### Smooth Following

**Dot Movement:**
- Lerp factor: **0.15** (fast, responsive)
- Follows mouse directly
- Minimal delay

**Ring Movement:**
- Lerp factor: **0.08** (slow, trailing)
- Creates parallax effect
- Sophisticated following

**Why Different Speeds:**
- Creates dynamic, editorial feel
- Dot provides immediate feedback
- Ring adds sophistication and depth

### Lerp Formula
```javascript
current.x += (target.x - current.x) * lerpFactor
current.y += (target.y - current.y) * lerpFactor
```

### RequestAnimationFrame Loop
```javascript
const updateCursorPosition = () => {
  // Update dot (fast)
  cursorPos.x += (mousePos.x - cursorPos.x) * 0.15
  cursorPos.y += (mousePos.y - cursorPos.y) * 0.15

  // Update ring (slow)
  ringPos.x += (mousePos.x - ringPos.x) * 0.08
  ringPos.y += (mousePos.y - ringPos.y) * 0.08

  // Apply transforms
  dotElement.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`
  ringElement.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`

  // Continue loop
  rafId = requestAnimationFrame(updateCursorPosition)
}
```

### State Transitions
- **Duration:** 0.4s (var(--transition-fast))
- **Easing:** ease-out
- **Properties:** transform (scale), border-color, opacity
- **Performance:** GPU-accelerated, no layout reflow

---

## Device Detection

### Desktop Only

**Cursor Shows When:**
✅ Not a touch device (`'ontouchstart' not in window`)
✅ Has hover capability (`matchMedia('(hover: hover)')`)
✅ Screen width ≥ 1024px (`matchMedia('(min-width: 1024px)')`)

**Cursor Hidden When:**
❌ Mobile device (touch detected)
❌ Tablet (touch or no hover capability)
❌ Small screen (<1024px)

**Why:**
- Custom cursor doesn't make sense on touch
- Saves performance on mobile
- Better UX on touch devices

---

## State Detection

### Auto-Detection

**Links:**
- `<a>` tags
- Elements with `.nav-item` class
- Closest parent `<a>` tag

**Buttons:**
- `<button>` tags
- Elements with `role="button"`
- Closest parent `<button>` tag

**Images:**
- `<img>` tags
- Elements with `data-cursor="image"` attribute
- Elements with `.cursor-image` class

### Manual Override

**Data Attribute:**
```html
<!-- Explicit image cursor -->
<div data-cursor="image">
  <!-- content -->
</div>

<!-- Explicit link cursor -->
<div data-cursor="link">
  <!-- content -->
</div>
```

**When to Use:**
- Custom clickable elements
- Non-standard interactive components
- Override auto-detection

---

## Performance Optimization

### GPU Acceleration

**All Position Updates:**
```css
transform: translate3d(x, y, 0);
will-change: transform;
```

**Why translate3d:**
- GPU-accelerated (vs top/left which are CPU)
- No layout reflow
- Smooth 60fps movement

### RequestAnimationFrame

**Benefits:**
- Synced with browser repaint (60fps)
- No unnecessary updates
- Pauses when tab inactive
- Battery-friendly

### Memory Management

**Cleanup:**
- Event listeners removed on unmount
- RAF loop canceled on unmount
- No memory leaks

---

## Accessibility

### Reduced Motion Support

**CSS Media Query:**
```css
@media (prefers-reduced-motion: reduce) {
  .cursor-dot,
  .cursor-ring {
    display: none;
  }
}
```

**Behavior:**
- Custom cursor hidden if user prefers reduced motion
- Default browser cursor shown instead
- Respects user preferences

### Keyboard Navigation

**Focus States:**
- Custom cursor doesn't replace focus indicators
- Keyboard navigation unaffected
- Focus rings still visible

**Interactions:**
- pointer-events: none on cursor (doesn't block clicks)
- All elements remain clickable
- Tab order preserved

### Screen Readers

**Impact:**
- Cursor is purely visual
- No ARIA needed
- Doesn't affect screen reader usage
- Transparent to assistive tech

---

## Styling Details

### Z-Index Hierarchy
```
Custom Cursor Container: 9999
  ├─ Cursor Dot: 10000 (above ring)
  └─ Cursor Ring: 9999
```

### Colors
```css
/* Default */
--dot-color: var(--foreground);      /* #e8e8e8 */
--ring-color: var(--foreground);     /* #e8e8e8 */

/* Hover States */
--ring-hover: var(--accent-warm);    /* #d4c5b0 */
```

### Sizes
```css
/* Dot */
width: 6px;
height: 6px;
margin: -3px (center on cursor);

/* Ring */
width: 32px;
height: 32px;
border: 1.5px;
margin: -16px (center on cursor);

/* Scales */
default: 1.0
link/button: 1.4
image: 1.8
```

---

## Integration

### Layout Integration

**File:** `app/layout.tsx`

```tsx
import CustomCursor from '@/components/CustomCursor'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LightboxProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Lightbox />

          {/* Custom Cursor - editorial enhancement for desktop */}
          <CustomCursor />
        </LightboxProvider>
      </body>
    </html>
  )
}
```

### Image Component Integration

**File:** `components/ProtectedImage.tsx`

```tsx
<div
  data-cursor="image"
  onClick={onClick}
  className="image-container"
>
  <Image src={imageUrl} alt={alt} />
</div>
```

**Why data-cursor:**
- Explicit cursor state for images
- Ensures proper detection
- Overrides auto-detection if needed

---

## Default Cursor Hiding

### Global CSS

```css
:global(body),
:global(a),
:global(button),
:global(img) {
  cursor: none !important;
}
```

**Applied When:**
- Custom cursor is visible (desktop only)
- Via scoped styles in CustomCursor component

**Not Applied When:**
- Mobile/touch devices
- Reduced motion preference
- Custom cursor hidden

---

## Customization

### Adjusting Cursor Speed

**In CustomCursor.tsx:**
```javascript
const lerpDot = 0.15  // 0.1 (slow) - 0.3 (fast)
const lerpRing = 0.08 // 0.05 (slow) - 0.15 (fast)
```

**Effect:**
- Lower values = slower, more trailing
- Higher values = faster, more responsive
- Recommended: Keep ring ~50% of dot speed

### Changing Cursor Size

**In CustomCursor.tsx (styles):**
```css
.cursor-dot {
  width: 6px;   /* Adjust size */
  height: 6px;
}

.cursor-ring {
  width: 32px;  /* Adjust size */
  height: 32px;
  border: 1.5px; /* Adjust thickness */
}
```

### Adding New States

**1. Define State:**
```typescript
type CursorState = 'default' | 'link' | 'image' | 'button' | 'custom'
```

**2. Add Detection:**
```javascript
if (target.hasAttribute('data-cursor-custom')) {
  setCursorState('custom')
}
```

**3. Add Styling:**
```css
.cursor-ring[data-state='custom'] {
  border-color: var(--accent-cool);
  transform: scale(2);
}
```

**4. Update getScale():**
```javascript
case 'custom':
  return 2.0
```

---

## Testing

### Performance Testing

**Chrome DevTools:**
1. Open Performance tab
2. Record interaction
3. Check for:
   - 60fps during cursor movement
   - No layout reflows
   - Low CPU usage
   - GPU acceleration enabled

**Expected Results:**
- Cursor updates: ~16ms per frame (60fps)
- No dropped frames
- Transform operations only (no layout)

### Visual Testing

**States to Test:**
- ✅ Default cursor visible on desktop
- ✅ Hidden on mobile/tablet
- ✅ Changes on link hover
- ✅ Changes on image hover
- ✅ Changes on button hover
- ✅ Smooth state transitions
- ✅ Trailing ring effect visible

### Interaction Testing

**Verify:**
- ✅ All links clickable
- ✅ Images open lightbox
- ✅ Buttons trigger actions
- ✅ No broken interactions
- ✅ Keyboard navigation works

### Accessibility Testing

**Check:**
- ✅ Reduced motion hides cursor
- ✅ Focus states visible
- ✅ Screen reader unaffected
- ✅ Keyboard navigation unaffected

---

## Troubleshooting

### Cursor Not Showing

**Check:**
1. Device detection (desktop only)
2. Browser console for errors
3. CSS `cursor: none` applied
4. Z-index conflicts

**Solutions:**
- Verify screen width ≥ 1024px
- Check hover capability
- Ensure no touch detected

### Laggy/Jittery Movement

**Possible Causes:**
1. RAF not running
2. Too many event listeners
3. Heavy DOM operations in loop
4. Non-GPU-accelerated transforms

**Solutions:**
- Verify RAF loop active
- Check browser performance tab
- Ensure translate3d used (not top/left)
- Reduce lerp complexity

### State Not Changing

**Check:**
1. Element detection logic
2. Data attributes applied
3. Event listeners active
4. State update timing

**Solutions:**
- Add data-cursor attributes explicitly
- Check mouseover/mouseout events
- Verify state detection logic

### Default Cursor Still Visible

**Check:**
1. CSS `cursor: none` applied
2. Specificity issues
3. Element-specific cursor styles

**Solutions:**
- Add `!important` to cursor: none
- Check for competing cursor styles
- Verify global styles loaded

---

## Browser Support

### Fully Supported
✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Desktop browsers with pointer support

### Not Supported (By Design)
❌ Mobile Safari (touch device)
❌ Mobile Chrome (touch device)
❌ Tablets (touch/no hover)
❌ IE11 (deprecated)

### Feature Detection
- Touch support: `'ontouchstart' in window`
- Hover capability: `matchMedia('(hover: hover)')`
- Screen size: `matchMedia('(min-width: 1024px)')`

---

## Future Enhancements

**Potential Additions (Not Implemented):**

1. **Magnetic Effect**
   - Cursor pulls toward buttons/links
   - Subtle attraction
   - Requires distance calculation

2. **Text Inside Cursor**
   - Show "VIEW" on image hover
   - "CLICK" on button hover
   - Fades in/out

3. **Color by Section**
   - Cursor changes color based on page section
   - Matches content context
   - Context-aware

4. **Click Animation**
   - Brief pulse or ripple on click
   - Visual feedback
   - Enhances interaction

5. **Loading State**
   - Spinning ring when page loading
   - Indicates activity
   - User feedback

**Note:** These are optional and may be too much. Current implementation is intentionally minimal and sophisticated.

---

## Design Decisions

### Why Dot + Ring (Not Other Options)

**Considered:**
- **Ring Only** - Too minimal, less dynamic
- **Dot Only** - Simple but lacks sophistication
- **Crosshair** - Too technical, less editorial

**Chosen: Dot + Ring**
- Most editorial and dynamic
- Parallax effect adds sophistication
- Clear feedback with subtle presence
- Fits gallery aesthetic perfectly

### Why Slow Lerp (Not Instant)

**Benefits of Lerp:**
- Smooth, organic movement
- Trailing effect creates depth
- More sophisticated than instant
- Reduces visual noise

**Timing Choices:**
- Dot: 0.15 (responsive enough)
- Ring: 0.08 (creates nice trailing)
- Difference creates parallax

### Why Desktop Only

**Reasoning:**
- Touch devices have no cursor
- Mobile doesn't benefit
- Saves performance on mobile
- Better UX on touch

---

## Maintenance

### Updating Cursor Design

**Files to Modify:**
1. `components/CustomCursor.tsx` - Component logic
2. Inline styles in component - Visual styling

**No Global CSS Changes Needed:**
- Cursor styles scoped to component
- Uses design system variables
- Self-contained implementation

### Adding Data Attributes

**When Adding New Clickable Elements:**
```tsx
<div data-cursor="image">
  <!-- or data-cursor="link" -->
</div>
```

**Best Practice:**
- Add to wrapper div, not image itself
- Use "image" for lightbox-triggering elements
- Use "link" for navigation elements

---

## Performance Metrics

### Target Performance
- **FPS:** 60fps constant
- **Frame Time:** ~16ms
- **CPU Usage:** <5% during cursor movement
- **Memory:** Stable (no leaks)

### Optimization Techniques Used
✅ RAF for smooth updates
✅ GPU-accelerated transforms
✅ will-change hints
✅ Minimal DOM manipulation
✅ Scoped event listeners
✅ Proper cleanup on unmount

---

## Conclusion

The custom cursor successfully enhances the fine art photography portfolio with:
- **Editorial sophistication** - Dot + ring design
- **Smooth performance** - 60fps via RAF and GPU acceleration
- **Clear feedback** - State changes for links/images
- **Accessibility** - Respects reduced motion, doesn't break interactions
- **Responsive** - Desktop only, hidden on mobile

**This subtle enhancement elevates the site to gallery-quality without being gimmicky or distracting.**

---

**Last Updated:** November 2025
**Component Version:** 1.0
**Status:** Production Ready
