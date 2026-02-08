import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Zap, Camera, Battery, Smartphone } from 'lucide-react'

export default function PhoneCard({ phone, onClick }) {
  if (!phone || !phone.name) {
    return null
  }

  const phoneSlug = phone.slug || phone.name.toLowerCase().replace(/\s+/g, '-')
  const rating = phone.scores?.valueForMoney || phone.rating || 4.5
  
  // Calculate minimum variant price or use basePrice
  const minVariantPrice = phone.variants && phone.variants.length > 0
    ? Math.min(...phone.variants.map(v => v.price))
    : phone.basePrice || 0

  return (
    <Link
      to={`/phone/${phoneSlug}`}
      onClick={onClick}
      className="group block h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-gray-100 hover:border-blue-200 flex flex-col"
    >
      {/* Phone Image Section */}
      <div className="relative h-560 bg-yellow-50 overflow-hidden flex items-center justify-center">
        {phone.imageId ? (
          <img
            src={`http://localhost:5000/api/phones/admin/phones/${phone._id}/image`}
            alt={phone.name}
            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <Smartphone size={80} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
        )}

        {/* Rating Badge */}
        {rating && rating >= 4 && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-gray-900">{rating.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        {/* Phone Name */}
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors text-base">
          {phone.name}
        </h3>

        {/* Key Features */}
        {phone.specs && (
          <div className="flex flex-wrap gap-2 mb-4 text-xs">
            {phone.specs.display?.size && (
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                📱 {phone.specs.display.size}
              </span>
            )}
            {phone.specs.display?.refreshRate && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                ⚡ {phone.specs.display.refreshRate}Hz
              </span>
            )}
          </div>
        )}

        {/* Scores */}
        {phone.scores && (
          <div className="flex gap-3 mb-4 text-xs">
            {phone.scores.gaming && (
              <div className="flex-1 bg-yellow-50 rounded-lg p-2 text-center">
                <p className="text-blue-700 font-bold">{phone.scores.gaming}/10</p>
                <p className="text-blue-600 text-xs">Gaming</p>
              </div>
            )}
            {phone.scores.camera && (
              <div className="flex-1 bg-yellow-50 rounded-lg p-2 text-center">
                <p className="text-blue-700 font-bold">{phone.scores.camera}/10</p>
                <p className="text-blue-600 text-xs">Camera</p>
              </div>
            )}
            {phone.scores.battery && (
              <div className="flex-1 bg-yellow-50 rounded-lg p-2 text-center">
                <p className="text-blue-700 font-bold">{phone.scores.battery}/10</p>
                <p className="text-blue-600 text-xs">Battery</p>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 pt-4 mt-auto">
          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Starting at</p>
              <p className="text-xl font-bold text-blue-600">₹{minVariantPrice.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center group-hover:shadow-lg transition-all group-hover:scale-110">
              <Zap size={18} className="text-white fill-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
