import React, { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

export default function FilterBar({ onFilterChange, onSearch }) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    brand: '',
    priceMin: '',
    priceMax: '',
    ram: '',
    sort: 'name'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSearch = (e) => {
    onSearch(e.target.value)
  }

  const clearFilters = () => {
    setFilters({
      brand: '',
      priceMin: '',
      priceMax: '',
      ram: '',
      sort: 'name'
    })
    onFilterChange({})
  }

  const brands = ['OnePlus', 'iPhone', 'Samsung', 'Google', 'Xiaomi']
  const ramOptions = ['6GB', '8GB', '12GB', '16GB']

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search phones by name, brand, or model..."
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
        {Object.values(filters).some(v => v) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
          >
            <X size={18} />
            Clear Filters
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all"
              >
                <option value="">All Brands</option>
                {brands.map(b => (
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all"
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all"
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all"
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all"
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
