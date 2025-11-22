'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Animate On Scroll Component
 *
 * Triggers animation when element enters viewport using Intersection Observer.
 * Respects prefers-reduced-motion automatically via CSS.
 *
 * Usage:
 * <AnimateOnScroll animation="fadeInUp">
 *   <h2>Your heading</h2>
 * </AnimateOnScroll>
 */

interface AnimateOnScrollProps {
  children: React.ReactNode
  animation?: 'fadeIn' | 'fadeInUp'
  delay?: number
  threshold?: number
  className?: string
}

export default function AnimateOnScroll({
  children,
  animation = 'fadeIn',
  delay = 0,
  threshold = 0.1,
  className = '',
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Unobserve after triggering to prevent re-animation
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin: '50px', // Trigger slightly before element enters viewport
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  const animationClass = isVisible ? `animate-${animation}` : 'opacity-0'
  const delayClass = delay > 0 ? `animate-delay-${delay}` : ''

  return (
    <div
      ref={ref}
      className={`${animationClass} ${delayClass} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
