import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductLinksButtons from './Buttons/ProductLinksButtons'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_ROOT = API.replace(/\/api\/?$/, '')

const resolveBannerImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl
  if (imageUrl.startsWith('/')) return `${API_ROOT}${imageUrl}`
  return `${API_ROOT}/${imageUrl}`
}

export function HeroBannersSection() {
  const [heroBanners, setHeroBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
    const interval = setInterval(fetchBanners, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${API}/banners`, {
        params: { _t: Date.now() }
      })
      const banners = response.data.data || []
      setHeroBanners(banners.filter(b => b.position === 'hero' && b.isActive))
    } catch (err) {
      console.error('Error fetching hero banners:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || heroBanners.length === 0) {
    return null
  }

  return (
    <section className="mt-1 bg-white">
      <div className="space-y-6">
        {heroBanners.map((banner) => (
          <a
            key={banner._id}
            href={banner.linkUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden block min-h-[500px] md:min-h-[600px] lg:min-h-[700px] transition-all duration-300 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
          >
            <img
              src={resolveBannerImageUrl(banner.imageUrl)}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221280%22 height=%22700%22%3E%3Crect fill=%22%23e5e7eb%22 width=%221280%22 height=%22700%22/%3E%3C/svg%3E'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent" />
            <div className="absolute inset-0" />

            <div className="relative z-10 h-full p-8 md:p-12 flex flex-col items-center justify-end">
              {/* Bottom Section - Product Links Centered */}
              <div className="w-full flex justify-center">
                <ProductLinksButtons
                  flipkartLink={banner.flipkartLink}
                  amazonLink={banner.amazonLink}
                  officialWebsiteLink={banner.officialWebsiteLink}
                />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

// Component to display horizontal banners (shown in middle of page)
export function HorizontalBannersSection() {
  const [horizontalBanners, setHorizontalBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
    const interval = setInterval(fetchBanners, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${API}/banners`, {
        params: { _t: Date.now() }
      })
      const banners = response.data.data || []
      setHorizontalBanners(banners.filter(b => b.position === 'horizontal' && b.isActive))
    } catch (err) {
      console.error('Error fetching banners:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || horizontalBanners.length === 0) {
    return null
  }

  return (
    <section className="py-8 px-4 bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {horizontalBanners.map(banner => (
            <a
              key={banner._id}
              href={banner.linkUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden transition-all duration-300 block shadow-lg hover:shadow-2xl border border-gray-100 hover:border-yellow-400 transform group-hover:scale-[1.02] group-hover:-translate-y-1"
            >
              <div className="relative h-80 bg-gradient-to-br from-gray-200 to-gray-300">
                <img
                  src={resolveBannerImageUrl(banner.imageUrl)}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22320%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22320%22/%3E%3C/svg%3E'
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/20 transition-all duration-300 flex items-center justify-between px-6">
                  <div className="text-white flex-1">
                    <p className="text-[10px] uppercase tracking-widest mb-1 text-white/80">Sponsored</p>
                    <h3 className="font-bold text-xl line-clamp-1 mb-1 group-hover:text-yellow-300 transition-colors">{banner.title}</h3>
                    {banner.description && <p className="text-sm line-clamp-1 text-gray-200">{banner.description}</p>}
                  </div>
                  <div className="flex-shrink-0 ml-4 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 text-black px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg">
                    Grab Deal
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// Default export for backward compatibility
export default function BannerDisplay() {
  return (
    <>
      <HeroBannersSection />
    </>
  )
}

