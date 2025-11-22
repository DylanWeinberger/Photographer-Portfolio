'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ComponentProps, MouseEvent } from 'react'

/**
 * TransitionLink Component
 *
 * Wrapper around Next.js Link that enables View Transitions API.
 * Falls back gracefully for browsers without support.
 *
 * Usage: Use exactly like Next.js Link
 * <TransitionLink href="/photos">Photos</TransitionLink>
 */

type TransitionLinkProps = ComponentProps<typeof Link>

export default function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  const router = useRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call original onClick if provided
    if (props.onClick) {
      props.onClick(e)
    }

    // Skip if default prevented or modified click
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) {
      return
    }

    // Skip for external links or new tab
    const target = e.currentTarget
    if (target.target === '_blank' || target.download) {
      return
    }

    // Check if View Transitions API is supported
    if (!('startViewTransition' in document)) {
      return // Let Next.js Link handle normally
    }

    // Prevent default and use View Transition
    e.preventDefault()

    const hrefString = typeof href === 'string' ? href : href.pathname || '/'

    // Wrap navigation in View Transition
    ;(document as any).startViewTransition(() => {
      router.push(hrefString)
    })
  }

  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  )
}
