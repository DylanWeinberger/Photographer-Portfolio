import { type SchemaTypeDefinition } from 'sanity'
import { photoType } from './photo'
import { tagType } from './tag'
import { homepageType } from './homepage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [photoType, tagType, homepageType],
}
