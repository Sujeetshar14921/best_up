import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Flame, TrendingUp, Star, Zap } from 'lucide-react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function TrendingPhones() {
  const [phones, setPhones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState('7d')

  useEffect(() => {
    fetchTrendingPhones()
  }, [timeframe])

  const fetchTrendingPhones = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API}/phones`, {
        params: {
          limit: 10,
          sort: '-scores.valueForMoney'
        }
      })
      const normalized = (response.data.data || []).map((phone, idx) => ({
        ...phone,
        reviewCount: 0,
        trendScore: (phone?.scores?.valueForMoney || 0) + (10 - idx) * 0.01
      }))
      setPhones(normalized)
      setError(null)
    } catch (err) {
      console.error('Error fetching trending phones:', err)
      setError('Failed to load trending phones')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <Flame size={32} className="text-red-500" />
            <h2 className="text-4xl font-bold text-gray-900">Trending Right Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with Timeframe Selector */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Flame size={32} className="text-red-500 animate-bounce" />
            <div>
              <h2 className="text-4xl font-bold text-gray-900">🔥 Trending Right Now</h2>
              <p className="text-gray-600 mt-1">Most popular phones this {timeframe === '7d' ? 'week' : 'month'}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                timeframe === '7d'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                timeframe === '30d'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Trending Phones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {phones.length > 0 ? (
            phones.map((phone, index) => (
              <Link
                key={phone._id}
                to={`/phone/${phone.slug}`}
                className="group relative"
              >
                <div className="relative h-full bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-red-400">
                  {/* Rank Badge */}
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                    #{index + 1}
                  </div>

                  {/* Trending Indicator */}
                  <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <TrendingUp size={14} />
                    Trending
                  </div>

                  {/* Phone Image */}
                  <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                    {phone.imageId ? (
                      <img
                        src={`${API.replace('/api', '')}/api/phones/admin/phones/${phone._id}/image`}
                        alt={phone.name}
                        className="h-28 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <Zap size={50} className="text-gray-400" />
                    )}
                  </div>

                  {/* Phone Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 text-sm mb-2">{phone.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{phone.brand}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-900">{phone.scores?.valueForMoney?.toFixed(1) || 4.5}</span>
                    </div>

                    {/* Review Count & Trend Score */}
                    <div className="space-y-2 mb-3 pb-3 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-600 pt-2">
                        <span>Reviews: {phone.reviewCount || 0}</span>
                        <span className="text-red-600 font-semibold">Trend: {phone.trendScore?.toFixed(1) || 0}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        ₹{phone.basePrice?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                        Hot
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center mb-6">
                <p className="text-gray-700 font-semibold">No trending phones yet</p>
                <p className="text-gray-500 text-sm">Admin can mark phones as recommended to show them here.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white border border-dashed border-gray-300 rounded-2xl h-64 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-3">
                      <Zap size={24} />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Trending Card {i + 1}</p>
                    <p className="text-xs text-gray-500 mt-1">Will appear when phones are set by admin</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
