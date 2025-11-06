import type { Homepage } from '@/types/sanity'

type FeaturedSectionProps = {
  featuredSection: Homepage['featuredSection']
}

export default function FeaturedSection({ featuredSection }: FeaturedSectionProps) {
  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
          {featuredSection.heading}
        </h2>

        {featuredSection.description && (
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {featuredSection.description}
          </p>
        )}

        {/* Decorative element */}
        <div className="mt-8 md:mt-10 flex justify-center">
          <div className="w-16 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </section>
  )
}
