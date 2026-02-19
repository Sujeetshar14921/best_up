import React, { useState, useEffect, useRef } from 'react'
import { Search, Filter, X } from 'lucide-react'
import axios from 'axios'

export default function FilterBar({ onFilterChange, onSearch, initialFilters = {}, initialSearch = '' }) {
  const [showFilters, setShowFilters] = useState(false)
  const [allBrands, setAllBrands] = useState([])
  const [filters, setFilters] = useState({
    brand: initialFilters.brand || '',
    priceMin: initialFilters.priceMin || '',
    priceMax: initialFilters.priceMax || '',
    ram: initialFilters.ram || '',
    sort: initialFilters.sort || 'name'
  })
  const [searchInput, setSearchInput] = useState(initialSearch)
  const filterTimeoutRef = useRef(null)
  const searchTimeoutRef = useRef(null)

  // Fetch brands on mount
  useEffect(() => {
    fetchBrandsData()
  }, [])

  // Update filters when initialFilters change
  useEffect(() => {
    setFilters({
      brand: initialFilters.brand || '',
      priceMin: initialFilters.priceMin || '',
      priceMax: initialFilters.priceMax || '',
      ram: initialFilters.ram || '',
      sort: initialFilters.sort || 'name'
    })
  }, [initialFilters])

  // Update search when initialSearch changes
  useEffect(() => {
    setSearchInput(initialSearch)
  }, [initialSearch])

  const fetchBrandsData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/brands')
      const brandNames = response.data.data?.map(b => b.name) || []
      setAllBrands(brandNames)
    } catch (err) {
      console.error('Failed to fetch brands:', err)
      setAllBrands(['OnePlus', 'iPhone', 'Samsung', 'Google', 'Xiaomi']) // Fallback
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    console.log('🔧 Filter changed:', name, '=', value)
    
    // Debounce filter changes to avoid race conditions
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current)
    }
    filterTimeoutRef.current = setTimeout(() => {
      onFilterChange(newFilters)
    }, 300)
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchInput(value)
    console.log('🔍 Search input:', value)
    
    // Debounce search to avoid race conditions
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(value)
    }, 500)
  }

  const clearFilters = () => {
    setFilters({
      brand: '',
      priceMin: '',
      priceMax: '',
      ram: '',
      sort: 'name'
    })
    setSearchInput('')
    
    // Clear any pending timeouts
    if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    
    onFilterChange({})
    onSearch('')
  }

  const ramOptions = ['6GB', '8GB', '12GB', '16GB']

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search phones by name, brand, or model..."
          value={searchInput}
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <Filter size={18} />
          Advanced Filters
        </button>
        {(Object.values(filters).some(v => v) || searchInput) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
          >
            <X size={18} />
            Clear All
          </button>
        )}
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand
              </label>
              <select
                name="brand"
                value={filters.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 transition-all"
              >
                <option value="">All Brands</option>
                {allBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Price (₹)
              </label>
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleChange}
                placeholder="15000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Price (₹)
              </label>
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleChange}
                placeholder="200000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 transition-all"
              />
            </div>

            {/* RAM Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum RAM
              </label>
              <select
                name="ram"
                value={filters.ram}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 transition-all"
              >
                <option value="">Any RAM</option>
                {ramOptions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 transition-all"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price">Price (Low to High)</option>
                <option value="-price">Price (High to Low)</option>
                <option value="-scores.gaming">Gaming Score</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
