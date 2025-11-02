import { defineField, defineType } from 'sanity'

/**
 * Photo Schema for Photographer Portfolio
 *
 * This schema defines the structure for photo documents in Sanity.
 * It includes comprehensive image metadata, display options, and organization features.
 */
export const photoType = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A descriptive title for this photo',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'The main photo file',
      options: {
        hotspot: true, // Enables image cropping and focal point selection
        metadata: [
          'blurhash', // Generates blur placeholder for loading states
          'lqip', // Low Quality Image Placeholder for progressive loading
          'palette', // Extracts dominant colors from the image
          'exif', // Preserves EXIF data (camera settings, location, etc.)
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
      description: 'Alternative text for accessibility (describe what the image shows). If left empty, the title will be used as fallback.',
      validation: (Rule) =>
        Rule.min(10)
          .max(200)
          .warning('Alt text should be descriptive but concise'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      description: 'Optional caption or description to display with the photo',
      rows: 3,
    }),
    defineField({
      name: 'displayQuality',
      title: 'Display Quality',
      type: 'string',
      description: 'Image quality level for web display (affects file size and loading speed)',
      options: {
        list: [
          { title: 'High (80%)', value: 'high' },
          { title: 'Medium (60%)', value: 'medium' },
          { title: 'Low (40%)', value: 'low' },
        ],
        layout: 'radio', // Shows as radio buttons for clear selection
      },
      initialValue: 'high',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'watermarkEnabled',
      title: 'Enable Watermark',
      type: 'boolean',
      description: 'Add watermark protection to this image when displayed',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Photo',
      type: 'boolean',
      description: 'Display this photo on the homepage or featured gallery',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Select tags for organizing and filtering photos. Create tags first in the Tags section if needed.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'tag' }],
        },
      ],
      validation: (Rule) =>
        Rule.custom((tags) => {
          if (!tags || tags.length === 0) {
            return 'At least one tag is recommended for organization'
          }
          return true
        }).warning(),
    }),
    defineField({
      name: 'takenAt',
      title: 'Date Taken',
      type: 'datetime',
      description: 'When was this photo taken? (can be extracted from EXIF data)',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where was this photo taken?',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      featured: 'featured',
      tag0: 'tags.0.name',
      tag1: 'tags.1.name',
      tag2: 'tags.2.name',
    },
    prepare(selection) {
      const { title, media, featured, tag0, tag1, tag2 } = selection
      const tags = [tag0, tag1, tag2].filter(Boolean)
      const tagList = tags.length > 0 ? tags.join(', ') : 'No tags'

      return {
        title: title,
        subtitle: featured ? `⭐ Featured • ${tagList}` : tagList,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: '_createdAt', direction: 'desc' },
      ],
    },
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Oldest First',
      name: 'oldestFirst',
      by: [{ field: '_createdAt', direction: 'asc' }],
    },
  ],
})
