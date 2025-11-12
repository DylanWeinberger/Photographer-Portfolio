import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
      className="flex items-center justify-center gap-2 py-8"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-dark-700 bg-white border border-dark-300 rounded-lg hover:bg-dark-50 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-dark-400 bg-dark-100 border border-dark-200 rounded-lg cursor-not-allowed"
          aria-label="Previous page"
          aria-disabled="true"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-sm font-medium text-dark-500"
            >
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page as number)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-dark-900 text-light'
                  : 'text-dark-700 bg-light border border-dark-300 hover:bg-dark-50'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-dark-700 bg-white border border-dark-300 rounded-lg hover:bg-dark-50 transition-colors"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-dark-400 bg-dark-100 border border-dark-200 rounded-lg cursor-not-allowed"
          aria-label="Next page"
          aria-disabled="true"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </nav>
  )
}
