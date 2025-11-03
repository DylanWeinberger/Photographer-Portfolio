import type {StructureResolver} from 'sanity/structure'

/**
 * STUDIO STRUCTURE CONFIGURATION
 *
 * Customizes the Sanity Studio sidebar to properly display singleton documents.
 * Singleton documents (homepage, navigation, settings) appear as individual items
 * rather than lists, since only one instance of each should exist.
 *
 * Without this configuration, singleton documents with no initial data won't
 * appear in the Studio sidebar, making it impossible to create them.
 *
 * Structure:
 * - Singletons at top (Homepage, Navigation, Settings)
 * - Divider
 * - Regular collections (Photos, Tags)
 * - Divider
 * - Any other document types (for future schemas)
 */

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // SINGLETONS - Documents that should only have one instance
      // These appear as single items, not lists

      // Homepage
      // Note: Uses first document of type 'homepage' regardless of ID
      // This allows existing homepage documents to work with structure
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .child(
          S.documentList()
            .title('Homepage')
            .filter('_type == "homepage"')
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('homepage')
            )
        ),

      // Navigation
      // Note: Uses first document of type 'navigation' regardless of ID
      S.listItem()
        .title('Navigation')
        .id('navigation')
        .child(
          S.documentList()
            .title('Navigation')
            .filter('_type == "navigation"')
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('navigation')
            )
        ),

      // Site Settings
      // Note: Uses first document of type 'settings' regardless of ID
      S.listItem()
        .title('Site Settings')
        .id('settings')
        .child(
          S.documentList()
            .title('Settings')
            .filter('_type == "settings"')
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('settings')
            )
        ),

      // Divider
      S.divider(),

      // REGULAR COLLECTIONS - Can have multiple documents
      // These appear as lists that can contain many items

      S.documentTypeListItem('photo').title('Photos'),
      S.documentTypeListItem('tag').title('Tags'),

      // Divider
      S.divider(),

      // All other document types (filters out the ones we explicitly listed above)
      // This allows future schemas to appear automatically
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['homepage', 'navigation', 'settings', 'photo', 'tag'].includes(
            listItem.getId() || ''
          )
      ),
    ])
