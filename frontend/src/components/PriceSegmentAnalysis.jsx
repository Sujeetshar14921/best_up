import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Smartphone, TrendingUp, BarChart3 } from 'lucide-react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const SEGMENTS = [
  { name: 'Budget', range: '₹0 - ₹15K', color: 'from-green-400 to-emerald-600', icon: '💰', maxPrice: 15000 },
  { name: 'Mid-Range', range: '₹15K - ₹40K', color: 'from-blue-400 to-blue-600', icon: '⭐', maxPrice: 40000 },
  { name: 'Premium', range: '₹40K - ₹80K', color: 'from-purple-400 to-purple-600', icon: '👑', maxPrice: 80000 },
  { name: 'Flagship', range: '₹80K+', color: 'from-red-400 to-orange-600', icon: '🔥', maxPrice: Infinity }
]

const getSegmentName = (price) => {
  if (price <= 15000) return 'Budget'
  if (price <= 40000) return 'Mid-Range'
  if (price <= 80000) return 'Premium'
  return 'Flagship'
}

export default function PriceSegmentAnalysis() {
  const [segments, setSegments] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSegmentData()
  }, [])

  const fetchSegmentData = async () => {
    try {
      setLoading(true)
      const phonesResponse = await axios.get(`${API}/phones`, {
        params: { limit: 500 }
      })
      const phones = phonesResponse.data.data || []

      const aggregate = {
        Budget: { count: 0, scoreSum: 0 },
        'Mid-Range': { count: 0, scoreSum: 0 },
        Premium: { count: 0, scoreSum: 0 },
        Flagship: { count: 0, scoreSum: 0 }
      }

      phones.forEach((phone) => {
        const segment = getSegmentName(phone.basePrice || 0)
        aggregate[segment].count += 1
        aggregate[segment].scoreSum += phone?.scores?.valueForMoney || 0
      })

      const fallbackSegments = Object.fromEntries(
        Object.entries(aggregate).map(([name, value]) => {
          const avgScore = value.count > 0 ? value.scoreSum / value.count : 0
          return [name, { count: value.count, avgScore }]
        })
      )

      setSegments(fallbackSegments)
    } catch (err) {
      console.error('Error fetching segment data:', err)
      setError('Failed to load segment data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 size={32} className="text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">Price Segments</h2>
          </div>
          <p className="text-gray-600 text-lg">Find the perfect phone in your budget</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
            {error}
          </div>
        )}

        {/* Segments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEGMENTS.map(segment => {
            const data = segments?.[segment.name]
            const phonesCount = data?.count || 0
            const avgScore = data?.avgScore || 0

            return (
              <Link
                key={segment.name}
                to={`/phones?minPrice=0&maxPrice=${segment.maxPrice}`}
              >
                <div className={`group bg-gradient-to-br ${segment.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer min-h-60 flex flex-col`}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{segment.icon}</h3>
                      <p className="text-lg font-bold mt-1">{segment.name}</p>
                    </div>
                  </div>

                  {/* Range */}
                  <p className="text-sm text-white/80 mb-4">{segment.range}</p>

                  {/* Stats */}
                  <div className="space-y-3 flex-1">
                    {phonesCount > 0 ? (
                      <>
                        <div className="bg-white/20 backdrop-blur p-3 rounded-lg">
                          <p className="text-sm text-white/80">Available Phones</p>
                          <p className="text-3xl font-bold">{phonesCount}</p>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur p-3 rounded-lg">
                          <p className="text-sm text-white/80">Avg Rating</p>
                          <div className="flex items-end gap-2 mt-1">
                            <p className="text-2xl font-bold">{avgScore.toFixed(1)}</p>
                            <p className="text-sm text-white/80">/10</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-white/20 backdrop-blur p-3 rounded-lg text-center">
                        <p className="text-white/80">No phones in this segment</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 group-hover:gap-3 transition-all">
                    <span className="text-sm font-semibold">Explore</span>
                    <TrendingUp size={18} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <div className="flex gap-4">
            <Smartphone size={24} className="text-blue-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Tips for Choosing</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>✓ Budget: Perfect for daily use and essential features</li>
                <li>✓ Mid-Range: Great balance of features and price</li>
                <li>✓ Premium: Advanced features and better cameras</li>
                <li>✓ Flagship: Top-tier performance and technology</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
