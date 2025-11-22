import type { Metadata } from "next";
import { IBM_Plex_Sans, Playfair_Display } from 'next/font/google'
import "./globals.css";
import { client } from '@/sanity/lib/client'
import { navigationQuery, settingsQuery } from '@/lib/queries'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Lightbox from '@/components/Lightbox'
import CustomCursor from '@/components/CustomCursor'
import { LightboxProvider } from '@/contexts/LightboxContext'
import PageTransition from '@/components/PageTransition'
import type { Navigation, Settings } from '@/types/sanity'

// Google font (IBM Plex Sans) - downloaded & optimized at build time
// Sophisticated sans-serif that pairs beautifully with Playfair Display
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
  weight: ['300', '400', '500'], // light, regular, medium for subtle hierarchy
})

// Google font (Playfair_Display) - downloaded & optimized at build time
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400'], // only include weights you use
})


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://henryjaffephotography.com'),
  title: {
    default: 'Henry Jaffe Photography',
    template: '%s | Henry Jaffe Photography',
  },
  description: 'Professional photography portfolio showcasing fine art and editorial work',
  keywords: ['photography', 'photographer', 'fine art', 'editorial', 'portfolio', 'Henry Jaffe'],
  authors: [{ name: 'Henry Jaffe' }],
  creator: 'Henry Jaffe',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Henry Jaffe Photography',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@henryjaffe',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/**
 * ROOT LAYOUT
 *
 * This layout wraps every page in the application.
 * It's the perfect place to fetch site-wide data like
 * navigation and settings that appear on every page.
 *
 * Made async to fetch data from Sanity CMS.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * FETCH SITE-WIDE DATA
   *
   * Navigation and settings are fetched here because:
   * - They appear on every page (in header and footer)
   * - Fetched once per page load and reused
   * - Server component - no client-side fetching needed
   * - Data is passed as props to Header and Footer components
   *
   * Promise.all fetches both in parallel for better performance.
   */
  const [navigation, settings] = await Promise.all([
    client.fetch<Navigation>(navigationQuery),
    client.fetch<Settings>(settingsQuery),
  ])

  return (
    <html lang="en" suppressHydrationWarning >
      {/**
       * STICKY FOOTER LAYOUT
       *
       * flex flex-col min-h-screen: Makes body a flex column that fills viewport
       * This ensures footer sticks to bottom even on short pages.
       *
       * Structure:
       * - Header (auto height)
       * - Main content (flex-1 - grows to fill space)
       * - Footer (auto height, mt-auto pushes to bottom)
       */}
      <body
        className={`${ibmPlexSans.variable} ${playfair.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <PageTransition>
          <LightboxProvider>
            {/* Header - conditional rendering: only show if data exists */}
            {navigation && settings && (
              <Header navigation={navigation} settings={settings} />
            )}

            {/**
             * Main content area
             * flex-1: Grows to fill available space, pushing footer to bottom
             */}
            <main className="flex-1">
              {children}
            </main>

          {/**
           * Footer - conditional rendering: only show if settings exist
           * Footer only needs settings (for social links and copyright)
           * Navigation is not required for footer
           */}
          {settings && (
            <Footer settings={settings} />
          )}

          {/* Lightbox - renders when opened */}
          <Lightbox />

          {/* Custom Cursor - editorial enhancement for desktop */}
          <CustomCursor />
          </LightboxProvider>
        </PageTransition>
      </body>
    </html>
  );
}
