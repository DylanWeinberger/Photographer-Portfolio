import { type SchemaTypeDefinition } from 'sanity'
import { photoType } from './photo'
import { tagType } from './tag'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [photoType, tagType],
}
