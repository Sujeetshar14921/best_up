import React, { useState, useEffect } from 'react'
import { Gamepad2, Camera, Battery, Zap, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'
import PhoneCard from './PhoneCard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const CATEGORIES = [
  { id: 'gaming', label: '🎮 Gaming', icon: Gamepad2, color: 'from-purple-500 to-pink-500' },
  { id: 'camera', label: '📷 Camera', icon: Camera, color: 'from-blue-500 to-cyan-500' },
  { id: 'battery', label: '🔋 Battery', icon: Battery, color: 'from-green-500 to-emerald-500' },
  { id: 'display', label: '🖥️ Display', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { id: 'valueForMoney', label: '💰 Value', icon: TrendingUp, color: 'from-red-500 to-orange-500' }
]

const CATEGORY_SORT_MAP = {
  gaming: '-scores.gaming',
  camera: '-scores.camera',
  battery: '-scores.battery',
  display: '-scores.display',
  valueForMoney: '-scores.valueForMoney'
}

export default function TopRatedByCategory() {
  const [selectedCategory, setSelectedCategory] = useState('gaming')
  const [showAll, setShowAll] = useState(false)
  const [phones, setPhones] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTopPhones()
  }, [selectedCategory, showAll])

  useEffect(() => {
    // Reset in-place expansion whenever category changes.
    setShowAll(false)
  }, [selectedCategory])

  const fetchTopPhones = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API}/phones`, {
        params: {
          limit: showAll ? 100 : 10,
          sort: CATEGORY_SORT_MAP[selectedCategory] || '-scores.valueForMoney'
        }
      })
      setPhones(response.data.data || [])
    } catch (err) {
      console.error('Error fetching top phones:', err)
      setError('Failed to load phones')
    } finally {
      setLoading(false)
    }
  }

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategory)
  const Icon = currentCategory?.icon || Gamepad2

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            🏆 Top Rated Phones
          </h2>
          <p className="text-gray-600 text-lg">
            Best phones in every category
          </p>
        </div>

        {/* Category Selector */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-xl mb-1">{category.label.split(' ')[0]}</div>
              <div className="text-xs">{category.label.split(' ')[1]}</div>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
            {error}
          </div>
        ) : (
          <div>
            {/* Category Title with Icon */}
            <div className="flex items-center gap-3 mb-8">
              <div className={`bg-gradient-to-r ${currentCategory.color} p-3 rounded-lg`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Best for {currentCategory.label.split(' ')[1]}
              </h3>
            </div>

            {/* Phones Grid */}
            {phones.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {phones.map((phone) => (
                  <div key={phone._id} className="relative group">
                    <PhoneCard phone={phone} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No phones found for this category</p>
              </div>
            )}

            {/* View All Link */}
            <div className="text-center mt-12">
              <button
                type="button"
                onClick={() => setShowAll(prev => !prev)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all hover:scale-105"
              >
                {showAll ? 'Show Top 10' : `View All ${CATEGORIES.find(c => c.id === selectedCategory)?.label.split(' ')[1]} Phones`}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
