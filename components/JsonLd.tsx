/**
 * JsonLd Component
 *
 * Safe wrapper for injecting JSON-LD structured data into pages.
 * Avoids using dangerouslySetInnerHTML directly in page components.
 *
 * Usage:
 * <JsonLd data={jsonLdObject} />
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
