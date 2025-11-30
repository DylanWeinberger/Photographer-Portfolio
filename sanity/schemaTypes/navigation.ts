import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

/**
 * Navigation Schema
 *
 * Singleton document that controls the site's main navigation menu.
 * Only one navigation document should exist in the system.
 *
 * Menu items can link to:
 * - Home page (/)
 * - Internal pages (like /photos, /about)
 * - External URLs (like social media profiles)
 */

export const navigationType = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: LinkIcon,

  // Singleton: Only one navigation document should exist
  // Enforced by the structure configuration in sanity/structure.ts

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Main Navigation',
      readOnly: true,
      description: 'Internal identifier - not displayed on site',
    }),

    defineField({
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      description: 'Navigation menu items - drag to reorder (order appears in menu)',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          fields: [
            // Label - text shown in navigation menu
            defineField({
              name: 'label',
              title: 'Menu Label',
              type: 'string',
              description: 'Text displayed in the menu (e.g., "Home", "Gallery", "Contact")',
              validation: (Rule) =>
                Rule.required()
                  .min(1)
                  .max(30)
                  .error('Label must be between 1 and 30 characters'),
            }),

            // Link Type - determines what kind of link this is
            defineField({
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              description: 'Choose what this menu item links to',
              options: {
                list: [
                  { title: 'Home Page', value: 'home' },
                  { title: 'Internal Page', value: 'internal' },
                  { title: 'External URL', value: 'external' },
                  { title: 'Parent (Dropdown with Children)', value: 'parent' },
                ],
                layout: 'radio',
              },
              initialValue: 'internal',
              validation: (Rule) => Rule.required(),
            }),

            // Internal Link - path to internal page
            defineField({
              name: 'internalLink',
              title: 'Internal Link',
              type: 'string',
              description: 'Page path starting with / (e.g., "/photos", "/about")',
              hidden: ({ parent }) => parent?.linkType !== 'internal',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const linkType = (context.parent as any)?.linkType

                  // Required if linkType is internal
                  if (linkType === 'internal' && !value) {
                    return 'Internal link is required when link type is "Internal Page"'
                  }

                  // Must start with / if provided
                  if (value && !value.startsWith('/')) {
                    return 'Internal link must start with / (e.g., "/photos")'
                  }

                  return true
                }),
            }),

            // External URL - full URL to external site
            defineField({
              name: 'externalUrl',
              title: 'External URL',
              type: 'url',
              description: 'Full URL including https:// (e.g., "https://flickr.com/username")',
              hidden: ({ parent }) => parent?.linkType !== 'external',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const linkType = (context.parent as any)?.linkType

                  // Required if linkType is external
                  if (linkType === 'external' && !value) {
                    return 'External URL is required when link type is "External URL"'
                  }

                  return true
                })
                .uri({
                  scheme: ['http', 'https'],
                }),
            }),

            // Open in New Tab - for external links
            defineField({
              name: 'openInNewTab',
              title: 'Open in New Tab',
              type: 'boolean',
              description: 'Open this link in a new browser tab (recommended for external links)',
              initialValue: false,
              hidden: ({ parent }) => parent?.linkType !== 'external',
            }),

            // Children - for parent menu items with dropdowns
            defineField({
              name: 'children',
              title: 'Child Menu Items',
              type: 'array',
              description: 'Add child items that will appear in the dropdown (parent links only)',
              hidden: ({ parent }) => parent?.linkType !== 'parent',
              of: [
                {
                  type: 'object',
                  name: 'childMenuItem',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Menu Label',
                      type: 'string',
                      description: 'Text displayed in the dropdown',
                      validation: (Rule) =>
                        Rule.required()
                          .min(1)
                          .max(30)
                          .error('Label must be between 1 and 30 characters'),
                    }),
                    defineField({
                      name: 'linkType',
                      title: 'Link Type',
                      type: 'string',
                      description: 'Choose what this child item links to',
                      options: {
                        list: [
                          { title: 'Home Page', value: 'home' },
                          { title: 'Internal Page', value: 'internal' },
                          { title: 'External URL', value: 'external' },
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'internal',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'internalLink',
                      title: 'Internal Link',
                      type: 'string',
                      description: 'Page path starting with / (e.g., "/photos", "/about")',
                      hidden: ({ parent }) => parent?.linkType !== 'internal',
                      validation: (Rule) =>
                        Rule.custom((value, context) => {
                          const linkType = (context.parent as any)?.linkType

                          if (linkType === 'internal' && !value) {
                            return 'Internal link is required when link type is "Internal Page"'
                          }

                          if (value && !value.startsWith('/')) {
                            return 'Internal link must start with / (e.g., "/photos")'
                          }

                          return true
                        }),
                    }),
                    defineField({
                      name: 'externalUrl',
                      title: 'External URL',
                      type: 'url',
                      description: 'Full URL including https://',
                      hidden: ({ parent }) => parent?.linkType !== 'external',
                      validation: (Rule) =>
                        Rule.custom((value, context) => {
                          const linkType = (context.parent as any)?.linkType

                          if (linkType === 'external' && !value) {
                            return 'External URL is required when link type is "External URL"'
                          }

                          return true
                        })
                        .uri({
                          scheme: ['http', 'https'],
                        }),
                    }),
                    defineField({
                      name: 'openInNewTab',
                      title: 'Open in New Tab',
                      type: 'boolean',
                      description: 'Open this link in a new browser tab',
                      initialValue: false,
                      hidden: ({ parent }) => parent?.linkType !== 'external',
                    }),
                  ],
                  preview: {
                    select: {
                      label: 'label',
                      linkType: 'linkType',
                      internalLink: 'internalLink',
                      externalUrl: 'externalUrl',
                    },
                    prepare({ label, linkType, internalLink, externalUrl }) {
                      let subtitle = ''

                      if (linkType === 'home') {
                        subtitle = '→ Home page (/)'
                      } else if (linkType === 'internal') {
                        subtitle = `→ ${internalLink || 'Internal page'}`
                      } else if (linkType === 'external') {
                        subtitle = `→ ${externalUrl || 'External URL'}`
                      }

                      return {
                        title: label || 'Child Menu Item',
                        subtitle,
                      }
                    },
                  },
                },
              ],
              validation: (Rule) =>
                Rule.custom((children, context) => {
                  const linkType = (context.parent as any)?.linkType

                  // Parent items must have at least one child
                  if (linkType === 'parent' && (!children || children.length === 0)) {
                    return 'Parent menu items must have at least one child item'
                  }

                  return true
                }),
            }),
          ],

          // Preview in Sanity Studio list
          preview: {
            select: {
              label: 'label',
              linkType: 'linkType',
              internalLink: 'internalLink',
              externalUrl: 'externalUrl',
              children: 'children',
            },
            prepare({ label, linkType, internalLink, externalUrl, children }) {
              let subtitle = ''

              if (linkType === 'home') {
                subtitle = '→ Home page (/)'
              } else if (linkType === 'internal') {
                subtitle = `→ ${internalLink || 'Internal page'}`
              } else if (linkType === 'external') {
                subtitle = `→ ${externalUrl || 'External URL'}`
              } else if (linkType === 'parent') {
                const childCount = children ? children.length : 0
                subtitle = `Parent (${childCount} child${childCount === 1 ? '' : 'ren'})`
              }

              return {
                title: label || 'Menu Item',
                subtitle,
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error('Add at least one menu item'),
    }),
  ],

  preview: {
    select: {
      items: 'menuItems',
    },
    prepare({ items }) {
      const itemCount = items ? items.length : 0
      return {
        title: 'Main Navigation',
        subtitle: `${itemCount} menu item${itemCount === 1 ? '' : 's'}`,
      }
    },
  },
})
