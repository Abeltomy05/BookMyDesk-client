import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ImageModalProps {
  isOpen: boolean
  images: string[]
  onClose: () => void
  initialIndex?: number
  title?: string
  backgroundColor?: 'blur' | 'black' | 'dark' | 'light' | string
  showThumbnails?: boolean
  maxWidth?: string
  maxHeight?: string
  className?: string
}

export default function ImageModal({
  isOpen,
  images,
  onClose,
  initialIndex = 0,
  title,
  backgroundColor = 'blur',
  showThumbnails = true,
  maxWidth = 'max-w-5xl',
  maxHeight = 'max-h-[70vh]',
  className = ''
}: ImageModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex)

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentImageIndex])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case 'blur':
        return 'backdrop-blur-md bg-black/50'
      case 'black':
        return 'bg-black/90'
      case 'dark':
        return 'bg-gray-900/95'
      case 'light':
        return 'bg-white/95'
      default:
        // Custom color passed as string
        return backgroundColor
    }
  }

  const getTextColor = () => {
    return backgroundColor === 'light' ? 'text-gray-900' : 'text-white'
  }

  const getButtonStyle = () => {
    return backgroundColor === 'light' 
      ? 'bg-white/50 text-gray-900 hover:bg-white/75' 
      : 'bg-black/50 text-white hover:bg-black/75'
  }

  const getThumbnailBorderColor = () => {
    return backgroundColor === 'light' ? 'border-gray-400' : 'border-gray-600'
  }

  if (!isOpen || !images || images.length === 0) {
    return null
  }

  return (
    <div className={`fixed inset-0 ${getBackgroundClass()} flex items-center justify-center z-1001 ${className}`}>
      {/* Top Right Close Button */}
      {/* <button
        onClick={onClose}
        className={`fixed top-4 right-4 z-[60] ${getButtonStyle()} p-2 rounded-full transition-all hover:scale-110 shadow-lg`}
        aria-label="Close modal"
      >
        <X size={24} />
      </button> */}

      <div className={`relative ${maxWidth} max-h-full p-6 w-full`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className={getTextColor()}>
            {title && <h3 className="text-lg font-medium mb-1">{title}</h3>}
            <span className="text-sm opacity-75">
              Image {currentImageIndex + 1} of {images.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className={`${getTextColor()} hover:opacity-75 transition-opacity p-1`}
            aria-label="Close modal"
          >
            <X size={28} />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative flex items-center justify-center">
          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${getButtonStyle()} p-2 rounded-full transition-all z-10`}
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Main Image */}
          <img
            src={images[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
            className={`max-w-full ${maxHeight} object-contain rounded-lg`}
            onError={(e) => {
              console.error('Failed to load image:', images[currentImageIndex])
              e.currentTarget.style.display = 'none'
            }}
          />

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${getButtonStyle()} p-2 rounded-full transition-all z-10`}
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {showThumbnails && images.length > 1 && (
          <div className="flex justify-center mt-4 gap-2 max-w-full overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                  index === currentImageIndex 
                    ? 'border-[#f69938] opacity-100 scale-105' 
                    : `${getThumbnailBorderColor()} opacity-60 hover:opacity-80 hover:scale-105`
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Image Counter for Mobile */}
        <div className="md:hidden text-center mt-2">
          <div className={`inline-flex items-center gap-1 ${getTextColor()} opacity-75`}>
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-[#f69938]' 
                    : backgroundColor === 'light' ? 'bg-gray-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}