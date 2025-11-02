import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

/**
 * Tag Schema for Photo Organization
 *
 * Reusable tags that can be referenced by photos.
 * This ensures consistent tagging across the portfolio.
 */
export const tagType = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Tag Name',
      type: 'string',
      description: 'The tag name (e.g., "landscape", "portrait", "urban")',
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
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the tag name',
      options: {
        source: 'name',
        maxLength: 30,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description of what this tag represents',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
    },
  },
})
