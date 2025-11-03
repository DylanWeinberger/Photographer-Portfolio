import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

/**
 * Site Settings Schema
 *
 * Singleton document that controls site-wide configuration.
 * Only one settings document should exist in the system.
 *
 * This schema contains:
 * - Site title and description (for SEO and branding)
 * - Logo image
 * - Social media links
 * - Footer configuration
 *
 * These settings are used across all pages of the site.
 */

export const settingsType = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,

  // Singleton: Only one settings document can exist
  // This ensures consistent site-wide configuration
  options: {
    // @ts-ignore - singleton option added by sanity-plugin-singleton-tools
    singleton: true,
  },

  fields: [
    // SITE TITLE
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'Main site title (appears in header and browser tab)',
      placeholder: 'Jane Smith Photography',
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .max(60)
          .error('Site title must be between 3 and 60 characters'),
    }),

    // SITE DESCRIPTION
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of the site (for SEO and social media sharing)',
      placeholder: 'Professional photographer specializing in portraits and landscapes...',
      validation: (Rule) =>
        Rule.max(160).warning('Descriptions over 160 characters may be truncated in search results'),
    }),

    // LOGO
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Site logo (appears in header). Recommended: transparent PNG, square or horizontal',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip'],
      },
      fields: [
        // Alt text for logo accessibility
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Describe the logo for screen readers',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // SOCIAL MEDIA LINKS
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      description: 'Add links to your social media profiles (all optional)',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          description: 'Full Instagram profile URL',
          placeholder: 'https://instagram.com/yourprofile',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        }),

        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          description: 'Full Facebook page or profile URL',
          placeholder: 'https://facebook.com/yourpage',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        }),

        defineField({
          name: 'twitter',
          title: 'Twitter/X URL',
          type: 'url',
          description: 'Full Twitter/X profile URL',
          placeholder: 'https://twitter.com/yourprofile',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        }),

        defineField({
          name: 'email',
          title: 'Email Address',
          type: 'string',
          description: 'Contact email address',
          placeholder: 'hello@yoursite.com',
          validation: (Rule) =>
            Rule.custom((value) => {
              // Email validation regex
              if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return 'Please enter a valid email address'
              }
              return true
            }),
        }),
      ],
    }),

    // FOOTER
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      description: 'Configure footer text and links',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
          description: 'Copyright notice (year will be added automatically)',
          placeholder: 'Jane Smith Photography. All rights reserved.',
          validation: (Rule) =>
            Rule.max(100).warning('Keep copyright text concise (under 100 characters)'),
        }),

        defineField({
          name: 'additionalText',
          title: 'Additional Footer Text',
          type: 'text',
          rows: 2,
          description: 'Optional additional text in footer (e.g., tagline, location)',
          placeholder: 'Based in San Francisco, CA',
          validation: (Rule) =>
            Rule.max(200).warning('Keep additional text brief (under 200 characters)'),
        }),

        defineField({
          name: 'showSocialLinks',
          title: 'Show Social Links in Footer',
          type: 'boolean',
          description: 'Display social media icons in footer',
          initialValue: true,
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'siteTitle',
      media: 'logo',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Site Settings',
        subtitle: 'Global site configuration',
        media,
      }
    },
  },
})
