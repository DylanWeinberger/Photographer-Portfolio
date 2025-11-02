import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

/**
 * Homepage Schema
 * 
 * Singleton document that controls all homepage content.
 * Only one homepage document should exist in the system.
 */

export const homepageType = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,

  // Singleton: Only one homepage document can exist
  // Enforced by sanity-plugin-singleton-tools
  options: {
    // @ts-ignore - singleton option added by sanity-plugin-singleton-tools
    singleton: true,
  },

  fields: [
    // HERO SECTION
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      description: 'The large image/text section at the top of the homepage',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
          description: 'Main headline text (e.g., "Jane Smith Photography")',
          validation: (Rule) => 
            Rule.required()
              .min(3)
              .max(100)
              .error('Headline must be between 3 and 100 characters'),
        }),
        defineField({
          name: 'subheadline',
          title: 'Subheadline',
          type: 'text',
          rows: 2,
          description: 'Supporting text below headline',
          validation: (Rule) => 
            Rule.max(200)
              .error('Subheadline should be 200 characters or less'),
        }),
        defineField({
          name: 'heroPhotos',
          title: 'Hero Photos',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{ type: 'photo' }],  // References your photo schema
            }
          ],
          description: 'Select 1 photo for static hero, or 2-5 for a slideshow',
          validation: (Rule) => 
            Rule.required()
              .min(1)
              .max(5)
              .error('Please select between 1 and 5 hero photos'),
        }),
        defineField({
          name: 'showCTA',
          title: 'Show Call-to-Action Button',
          type: 'boolean',
          initialValue: false,
          description: 'Display a button that links to another page',
        }),
        defineField({
          name: 'ctaText',
          title: 'Button Text',
          type: 'string',
          hidden: ({ parent }) => !parent?.showCTA,
          validation: (Rule) => 
            Rule.custom((value, context) => {
              const showCTA = (context.parent as any)?.showCTA
              if (showCTA && !value) {
                return 'Button text is required when CTA is enabled'
              }
              return true
            }),
          description: 'Text on the button (e.g., "View Portfolio")',
        }),
        defineField({
          name: 'ctaLink',
          title: 'Button Link',
          type: 'string',
          hidden: ({ parent }) => !parent?.showCTA,
          validation: (Rule) => 
            Rule.custom((value, context) => {
              const showCTA = (context.parent as any)?.showCTA
              if (showCTA && !value) {
                return 'Button link is required when CTA is enabled'
              }
              if (value && !value.startsWith('/')) {
                return 'Link should start with / (e.g., /photos)'
              }
              return true
            }),
          description: 'Where should the button go? (e.g., "/photos")',
        }),
      ],
    }),

    // FEATURED PHOTOS SECTION
    defineField({
      name: 'featuredSection',
      title: 'Featured Photos Section',
      type: 'object',
      description: 'Section displaying photos marked as "featured"',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Featured Work',
          validation: (Rule) => 
            Rule.required()
              .min(2)
              .max(50)
              .error('Heading must be between 2 and 50 characters'),
          description: 'Heading above featured photos',
        }),
        defineField({
          name: 'description',
          title: 'Section Description',
          type: 'text',
          rows: 2,
          validation: (Rule) => 
            Rule.max(200)
              .error('Description should be 200 characters or less'),
          description: 'Optional text below heading',
        }),
      ],
    }),

    // ABOUT SECTION
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'object',
      description: 'Information about the photographer',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'About',
          validation: (Rule) => 
            Rule.required()
              .min(2)
              .max(200)
              .error('Heading must be between 2 and 50 characters'),
          description: 'Heading for the about section',
        }),
        defineField({
          name: 'bio',
          title: 'Biography',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'Heading 3', value: 'h3' },
              ],
              marks: {
                decorators: [
                  { title: 'Strong', value: 'strong' },
                  { title: 'Emphasis', value: 'em' },
                ],
              },
            },
          ],
          validation: (Rule) => 
            Rule.required()
              .error('Biography is required'),
          description: 'Photographer bio - supports basic formatting',
        }),
        defineField({
          name: 'profileImage',
          title: 'Profile Photo',
          type: 'image',
          options: { 
            hotspot: true,
            metadata: ['blurhash', 'lqip']
          },
          validation: (Rule) => 
            Rule.required()
              .error('Profile photo is required'),
          description: 'Photo of the photographer',
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Main landing page content',
      }
    },
  },
})