import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Zap, Smartphone, Heart, Cpu } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_ROOT = API.replace(/\/api\/?$/, '')

export default function PhoneCard({ phone }) {
  const [isFavorite, setIsFavorite] = useState(false)

  if (!phone || !phone.name) {
    return null
  }

  const phoneSlug = phone.slug || phone.name.toLowerCase().replace(/\s+/g, '-')
  const rating = phone.scores?.valueForMoney || phone.rating || 4.5
  
  // Calculate minimum variant price or use basePrice
  const minVariantPrice = phone.variants && phone.variants.length > 0
    ? Math.min(...phone.variants.map(v => v.price))
    : phone.basePrice || 0

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
  }

  return (
    <Link
      to={`/phone/${phoneSlug}`}
      className="group flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2 border border-gray-100 hover:border-yellow-400 relative"
    >
      {/* Top Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleFavoriteClick}
          className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isFavorite
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/90 text-gray-700 hover:bg-red-50'
          }`}
          title="Add to favorites"
        >
          <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
        </button>
      </div>

      {/* Badges Section */}
      {(rating >= 4.5 || phone.isNew) && (
        <div className="absolute top-2 left-2 flex gap-1.5 z-10">
          {rating >= 4.5 && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
              <Star size={12} className="fill-white" />
              <span className="text-xs font-bold">{rating.toFixed(1)}</span>
            </div>
          )}
          {phone.isNew && (
            <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
              NEW
            </div>
          )}
        </div>
      )}

      {/* Phone Image Section */}
      <div className="relative h-40 flex items-center justify-center rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden border-b border-gray-200">
        {phone.imageId ? (
          <img
            src={`${API_ROOT}/api/phones/admin/phones/${phone._id}/image`}
            alt={phone.name}
            className="w-auto h-32 max-w-full max-h-full object-contain group-hover:scale-120 transition-transform duration-500 mx-auto"
            style={{ display: 'block' }}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <Smartphone size={64} className="text-gray-400 group-hover:text-yellow-500 transition-colors duration-300 mx-auto" />
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 gap-2 p-4">
        {/* Phone Name */}
        <div>
          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-300 text-sm mb-0.5">
            {phone.name}
          </h3>
          {phone.brand && (
            <p className="text-xs text-gray-500 font-medium">{phone.brand}</p>
          )}
        </div>

        {/* Key Features - RAM, Storage */}
        {phone.specs && (phone.specs.ram || phone.specs.internalStorage) && (
          <div className="flex gap-2 mb-1.5 text-xs flex-wrap">
            {phone.specs.ram && (
              <span className="inline-flex items-center gap-0.5 bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-semibold text-xs border border-blue-200">
                <Cpu size={11} />
                {phone.specs.ram}
              </span>
            )}
            {phone.specs.internalStorage && (
              <span className="inline-flex items-center gap-0.5 bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-semibold text-xs border border-purple-200">
                💾 {phone.specs.internalStorage}
              </span>
            )}
          </div>
        )}

        {/* Highlight Display Size & Refresh Rate */}
        {phone.specs && (phone.specs.display?.size || phone.specs.display?.refreshRate) && (
          <div className="flex gap-2 mb-1.5 text-xs flex-wrap">
            {phone.specs.display?.size && (
              <span className="inline-flex items-center gap-0.5 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium text-xs border border-orange-200">
                📱 {phone.specs.display.size}
              </span>
            )}
            {phone.specs.display?.refreshRate && (
              <span className="inline-flex items-center gap-0.5 bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium text-xs border border-green-200">
                ⚡ {phone.specs.display.refreshRate}Hz
              </span>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="border-t border-gray-200 pt-2.5 mt-auto">
          <p className="text-xs text-gray-500 font-semibold mb-0.5">From</p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              ₹{minVariantPrice.toLocaleString('en-IN')}
            </p>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 flex items-center justify-center group-hover:shadow-lg transition-all group-hover:scale-110 shadow-md">
              <Zap size={18} className="text-white fill-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
