import React, { useState, useCallback } from 'react'
import { Settings, X, Check, Zap } from 'lucide-react'

const AdvancedFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [expanded, setExpanded] = useState(false)
  const [filters, setFilters] = useState({
    priceMin: initialFilters.priceMin || 0,
    priceMax: initialFilters.priceMax || 150000,
    ram: initialFilters.ram || [],
    storage: initialFilters.storage || [],
    display: initialFilters.display || [],
    refreshRate: initialFilters.refreshRate || [],
    battery: initialFilters.battery || [],
    processor: initialFilters.processor || []
  })

  const [activeTab, setActiveTab] = useState('price')

  const ramOptions = [2, 4, 6, 8, 12, 16]
  const storageOptions = [64, 128, 256, 512]
  const displayOptions = [
    { label: 'Small (<6.0")', value: 'small' },
    { label: 'Medium (6.0-6.5")', value: 'medium' },
    { label: 'Large (6.5-7.0")', value: 'large' },
    { label: 'Extra Large (>7.0")', value: 'xlarge' }
  ]
  const refreshRateOptions = [60, 90, 120, 144, 165]
  const batteryOptions = [
    { label: '<4000mAh', value: 'low' },
    { label: '4000-5000mAh', value: 'medium' },
    { label: '5000-6000mAh', value: 'high' },
    { label: '>6000mAh', value: 'veryHigh' }
  ]
  const processorOptions = [
    { label: 'Snapdragon 8', value: 'snapdragon8' },
    { label: 'Snapdragon 7', value: 'snapdragon7' },
    { label: 'Bionic', value: 'bionic' },
    { label: 'Exynos', value: 'exynos' }
  ]

  const handlePriceChange = useCallback((type, value) => {
    const newValue = Math.max(0, Number(value))
    const updated = { ...filters, [type]: newValue }
    setFilters(updated)
    onFilterChange(updated)
  }, [filters, onFilterChange])

  const handleMultiSelect = useCallback((category, value) => {
    const current = filters[category] || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    
    const newFilters = { ...filters, [category]: updated }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }, [filters, onFilterChange])

  const handleReset = () => {
    const resetFilters = {
      priceMin: 0,
      priceMax: 150000,
      ram: [],
      storage: [],
      display: [],
      refreshRate: [],
      battery: [],
      processor: []
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const activeFilterCount = Object.values(filters).reduce((sum, val) => {
    if (typeof val === 'number') return sum
    return sum + (Array.isArray(val) ? val.length : 0)
  }, 0)

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-6 right-6 md:relative md:bottom-auto md:right-auto flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40 font-semibold"
      >
        <Settings size={20} />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto md:relative md:bg-transparent">
      <div className="bg-white rounded-t-3xl md:rounded-2xl md:border md:border-gray-200 p-6 min-h-screen md:min-h-auto max-w-2xl md:w-full md:sticky md:top-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="text-blue-600" size={24} />
              Advanced Filters
            </h2>
            <p className="text-sm text-gray-500 mt-1">Customize your search</p>
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 md:flex-wrap">
          {['price', 'ram', 'storage', 'display', 'refreshRate', 'battery', 'processor'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {filters[tab]?.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {filters[tab].length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mb-6">
          {/* Price Tab */}
          {activeTab === 'price' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Price Range: ₹{filters.priceMin.toLocaleString()} - ₹{filters.priceMax.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="5000"
                  value={filters.priceMin}
                  onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                  className="w-full accent-blue-600"
                />
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="5000"
                  value={filters.priceMax}
                  onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                  className="w-full accent-blue-600 mt-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.priceMin}
                  onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.priceMax}
                  onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* RAM Tab */}
          {activeTab === 'ram' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ramOptions.map(ram => (
                <button
                  key={ram}
                  onClick={() => handleMultiSelect('ram', ram)}
                  className={`p-3 rounded-lg font-semibold transition flex items-center justify-between ${
                    filters.ram.includes(ram)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ram}GB {filters.ram.includes(ram) && <Check size={18} />}
                </button>
              ))}
            </div>
          )}

          {/* Storage Tab */}
          {activeTab === 'storage' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {storageOptions.map(storage => (
                <button
                  key={storage}
                  onClick={() => handleMultiSelect('storage', storage)}
                  className={`p-3 rounded-lg font-semibold transition flex items-center justify-between ${
                    filters.storage.includes(storage)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {storage}GB {filters.storage.includes(storage) && <Check size={18} />}
                </button>
              ))}
            </div>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <div className="space-y-2">
              {displayOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleMultiSelect('display', option.value)}
                  className={`w-full p-3 rounded-lg font-medium text-left transition flex items-center justify-between ${
                    filters.display.includes(option.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label} {filters.display.includes(option.value) && <Check size={18} />}
                </button>
              ))}
            </div>
          )}

          {/* Refresh Rate Tab */}
          {activeTab === 'refreshRate' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {refreshRateOptions.map(rate => (
                <button
                  key={rate}
                  onClick={() => handleMultiSelect('refreshRate', rate)}
                  className={`p-3 rounded-lg font-semibold transition flex items-center justify-between ${
                    filters.refreshRate.includes(rate)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rate}Hz {filters.refreshRate.includes(rate) && <Check size={18} />}
                </button>
              ))}
            </div>
          )}

          {/* Battery Tab */}
          {activeTab === 'battery' && (
            <div className="space-y-2">
              {batteryOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleMultiSelect('battery', option.value)}
                  className={`w-full p-3 rounded-lg font-medium text-left transition flex items-center justify-between ${
                    filters.battery.includes(option.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label} {filters.battery.includes(option.value) && <Check size={18} />}
                </button>
              ))}
            </div>
          )}

          {/* Processor Tab */}
          {activeTab === 'processor' && (
            <div className="space-y-2">
              {processorOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleMultiSelect('processor', option.value)}
                  className={`w-full p-3 rounded-lg font-medium text-left transition flex items-center justify-between ${
                    filters.processor.includes(option.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label} {filters.processor.includes(option.value) && <Check size={18} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Reset
          </button>
          <button
            onClick={() => setExpanded(false)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdvancedFilters
