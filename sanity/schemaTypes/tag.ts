import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

/**
 * TAG SCHEMA
 *
 * Tags serve dual purposes:
 * 1. Photo organization (tagging system)
 * 2. Portfolio pages (tag pages at /tag/[slug])
 *
 * This approach is simpler than a separate page builder:
 * - Tags automatically collect photos
 * - No manual photo selection needed
 * - Still allows customization (hero, colors, layout)
 * - Matches photographer workflow
 *
 * Examples:
 * - Tag "wedding" → /tag/wedding shows all wedding photos
 * - Tag "pittsburgh" → /tag/pittsburgh shows all Pittsburgh photos
 */
export const tagType = defineType({
  name: 'tag',
  title: 'Tags',
  type: 'document',
  icon: TagIcon,

  fields: [
    /**
     * BASIC INFO
     *
     * Core tag identification used for photo organization
     */
    defineField({
      name: 'name',
      title: 'Tag Name',
      type: 'string',
      description: 'Internal tag name used for organization (e.g., "wedding", "landscape")',
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .max(30)
          .regex(/^[a-zA-Z0-9\s-]+$/, {
            name: 'alphanumeric',
            invert: false,
          })
          .error('Tag name must be 2-30 characters and contain only letters, numbers, spaces, or hyphens'),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'URL-friendly version (e.g., "wedding" becomes /tag/wedding)',
      options: {
        source: 'name',
        maxLength: 30,
      },
      validation: (Rule) => Rule.required(),
    }),

    /**
     * PAGE DISPLAY SETTINGS
     *
     * Fields that control how the tag appears as a portfolio page
     */
    defineField({
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
      description: 'Human-readable title for the tag page (e.g., "Wedding Photography"). Leave blank to use tag name.',
      validation: (Rule) => Rule.max(100),
    }),

    defineField({
      name: 'headerText',
      title: 'Header Text',
      type: 'string',
      description: 'Main heading displayed on tag page',
      validation: (Rule) => Rule.max(100),
    }),

    defineField({
      name: 'subheader',
      title: 'Subheader',
      type: 'string',
      description: 'Supporting text below the header',
      validation: (Rule) => Rule.max(200),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Introduction text for the tag page (also used for SEO)',
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero/Cover Image',
      type: 'reference',
      to: [{ type: 'photo' }],
      description: 'Optional featured image at top of tag page',
    }),

    /**
     * LAYOUT SETTINGS
     */
    defineField({
      name: 'layout',
      title: 'Photo Grid Layout',
      type: 'string',
      description: '2-Column Grid: Clean, gallery-like with generous spacing. Masonry: Organic flow that respects natural image ratios.',
      options: {
        list: [
          { title: '2-Column Grid', value: 'rows2' },
          { title: 'Masonry Layout', value: 'masonry' }
        ],
        layout: 'radio'
      },
      initialValue: 'rows2',
    }),

    /**
     * COLOR SCHEME
     *
     * Customize page appearance with presets or custom colors
     */
    defineField({
      name: 'colorScheme',
      title: 'Color Scheme',
      type: 'object',
      description: 'Customize the appearance of this tag page',
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        defineField({
          name: 'preset',
          title: 'Color Preset',
          type: 'string',
          options: {
            list: [
              { title: 'Light (Default)', value: 'light' },
              { title: 'Dark', value: 'dark' },
              { title: 'Warm', value: 'warm' },
              { title: 'Cool', value: 'cool' },
              { title: 'Custom (Choose Colors)', value: 'custom' }
            ],
            layout: 'radio'
          },
          initialValue: 'light',
        }),

        defineField({
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'color',
          hidden: ({ parent }) => parent?.preset !== 'custom',
          description: 'Main page background',
        }),

        defineField({
          name: 'textColor',
          title: 'Text Color',
          type: 'color',
          hidden: ({ parent }) => parent?.preset !== 'custom',
          description: 'Main text color',
        }),

        defineField({
          name: 'accentColor',
          title: 'Accent Color',
          type: 'color',
          hidden: ({ parent }) => parent?.preset !== 'custom',
          description: 'Links, buttons, highlights',
        })
      ]
    }),
  ],

  preview: {
    select: {
      name: 'name',
      displayName: 'displayName',
      description: 'description',
      media: 'heroImage.image',
    },
    prepare({ name, displayName, description, media }) {
      return {
        title: displayName || name,
        subtitle: description || `Tag: ${name}`,
        media,
      }
    }
  },
})
