import { type SchemaTypeDefinition } from 'sanity'
import { photoType } from './photo'
import { tagType } from './tag'
import { homepageType } from './homepage'
import { navigationType } from './navigation'
import { settingsType } from './settings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Singleton documents (site-wide configuration)
    homepageType,
    navigationType,
    settingsType,

    // Content documents
    photoType,
    tagType,
  ],
}
