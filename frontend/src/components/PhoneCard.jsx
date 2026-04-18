import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Smartphone } from 'lucide-react'
import ProductLinksButtons from './Buttons/ProductLinksButtons'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_ROOT = API.replace(/\/api\/?$/, '')

export default function PhoneCard({ phone }) {
  const [imageError, setImageError] = useState(false)

  if (!phone || !phone.name) {
    return null
  }

  const phoneSlug = phone.slug || phone.name.toLowerCase().replace(/\s+/g, '-')
  const rating = Number(phone.reviewStats?.averageRating || phone.userRating || (phone.scores?.valueForMoney || 0) / 2 || phone.rating || 4.5)
  
  // Calculate minimum variant price or use basePrice
  const minVariantPrice = phone.variants && phone.variants.length > 0
    ? Math.min(...phone.variants.map(v => v.price))
    : phone.basePrice || 0

  return (
    <Link
      to={`/phone/${phoneSlug}`}
      className="group flex flex-col h-full rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2 border border-white/50 hover:border-yellow-300/60 relative"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 8px 32px 0 rgba(31, 38, 135, 0.15)'
      }}
    >
      {/* Phone Image Section */}
      <div 
        className="relative h-48 flex items-center justify-center overflow-hidden border-b border-white/20"
        style={{
          background: '#edeae1',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)'
        }}
      >
        {!imageError && phone.imageId ? (
          <img
            src={`${API_ROOT}/api/phones/admin/phones/${phone._id}/image`}
            alt={phone.name}
            className="w-auto h-40 max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 mx-auto"
            onError={() => setImageError(true)}
          />
        ) : (
          <Smartphone size={80} className="text-gray-300 group-hover:text-yellow-300 transition-colors duration-300 mx-auto" />
        )}
      </div>

      {/* Content Section */}
      <div 
        className="flex flex-col flex-1 gap-3 p-4 border-t border-white/60"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Brand and Rating Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Phone Brand */}
          {phone.brand && (
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {phone.brand}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md rounded-lg px-3 py-2 border border-yellow-200/30 whitespace-nowrap">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Phone Name */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-300 text-sm leading-tight">
            {phone.name}
          </h3>
        </div>

        {/* Price Section */}
        <div className="border-t border-white/20 pt-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              ₹{minVariantPrice.toLocaleString('en-IN')}
            </p>
            {(phone.flipkartLink || phone.amazonLink || phone.officialWebsiteLink) && (
              <ProductLinksButtons
                flipkartLink={phone.flipkartLink}
                amazonLink={phone.amazonLink}
                officialWebsiteLink={phone.officialWebsiteLink}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
