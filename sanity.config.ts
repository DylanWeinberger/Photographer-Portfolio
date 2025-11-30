'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/sanity/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {colorInput} from '@sanity/color-input'

import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

// Hardcoded values for deployed Studio (sanity.studio doesn't have access to .env)
const projectId = 'dhwg1ocm'
const dataset = 'production'
const apiVersion = '2025-11-02'

export default defineConfig({
  basePath: '/sanity',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    // Color input plugin for color picker fields
    colorInput(),
  ],
})
