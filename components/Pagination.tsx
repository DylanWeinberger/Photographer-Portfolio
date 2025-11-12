/**
 * Pagination Component
 *
 * Minimal, almost invisible pagination for fine art aesthetic.
 * Design philosophy:
 * - Subtle presence
 * - Clear current page
 * - Slow hover transitions (0.4s)
 * - Editorial typography
 * - Functional, not decorative
 */

import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  // Don't render if only one page
  if (totalPages <= 1) {
    return null
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  // Generate URL for a specific page
  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath
    }
    return `${basePath}?page=${page}`
  }

  return (
    <nav
      className="flex items-center justify-center gap-6 md:gap-8 py-16 md:py-20"
      aria-label="Pagination"
    >
      {/* Previous Button - Minimal text link */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="text-sm uppercase tracking-[0.15em] text-[var(--subtle-text)] transition-colors duration-[var(--transition-fast)] hover:text-[var(--foreground)] data-cursor='link'"
          aria-label="Previous page"
        >
          ← Previous
        </Link>
      ) : (
        <span
          className="text-sm uppercase tracking-[0.15em] text-[var(--border)] cursor-not-allowed"
          aria-label="Previous page"
          aria-disabled="true"
        >
          ← Previous
        </span>
      )}

      {/* Page Numbers - Minimal, subtle */}
      <div className="flex items-center gap-3 md:gap-4">
        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="text-sm text-[var(--subtle-text)]"
            >
              ···
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page as number)}
              className={`text-sm transition-colors duration-[var(--transition-fast)] ${
                currentPage === page
                  ? 'text-[var(--foreground)] font-medium'
                  : 'text-[var(--subtle-text)] hover:text-[var(--foreground)]'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              data-cursor="link"
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next Button - Minimal text link */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="text-sm uppercase tracking-[0.15em] text-[var(--subtle-text)] transition-colors duration-[var(--transition-fast)] hover:text-[var(--foreground)]"
          aria-label="Next page"
          data-cursor="link"
        >
          Next →
        </Link>
      ) : (
        <span
          className="text-sm uppercase tracking-[0.15em] text-[var(--border)] cursor-not-allowed"
          aria-label="Next page"
          aria-disabled="true"
        >
          Next →
        </span>
      )}
    </nav>
  )
}
