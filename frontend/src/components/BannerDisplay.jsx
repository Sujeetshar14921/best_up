import React, { useEffect, useState } from 'react'
import axios from 'axios'

// Component to display vertical banners (shown at top)
export function VerticalBannersSection() {
  const [verticalBanners, setVerticalBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/banners')
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
    <section className="py-8 px-4 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verticalBanners.map(banner => (
            <a
              key={banner._id}
              href={banner.linkUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-lg transition-all duration-300 block h-80"
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22400%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22300%22 height=%22400%22/%3E%3C/svg%3E'
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-start p-6 opacity-0 group-hover:opacity-100">
                <div className="text-white">
                  <h3 className="font-bold text-xl line-clamp-2">{banner.title}</h3>
                  {banner.description && <p className="text-sm mt-2 line-clamp-2">{banner.description}</p>}
                </div>
              </div>

              {/* Always Visible Title at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 group-hover:hidden">
                <h3 className="text-white font-bold text-sm line-clamp-2">{banner.title}</h3>
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
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/banners')
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
    <section className="py-6 px-4 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {horizontalBanners.map(banner => (
            <a
              key={banner._id}
              href={banner.linkUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-lg transition-all duration-300 block"
            >
              <div className="relative h-32 bg-gray-200">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22150%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22150%22/%3E%3C/svg%3E'
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="text-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-bold text-lg">{banner.title}</h3>
                    {banner.description && <p className="text-sm">{banner.description}</p>}
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

