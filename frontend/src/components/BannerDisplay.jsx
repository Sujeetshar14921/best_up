import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Component to display vertical banners (shown at top)
export function VerticalBannersSection() {
  const [verticalBanners, setVerticalBanners] = useState([])
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
      setVerticalBanners(banners.filter(b => b.position === 'vertical' && b.isActive))
    } catch (err) {
      console.error('Error fetching banners:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || verticalBanners.length === 0) {
    return null
  }

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verticalBanners.map(banner => (
            <a
              key={banner._id}
              href={banner.linkUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 block h-80 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-yellow-400 transform group-hover:scale-105 group-hover:-translate-y-2"
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-120 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22400%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22300%22 height=%22400%22/%3E%3C/svg%3E'
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 flex flex-col items-end justify-between p-5">
                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg group-hover:shadow-xl transition-all">
                  ✨ Shop Now
                </div>
                <div className="text-white text-end">
                  <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-yellow-300 transition-colors">{banner.title}</h3>
                  {banner.description && <p className="text-xs mt-1 line-clamp-2 text-gray-200">{banner.description}</p>}
                  <div className="flex items-center justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-semibold">View</span>
                    <span className="text-lg">→</span>
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
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {horizontalBanners.map(banner => (
            <a
              key={banner._id}
              href={banner.linkUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 block shadow-lg hover:shadow-2xl border border-gray-100 hover:border-yellow-400 transform group-hover:scale-105 group-hover:-translate-y-2"
            >
              <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-120 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22150%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22150%22/%3E%3C/svg%3E'
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 group-hover:from-black/80 group-hover:to-black/50 transition-all duration-300 flex items-center justify-between px-6">
                  <div className="text-white flex-1">
                    <h3 className="font-bold text-lg line-clamp-1 mb-1 group-hover:text-yellow-300 transition-colors">{banner.title}</h3>
                    {banner.description && <p className="text-sm line-clamp-1 text-gray-300">{banner.description}</p>}
                  </div>
                  <div className="flex-shrink-0 ml-4 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg group-hover:shadow-xl transform group-hover:scale-110">
                    Explore
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
  return <VerticalBannersSection />
}

