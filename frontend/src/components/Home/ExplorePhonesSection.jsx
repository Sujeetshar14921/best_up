import React, { useState, useEffect } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import axios from 'axios'
import LoadingError from '../LoadingError'
import PhoneCard from '../PhoneCard'
import FilterPhonesModal from './FilterPhonesModal'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ExplorePhonesSection({ phones = [], loading, error, onFilterChange }) {
  const [showFilters, setShowFilters] = useState(false)
  const [brands, setBrands] = useState([])
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    minRam: '',
    minStorage: '',
    minDisplaySize: '',
    minRating: '',
    minCamera: '',
    minBattery: '',
    processor: '',
    sort: '-createdAt'
  })

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API}/brands`)
      setBrands(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch brands:', err)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      brand: '',
      minPrice: '',
      maxPrice: '',
      minRam: '',
      minStorage: '',
      minDisplaySize: '',
      minRating: '',
      minCamera: '',
      minBattery: '',
      processor: '',
      sort: '-createdAt'
    }
    setFilters(clearedFilters)
    onFilterChange?.(clearedFilters)
  }

  return (
    <section id="explore-phones" className="py-12 md:py-16 px-0 w-screen bg-gray-50 border-b border-gray-100">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-3">Explore Phones</h2>
          <p className="text-gray-600 text-base md:text-lg mb-4">Browse our collection of smartphones</p>
          <button
            onClick={() => setShowFilters(true)}
            className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-yellow-50 transition-colors"
          >
            <SlidersHorizontal size={18} />
            Filter Results
          </button>
        </div>

        <LoadingError loading={loading} error={error}>
          {phones.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-700">No phones found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {phones.slice(0, 24).map((phone) => (
                <div key={phone._id}>
                  <PhoneCard phone={phone} />
                </div>
              ))}
            </div>
          )}
        </LoadingError>
      </div>

      <FilterPhonesModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={clearFilters}
        brands={brands}
      />
    </section>
  )
}
