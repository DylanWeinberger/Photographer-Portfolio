import Link from 'next/link'

/**
 * NOT FOUND PAGE for Tag Routes
 *
 * Displayed when a tag slug doesn't exist
 */
export default function TagNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Tag Not Found</h1>

        <p className="text-gray-600 mb-8">
          The tag you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-light bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/photos"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            View All Photos
          </Link>
        </div>
      </div>
    </div>
  )
}
