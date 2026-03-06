import React, { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users, Smartphone, Star, Heart, Activity } from 'lucide-react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalPhones: 0,
    activeUsers: 0,
    trendingCount: 0,
    avgRating: 0,
    wishlistCount: 0,
    reviewCount: 0,
    topPhones: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [statsRes, trendingRes, usersRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/analytics/trending`, {
          params: { timeframe, limit: 10 }
        }),
        // Admin-authenticated endpoint. If token is missing, fallback below keeps values safe.
        axios.get(`${API}/users`).catch(() => ({ data: { data: [] } }))
      ])

      const stats = statsRes?.data?.stats || {}
      const topPhones = trendingRes?.data?.data || []
      const users = usersRes?.data?.data || []

      const activeUsers = users.length > 0
        ? users.filter((u) => u.isActive).length
        : (stats.totalUsers || 0)

      const reviewCount = stats.totalReviews || 0
      const avgRating = topPhones.length > 0
        ? (topPhones.reduce((sum, p) => sum + Number(p?.scores?.valueForMoney || 0), 0) / topPhones.length)
        : 0

      const wishlistCount = users.reduce((sum, u) => sum + (Array.isArray(u.wishlist) ? u.wishlist.length : 0), 0)

      setAnalytics({
        totalPhones: stats.totalPhones || 0,
        activeUsers,
        trendingCount: topPhones.length,
        avgRating,
        wishlistCount,
        reviewCount,
        topPhones
      })
      setError(null)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    )
  }

  const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtext && <p className="text-white/70 text-xs mt-2">{subtext}</p>}
        </div>
        <Icon size={32} className="text-white/40" />
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 size={32} className="text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map(period => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  timeframe === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
        <p className="text-gray-600">Monitor platform performance and user engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Smartphone}
          label="Total Phones"
          value={analytics?.totalPhones || 0}
          subtext="In catalog"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Users}
          label="Active Users"
          value={analytics?.activeUsers || 0}
          subtext="This period"
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Trending Items"
          value={analytics?.trendingCount || 0}
          subtext="Growing popularity"
          color="from-green-500 to-green-600"
        />
        <StatCard
          icon={Star}
          label="Avg Rating"
          value={(analytics?.avgRating || 0).toFixed(1)}
          subtext="Out of 10"
          color="from-yellow-500 to-yellow-600"
        />
        <StatCard
          icon={Heart}
          label="Wishlist Adds"
          value={analytics?.wishlistCount || 0}
          subtext="User favorites"
          color="from-red-500 to-red-600"
        />
        <StatCard
          icon={Activity}
          label="Reviews"
          value={analytics?.reviewCount || 0}
          subtext="User feedback"
          color="from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Top Performing Section */}
      {analytics?.topPhones && analytics.topPhones.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={24} />
              Top Performing Phones
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Phone Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Trend Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.topPhones.slice(0, 5).map((phone, idx) => (
                  <tr key={phone._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Smartphone size={20} className="text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-900">{phone.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full"
                            style={{ width: `${(phone.trendScore / 100) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{phone.trendScore.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{phone.views || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < Math.round(phone.rating || 0) ? '⭐' : '☆'}`}></span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Activity size={20} className="text-blue-600" />
          Key Insights
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span>Top performing phones show strong user engagement with high trend scores</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span>User reviews and ratings indicate positive reception of featured phones</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span>Wishlist additions show strong purchase intent from users</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span>Consider promoting low-performing items or improving their visibility</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdminAnalytics
