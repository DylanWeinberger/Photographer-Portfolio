/**
 * CustomCursor Component
 *
 * Sophisticated custom cursor for fine art editorial aesthetic.
 * Design: Dot + Ring with smooth following and state changes.
 *
 * Features:
 * - Center dot (6px) + trailing ring (32px)
 * - Smooth RAF-based movement
 * - State changes for links, images, buttons
 * - Hidden on mobile/touch devices
 * - Respects reduced motion preferences
 * - Performant (GPU-accelerated transforms)
 */

'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

type CursorState = 'default' | 'link' | 'image' | 'button'

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [cursorState, setCursorState] = useState<CursorState>('default')

  // Cursor position refs (for RAF updates)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | undefined>(undefined)

  // Check if device supports hover and is not mobile
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const hasHover = window.matchMedia('(hover: hover)').matches
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches

    // Only show custom cursor on desktop with hover capability
    setIsVisible(!isTouch && hasHover && isDesktop)
  }, [])

  // Smooth cursor movement with RAF and lerp
  const updateCursorPosition = useCallback(() => {
    if (!cursorDotRef.current || !cursorRingRef.current) return

    // Lerp (linear interpolation) for smooth following
        const lerpDot = 1   // was 0.15 (faster)
    const lerpRing = 1  // was 0.08 (faster)

    // Update dot position (fast)
    cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * lerpDot
    cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * lerpDot

    // Update ring position (slow, trailing)
    ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpRing
    ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpRing

    // Apply transforms (GPU-accelerated)
    cursorDotRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`
    cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`

    // Continue animation
    rafId.current = requestAnimationFrame(updateCursorPosition)
  }, [])

  // Track mouse movement
  useEffect(() => {
    if (!isVisible) return

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Start RAF loop
    rafId.current = requestAnimationFrame(updateCursorPosition)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [isVisible, updateCursorPosition])

  // Detect cursor state based on hovered element
  useEffect(() => {
    if (!isVisible) return

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check for data-cursor attribute (explicit)
      const cursorAttr = target.getAttribute('data-cursor')
      if (cursorAttr === 'image') {
        setCursorState('image')
        return
      }
      if (cursorAttr === 'link' || cursorAttr === 'button') {
        setCursorState('link')
        return
      }

      // Auto-detect based on element type
      if (
        target.tagName === 'A' ||
        target.closest('a') ||
        target.classList.contains('nav-item')
      ) {
        setCursorState('link')
      } else if (
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.getAttribute('role') === 'button'
      ) {
        setCursorState('button')
      } else if (
        target.tagName === 'IMG' ||
        target.closest('[data-cursor="image"]') ||
        target.classList.contains('cursor-image')
      ) {
        setCursorState('image')
      } else {
        setCursorState('default')
      }
    }

    const handleMouseOut = () => {
      setCursorState('default')
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isVisible])

  // Don't render if not visible
  if (!isVisible) return null

  // Get scale based on state
  const getScale = () => {
    switch (cursorState) {
      case 'link':
      case 'button':
        return 1.4
      case 'image':
        return 1.8
      default:
        return 1
    }
  }

  return (
    <div className="custom-cursor-container">
      {/* Center Dot */}
      <div
        ref={cursorDotRef}
        className="cursor-dot"
        style={{
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Trailing Ring */}
      <div
        ref={cursorRingRef}
        className="cursor-ring"
        style={{
          transform: 'translate3d(0, 0, 0) scale(1)',
          '--cursor-scale': getScale(),
        } as React.CSSProperties}
        data-state={cursorState}
      />

      <style jsx>{`
        .custom-cursor-container {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
        }

        .cursor-dot {
          position: fixed;
          width: 6px;
          height: 6px;
          background: var(--foreground);
          border-radius: 50%;
          pointer-events: none;
          margin-left: -3px;
          margin-top: -3px;
          z-index: 10000;
          will-change: transform;
        }

        .cursor-ring {
          position: fixed;
          width: 32px;
          height: 32px;
          border: 1.5px solid var(--foreground);
          border-radius: 50%;
          pointer-events: none;
          margin-left: -16px;
          margin-top: -16px;
          z-index: 9999;
          will-change: transform;
          transition: transform var(--transition-fast) ease-out,
                      border-color var(--transition-fast) ease-out,
                      opacity var(--transition-fast) ease-out;
          transform: scale(var(--cursor-scale, 1));
        }

        /* State-specific ring styles */
        .cursor-ring[data-state='link'],
        .cursor-ring[data-state='button'] {
          border-color: var(--accent-warm);
        }

        .cursor-ring[data-state='image'] {
          border-color: var(--accent-warm);
          opacity: 0.8;
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .cursor-dot,
          .cursor-ring {
            display: none;
          }
        }

        /* Hide default cursor */
        :global(body),
        :global(a),
        :global(button),
        :global(img) {
          cursor: none !important;
        }
      `}</style>
    </div>
  )
}
