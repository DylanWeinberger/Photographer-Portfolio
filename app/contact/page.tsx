import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { client } from '@/sanity/lib/client'
import { settingsQuery } from '@/lib/queries'
import type { Settings } from '@/types/sanity'
import { createMetadata } from '@/lib/metadata'

/**
 * Generate metadata for contact page
 * Includes structured data for LocalBusiness/ContactPoint
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await client.fetch<Settings>(settingsQuery)

    const description = settings?.siteDescription
      ? `Get in touch with ${settings.siteTitle}. ${settings.siteDescription}`
      : 'Get in touch to discuss photography projects, collaborations, or inquiries. Available for commissions and editorial work.'

    return createMetadata({
      title: 'Contact',
      description,
      path: '/contact',
    })
  } catch (error) {
    console.error('Error generating contact page metadata:', error)
    // Fallback metadata
    return createMetadata({
      title: 'Contact',
      description: 'Get in touch to discuss photography projects, collaborations, or inquiries.',
      path: '/contact',
    })
  }
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

  // Generate JSON-LD structured data for contact page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact',
    description: 'Contact page for photography inquiries and commissions',
    mainEntity: {
      '@type': 'Person',
      name: settings?.siteTitle || 'Henry Jaffe Photography',
      jobTitle: 'Photographer',
      ...(settings?.socialLinks?.email && {
        email: settings.socialLinks.email,
      }),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        availableLanguage: 'English',
      },
    },
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-28 md:pt-36 lg:pt-40 pb-20 md:pb-28 lg:pb-32 px-6 md:px-20 lg:px-24">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        {/* Page Header - Minimal, elegant */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-normal text-[var(--foreground)] mb-6 md:mb-8 tracking-tight">
            Contact
          </h1>
          <p className="text-base md:text-lg text-[var(--foreground)]/70 max-w-2xl mx-auto font-light leading-relaxed">
            Send a message and I'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* Additional Contact Info (if available) - Minimal */}
        {settings?.socialLinks && (settings.socialLinks.email || settings.socialLinks.flickr) && (
          <div className="mt-20 md:mt-24 pt-16 md:pt-20 border-t border-[var(--border)]">
            <div className="text-center">
              <h2 className="text-sm uppercase tracking-[0.15em] text-[var(--subtle-text)] mb-8">
                Other Ways to Connect
              </h2>
              <div className="flex flex-wrap justify-center gap-8">
                {settings.socialLinks.email && (
                  <a
                    href={`mailto:${settings.socialLinks.email}`}
                    className="text-sm text-[var(--subtle-text)] hover:text-[var(--foreground)] transition-colors duration-[var(--transition-fast)]"
                    data-cursor="link"
                  >
                    {settings.socialLinks.email}
                  </a>
                )}

                {settings.socialLinks.flickr && (
                  <a
                    href={settings.socialLinks.flickr}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm uppercase tracking-[0.1em] text-[var(--subtle-text)] hover:text-[var(--foreground)] transition-colors duration-[var(--transition-fast)]"
                    data-cursor="link"
                  >
                    Flickr
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
