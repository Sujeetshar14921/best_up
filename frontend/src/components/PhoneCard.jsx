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
      className="group block h-full bg-transparent rounded-2xl shadow-none hover:shadow-lg overflow-visible transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2 flex flex-col p-4"
    >
      {/* Phone Image Section */}
      <div className="relative h-40 flex items-center justify-center rounded-2xl bg-transparent mb-3 overflow-hidden">
        {phone.imageId ? (
          <img
            src={`http://localhost:5000/api/phones/admin/phones/${phone._id}/image`}
            alt={phone.name}
            className="w-auto h-32 max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 mx-auto"
            style={{ display: 'block' }}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <Smartphone size={80} className="text-gray-300 group-hover:text-yellow-400 transition-colors duration-300 mx-auto" />
        )}

        {/* Rating Badge */}
        {rating && rating >= 4 && (
          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-900">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 gap-2">
        {/* Phone Name */}
        <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-300 text-base mb-1">
          {phone.name}
        </h3>

        {/* Key Features */}
        {phone.specs && (
          <div className="flex flex-wrap gap-2 mb-2 text-xs">
            {phone.specs.display?.size && (
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                📱 {phone.specs.display.size}
              </span>
            )}
            {phone.specs.display?.refreshRate && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                ⚡ {phone.specs.display.refreshRate}Hz
              </span>
            )}
          </div>
        )}

        {/* Scores */}
        {phone.scores && (
          <div className="flex gap-2 mb-2 text-xs flex-wrap overflow-visible">
            {phone.scores.gaming && (
              <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-100 min-w-[80px] max-w-[100px] flex-1 overflow-hidden">
                <p className="text-blue-700 font-bold whitespace-nowrap">{phone.scores.gaming}/10</p>
                <p className="text-blue-600 text-xs whitespace-nowrap">Gaming</p>
              </div>
            )}
            {phone.scores.camera && (
              <div className="bg-purple-50 rounded-lg p-2 text-center border border-purple-100 min-w-[80px] max-w-[100px] flex-1 overflow-hidden">
                <p className="text-purple-700 font-bold whitespace-nowrap">{phone.scores.camera}/10</p>
                <p className="text-purple-600 text-xs whitespace-nowrap">Camera</p>
              </div>
            )}
            {phone.scores.battery && (
              <div className="bg-green-50 rounded-lg p-2 text-center border border-green-100 min-w-[80px] max-w-[100px] flex-1 overflow-hidden">
                <p className="text-green-700 font-bold whitespace-nowrap">{phone.scores.battery}/10</p>
                <p className="text-green-600 text-xs whitespace-nowrap">Battery</p>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 pt-4 mt-auto">
          {/* Price Section */}
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-xs text-gray-500 mb-1">Starting at</p>
              <p className="text-xl font-bold text-yellow-600">₹{minVariantPrice.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center group-hover:shadow-lg transition-all group-hover:scale-110">
              <Zap size={20} className="text-white fill-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
