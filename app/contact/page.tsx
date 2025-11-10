import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { client } from '@/sanity/lib/client'
import { settingsQuery } from '@/lib/queries'
import type { Settings } from '@/types/sanity'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Henry Jaffe Photography.',
}

async function getSettings(): Promise<Settings | null> {
  try {
    const settings = await client.fetch<Settings>(settingsQuery)
    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Send us a message and we'll get back to you as soon as
            possible.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* Additional Contact Info (if available) */}
        {settings?.socialLinks && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Other Ways to Connect
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                {settings.socialLinks.email && (
                  <a
                    href={`mailto:${settings.socialLinks.email}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {settings.socialLinks.email}
                    </span>
                  </a>
                )}

                {settings.socialLinks.flickr && (
                  <a
                    href={settings.socialLinks.flickr}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="text-sm font-medium">flickr</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ISR: Revalidate every 1 hour (3600 seconds)
// Reasoning: Contact page content (form, social links) changes very infrequently
// Longer revalidation time is appropriate since contact info is relatively static
// Provides fast page loads while keeping social links and settings current
export const revalidate = 3600
