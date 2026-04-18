import React, { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'
import axios from 'axios'
import { reviewAPI } from '../../services/api'
import PhoneCard from '../PhoneCard'

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
          limit: 50,
          sort: '-scores.valueForMoney'
        }
      })
      const base = (response.data.data || [])
        .filter((phone) => phone.recommended)
        .slice(0, 10)

      const ids = base.map((p) => p?._id).filter(Boolean)
      let statsByPhoneId = {}
      try {
        const statsResponse = await reviewAPI.getStats(ids)
        statsByPhoneId = statsResponse?.data?.data || {}
      } catch (statsErr) {
        statsByPhoneId = {}
      }

      const normalized = base.map((phone, idx) => ({
        ...phone,
        reviewStats: statsByPhoneId[phone._id] || null,
        reviewCount: statsByPhoneId[phone._id]?.totalReviews || 0,
        trendScore: (statsByPhoneId[phone._id]?.averageRating || (phone?.scores?.valueForMoney || 0) / 2 || 0) + (10 - idx) * 0.01
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
      <section className="py-12 md:py-16 px-0 w-screen bg-gradient-to-b from-red-50 to-white">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-12">
            <Flame size={28} className="text-red-500" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Trending Right Now</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-48 sm:h-56 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 px-0 w-screen bg-gradient-to-b from-red-50 to-white">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header with Timeframe Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12">
          <div className="flex items-center gap-2 md:gap-3">
            <Flame size={28} className="text-red-500 animate-bounce flex-shrink-0" />
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">🔥 Trending Right Now</h2>
              <p className="text-gray-600 text-xs md:text-base mt-1">Most popular phones this {timeframe === '7d' ? 'week' : 'month'}</p>
            </div>
          </div>
          
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${timeframe === '7d' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${timeframe === '30d' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              This Month
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mb-6 md:mb-8">
            <p className="text-red-700 text-sm md:text-base">{error}</p>
          </div>
        )}

        {/* Trending Phones Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {phones.length > 0 ? (
            phones.map((phone) => (
              <div key={phone._id}>
                <PhoneCard phone={phone} />
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center mb-4 md:mb-6">
                <p className="text-gray-700 font-semibold text-sm md:text-base">No approved trending phones yet</p>
                <p className="text-gray-500 text-xs md:text-sm">Admin can enable "Show in Home Trending section" in Phone Management.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white border border-dashed border-gray-300 rounded-2xl h-40 sm:h-48 md:h-64 flex flex-col items-center justify-center text-center px-3">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-2 md:mb-3">
                      <Flame size={16} />
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-gray-700">Card {i + 1}</p>
                    <p className="text-xs text-gray-500 mt-1">Appears when set by admin</p>
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
