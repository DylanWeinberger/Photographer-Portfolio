'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Photo } from '@/types/sanity'

interface LightboxContextType {
  isOpen: boolean
  photos: Photo[]
  currentIndex: number
  openLightbox: (photos: Photo[], startIndex: number) => void
  closeLightbox: () => void
  nextPhoto: () => void
  prevPhoto: () => void
  setCurrentIndex: (index: number) => void
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined)

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (newPhotos: Photo[], startIndex: number) => {
    setPhotos(newPhotos)
    setCurrentIndex(startIndex)
    setIsOpen(true)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setIsOpen(false)
    // Re-enable body scroll
    document.body.style.overflow = 'unset'
  }

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => {
      // Loop to start if at end
      return prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    })
  }

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => {
      // Loop to end if at start
      return prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    })
  }

  return (
    <LightboxContext.Provider
      value={{
        isOpen,
        photos,
        currentIndex,
        openLightbox,
        closeLightbox,
        nextPhoto,
        prevPhoto,
        setCurrentIndex,
      }}
    >
      {children}
    </LightboxContext.Provider>
  )
}

// Custom hook for easy consumption
export function useLightbox() {
  const context = useContext(LightboxContext)
  if (context === undefined) {
    throw new Error('useLightbox must be used within a LightboxProvider')
  }
  return context
}
