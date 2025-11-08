import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import type { Homepage } from '@/types/sanity'

type AboutProps = {
  about: Homepage['about']
}

// Custom components for PortableText rendering
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
}

export default function About({ about }: AboutProps) {
  const profileImageUrl = about.profileImage.asset
    ? urlFor(about.profileImage).width(600).height(600).quality(90).url()
    : null

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="bebas text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-12 md:mb-16 text-center">
          {about.heading}
        </h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Profile Image */}
          {profileImageUrl && (
            <div className="order-2 md:order-1">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={profileImageUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}

          {/* Bio Content */}
          <div className="order-1 md:order-2">
            <div className="prose prose-lg max-w-none">
              <PortableText
                value={about.bio}
                components={portableTextComponents}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
