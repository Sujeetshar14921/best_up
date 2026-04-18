import React from 'react'
import { Globe } from 'lucide-react'

export default function ProductLinksButtons({ flipkartLink, amazonLink, officialWebsiteLink, size = 'md' }) {
  if (!flipkartLink && !amazonLink && !officialWebsiteLink) {
    return null
  }

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-xl',
    lg: 'w-16 h-16 text-2xl'
  }
  const iconSize = {
    sm: 16,
    md: 24,
    lg: 32
  }

  const classes = sizeClasses[size] || sizeClasses.md
  const iconSizeValue = iconSize[size] || iconSize.md

  return (
    <div className="flex items-center gap-2">
      {/* Flipkart Link */}
      {flipkartLink && (
        <a
          href={flipkartLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center ${classes} bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl`}
          title="Buy on Flipkart"
        >
          <span className="text-white font-bold">F</span>
        </a>
      )}

      {/* Amazon Link */}
      {amazonLink && (
        <a
          href={amazonLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center ${classes} bg-orange-600 hover:bg-orange-700 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl`}
          title="Buy on Amazon"
        >
          <span className="text-white font-bold">A</span>
        </a>
      )}

      {/* Official Website */}
      {officialWebsiteLink && (
        <a
          href={officialWebsiteLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center ${classes} bg-green-600 hover:bg-green-700 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl`}
          title="Visit Official Website"
        >
          <Globe size={iconSizeValue} className="text-white" />
        </a>
      )}
    </div>
  )
}
