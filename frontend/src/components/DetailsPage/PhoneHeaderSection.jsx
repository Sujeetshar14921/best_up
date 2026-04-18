import React from 'react'
import { Heart, Share2 } from 'lucide-react'
import ProductLinksButtons from '../Buttons/ProductLinksButtons'
import { formatCurrency, scoreText, renderStars } from './utils.jsx'
import { CalendarDays, Cpu, Battery, Smartphone, Gauge } from 'lucide-react'

export default function PhoneHeaderSection({
  phone,
  rating,
  reviewCount,
  likeCount,
  phoneLiked,
  likeUpdating,
  onPhoneLike
}) {
  const specs = phone.specs || {}
  const variants = Array.isArray(phone.variants) ? phone.variants : []
  const variantPrices = variants.map((v) => v.price).filter(Boolean)
  const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : phone.basePrice
  const maxPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : phone.basePrice

  const quickFacts = [
    { label: 'Launch', value: phone.releaseDate ? new Date(phone.releaseDate).toLocaleDateString('en-IN') : 'Not available', icon: CalendarDays },
    { label: 'Processor', value: specs.performance?.processor || 'Not specified', icon: Cpu },
    { label: 'Battery', value: specs.battery?.capacity ? `${specs.battery.capacity} mAh` : 'Not specified', icon: Battery },
    { label: 'Refresh Rate', value: specs.display?.refreshRate ? `${specs.display.refreshRate} Hz` : 'Not specified', icon: Smartphone },
  ]

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wider font-semibold text-yellow-700">{phone.brand}</p>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">{phone.name}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-100 border border-yellow-200 text-yellow-800 font-semibold text-sm">
            <span className="inline-flex items-center gap-1">{renderStars(rating)}</span>
            {rating.toFixed(1)} / 5
          </span>
          <span className="text-sm text-gray-600">
            {scoreText(rating)}
            {reviewCount > 0 ? ` • ${reviewCount} reviews` : ''}
          </span>
          <span className="text-sm text-gray-600">• {likeCount} likes</span>
        </div>

        <div className="mt-7">
          <p className="text-sm text-gray-500">Price range</p>
          <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
            {formatCurrency(minPrice)}
            {maxPrice && maxPrice !== minPrice ? ` - ${formatCurrency(maxPrice)}` : ''}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {quickFacts.map((fact) => (
            <div key={fact.label} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-center gap-2 text-gray-600 text-xs font-semibold uppercase tracking-wide">
                <fact.icon size={14} className="text-yellow-700" />
                {fact.label}
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">{fact.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={onPhoneLike}
            disabled={likeUpdating}
            className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 border transition-all ${
              phoneLiked
                ? 'bg-red-100 text-red-700 border-red-200'
                : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'
            } ${likeUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Heart size={18} className="fill-current" />
            {likeCount} Likes
          </button>
          <button className="px-5 py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-200">
            <Share2 size={18} />
            Share
          </button>
          
          {/* Product Links */}
          {(phone.flipkartLink || phone.amazonLink || phone.officialWebsiteLink) && (
            <div className="flex items-center gap-3 ml-auto">
              <ProductLinksButtons
                flipkartLink={phone.flipkartLink}
                amazonLink={phone.amazonLink}
                officialWebsiteLink={phone.officialWebsiteLink}
                size="md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
