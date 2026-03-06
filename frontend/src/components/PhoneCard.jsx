import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Smartphone, Heart, Cpu, ThumbsUp } from 'lucide-react'
import { phonesAPI } from '../services/api'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_ROOT = API.replace(/\/api\/?$/, '')

export default function PhoneCard({ phone }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [likeCount, setLikeCount] = useState(Number(phone?.likeCount || 0))

  if (!phone || !phone.name) {
    return null
  }

  const phoneSlug = phone.slug || phone.name.toLowerCase().replace(/\s+/g, '-')
  const rating = Number(phone.reviewStats?.averageRating || phone.userRating || (phone.scores?.valueForMoney || 0) / 2 || phone.rating || 4.5)
  const reviewCount = Number(phone.reviewStats?.totalReviews || phone.reviewCount || 0)

  useEffect(() => {
    setLikeCount(Number(phone?.likeCount || 0))
  }, [phone?._id, phone?.likeCount])
  
  // Calculate minimum variant price or use basePrice
  const minVariantPrice = phone.variants && phone.variants.length > 0
    ? Math.min(...phone.variants.map(v => v.price))
    : phone.basePrice || 0

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('bestup_token')
    if (!token) {
      return
    }

    phonesAPI.toggleLike(phone._id)
      .then((response) => {
        const liked = Boolean(response.data?.data?.liked)
        const nextCount = Number(response.data?.data?.likeCount || 0)
        setIsFavorite(liked)
        setLikeCount(nextCount)
      })
      .catch(() => {
        // Keep card browsing resilient if like request fails.
      })
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
      {phone.isNew && (
        <div className="absolute top-2 left-2 flex gap-1.5 z-10">
          <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
            NEW
          </div>
        </div>
      )}

      {/* Phone Image Section */}
      <div className="relative h-40 flex items-center justify-center rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden border-b border-gray-200">
        <div className="absolute left-2 bottom-2 z-10 inline-flex items-center gap-1 bg-black/65 text-white px-2 py-1 rounded-md text-[11px] font-semibold">
          <ThumbsUp size={12} className="text-yellow-300" />
          {likeCount}
        </div>
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
          <div className="flex items-center gap-1 mt-1">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-[11px] text-gray-500">({reviewCount} feedback)</span>
          </div>
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
          <div className="flex items-center">
            <p className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              ₹{minVariantPrice.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
