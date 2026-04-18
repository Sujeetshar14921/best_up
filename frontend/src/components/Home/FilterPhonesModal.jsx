import React, { useState, useEffect } from 'react'
import { X, Trash2, Check, Save } from 'lucide-react'

export default function FilterPhonesModal({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onClear, 
  brands = [] 
}) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [appliedCount, setAppliedCount] = useState(0)
  const [savedPresets, setSavedPresets] = useState([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [presetName, setPresetName] = useState('')

  // Load saved presets on mount
  useEffect(() => {
    const saved = localStorage.getItem('filterPresets')
    if (saved) {
      try {
        setSavedPresets(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load presets:', e)
      }
    }
  }, [])

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
    updateAppliedCount(filters)
  }, [filters])

  const updateAppliedCount = (f) => {
    let count = 0
    if (f.brand) count++
    if (f.minPrice) count++
    if (f.maxPrice) count++
    if (f.minRam) count++
    if (f.minStorage) count++
    if (f.minDisplaySize) count++
    if (f.minRating) count++
    if (f.minCamera) count++
    if (f.minBattery) count++
    if (f.processor) count++
    if (f.sort !== '-createdAt') count++
    setAppliedCount(count)
  }

  const handleLocalFilterChange = (key, value) => {
    const updated = { ...localFilters, [key]: value }
    setLocalFilters(updated)
    updateAppliedCount(updated)
  }

  const handleClearOne = (key) => {
    const updated = { ...localFilters }
    if (key === 'brand') updated.brand = ''
    if (key === 'minPrice') updated.minPrice = ''
    if (key === 'maxPrice') updated.maxPrice = ''
    if (key === 'minRam') updated.minRam = ''
    if (key === 'minStorage') updated.minStorage = ''
    if (key === 'minDisplaySize') updated.minDisplaySize = ''
    if (key === 'minRating') updated.minRating = ''
    if (key === 'minCamera') updated.minCamera = ''
    if (key === 'minBattery') updated.minBattery = ''
    if (key === 'processor') updated.processor = ''
    if (key === 'sort') updated.sort = '-createdAt'
    setLocalFilters(updated)
    updateAppliedCount(updated)
  }

  const handleApply = () => {
    onFilterChange('brand', localFilters.brand)
    onFilterChange('minPrice', localFilters.minPrice)
    onFilterChange('maxPrice', localFilters.maxPrice)
    onFilterChange('minRam', localFilters.minRam)
    onFilterChange('minStorage', localFilters.minStorage)
    onFilterChange('minDisplaySize', localFilters.minDisplaySize)
    onFilterChange('minRating', localFilters.minRating)
    onFilterChange('minCamera', localFilters.minCamera)
    onFilterChange('minBattery', localFilters.minBattery)
    onFilterChange('processor', localFilters.processor)
    onFilterChange('sort', localFilters.sort)
    onClose()
  }

  const handleResetAll = () => {
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
    setLocalFilters(clearedFilters)
    onClear()
    updateAppliedCount(clearedFilters)
  }

  const savePreset = () => {
    if (!presetName.trim()) return
    const newPreset = { name: presetName, filters: localFilters, id: Date.now() }
    const updated = [...savedPresets, newPreset]
    setSavedPresets(updated)
    localStorage.setItem('filterPresets', JSON.stringify(updated))
    setPresetName('')
    setShowSaveDialog(false)
  }

  const loadPreset = (preset) => {
    setLocalFilters(preset.filters)
    updateAppliedCount(preset.filters)
  }

  const deletePreset = (id) => {
    const updated = savedPresets.filter(p => p.id !== id)
    setSavedPresets(updated)
    localStorage.setItem('filterPresets', JSON.stringify(updated))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end md:items-center justify-center p-2 sm:p-3 transition-all duration-300">
      <div className="w-full h-[95vh] md:h-auto md:max-w-2xl bg-white/80 backdrop-blur-xl rounded-t-3xl md:rounded-3xl shadow-2xl md:max-h-[90vh] overflow-hidden border border-white/20 flex flex-col" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 bg-white/80 backdrop-blur-xl flex-shrink-0">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">Filter Phones</h3>
            {appliedCount > 0 && (
              <p className="text-xs text-gray-500 mt-1">{appliedCount} filter{appliedCount !== 1 ? 's' : ''} applied</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110 flex-shrink-0"
          >
            <X size={20} className="sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        {/* Filter Tags */}
        {appliedCount > 0 && (
          <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100 flex flex-wrap gap-1 sm:gap-2 flex-shrink-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {localFilters.brand && (
              <div className="flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-yellow-200">
                <span>{localFilters.brand}</span>
                <button onClick={() => handleClearOne('brand')} className="hover:text-red-500 flex-shrink-0"><X size={12} className="sm:w-4 sm:h-4" /></button>
              </div>
            )}
            {(localFilters.minPrice || localFilters.maxPrice) && (
              <div className="flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-yellow-200">
                <span>₹{localFilters.minPrice || '0'} - ₹{localFilters.maxPrice || '∞'}</span>
                <button onClick={() => { handleClearOne('minPrice'); handleClearOne('maxPrice'); }} className="hover:text-red-500 flex-shrink-0"><X size={12} className="sm:w-4 sm:h-4" /></button>
              </div>
            )}
            {localFilters.minRam && (
              <div className="flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-yellow-200">
                <span>{localFilters.minRam}GB+ RAM</span>
                <button onClick={() => handleClearOne('minRam')} className="hover:text-red-500 flex-shrink-0"><X size={12} className="sm:w-4 sm:h-4" /></button>
              </div>
            )}
            {localFilters.minStorage && (
              <div className="flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-yellow-200">
                <span>{localFilters.minStorage}GB Storage</span>
                <button onClick={() => handleClearOne('minStorage')} className="hover:text-red-500 flex-shrink-0"><X size={12} className="sm:w-4 sm:h-4" /></button>
              </div>
            )}
            {localFilters.minDisplaySize && (
              <div className="flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-yellow-200">
                <span>{localFilters.minDisplaySize}" Display</span>
                <button onClick={() => handleClearOne('minDisplaySize')} className="hover:text-red-500 flex-shrink-0"><X size={12} className="sm:w-4 sm:h-4" /></button>
              </div>
            )}
            {localFilters.minRating && (
              <div className="flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-yellow-200">
                <span>{localFilters.minRating}+ Rating</span>
                <button onClick={() => handleClearOne('minRating')} className="hover:text-red-500 flex-shrink-0"><X size={12} className="sm:w-4 sm:h-4" /></button>
              </div>
            )}
            {localFilters.minCamera && (
              <div className="flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-yellow-200">
                <span>{localFilters.minCamera}MP Camera</span>
                <button onClick={() => handleClearOne('minCamera')} className="hover:text-red-500 flex-shrink-0"><X size={12} className="sm:w-4 sm:h-4" /></button>
              </div>
            )}
            {localFilters.minBattery && (
              <div className="flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-yellow-200">
                <span>{localFilters.minBattery}mAh Battery</span>
                <button onClick={() => handleClearOne('minBattery')} className="hover:text-red-500 flex-shrink-0"><X size={12} className="sm:w-4 sm:h-4" /></button>
              </div>
            )}
            {localFilters.processor && (
              <div className="flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-yellow-200">
                <span>{localFilters.processor}</span>
                <button onClick={() => handleClearOne('processor')} className="hover:text-red-500 flex-shrink-0"><X size={12} className="sm:w-4 sm:h-4" /></button>
              </div>
            )}
          </div>
        )}

        {/* Filters Grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* Brand */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Brand</label>
            <select
              value={localFilters.brand}
              onChange={(e) => handleLocalFilterChange('brand', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white text-sm sm:text-base"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b._id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Min Price (₹)</label>
            <input
              type="number"
              value={localFilters.minPrice}
              onChange={(e) => handleLocalFilterChange('minPrice', e.target.value)}
              placeholder="Min"
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Max Price (₹)</label>
            <input
              type="number"
              value={localFilters.maxPrice}
              onChange={(e) => handleLocalFilterChange('maxPrice', e.target.value)}
              placeholder="Max"
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          {/* RAM */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">RAM</label>
            <select
              value={localFilters.minRam}
              onChange={(e) => handleLocalFilterChange('minRam', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white text-sm sm:text-base"
            >
              <option value="">Any</option>
              <option value="4">4GB+</option>
              <option value="6">6GB+</option>
              <option value="8">8GB+</option>
              <option value="12">12GB+</option>
              <option value="16">16GB+</option>
            </select>
          </div>

          {/* Storage */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Storage</label>
            <select
              value={localFilters.minStorage}
              onChange={(e) => handleLocalFilterChange('minStorage', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white text-sm sm:text-base"
            >
              <option value="">Any</option>
              <option value="64">64GB+</option>
              <option value="128">128GB+</option>
              <option value="256">256GB+</option>
              <option value="512">512GB+</option>
            </select>
          </div>

          {/* Display Size */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Display Size</label>
            <select
              value={localFilters.minDisplaySize}
              onChange={(e) => handleLocalFilterChange('minDisplaySize', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white text-sm sm:text-base"
            >
              <option value="">Any</option>
              <option value="6.0">6.0"</option>
              <option value="6.5">6.5"</option>
              <option value="6.7">6.7"</option>
              <option value="7.0">7.0"+</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Rating</label>
            <select
              value={localFilters.minRating}
              onChange={(e) => handleLocalFilterChange('minRating', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white text-sm sm:text-base"
            >
              <option value="">Any</option>
              <option value="3">3.0+ ⭐</option>
              <option value="3.5">3.5+ ⭐</option>
              <option value="4">4.0+ ⭐</option>
              <option value="4.5">4.5+ ⭐</option>
            </select>
          </div>

          {/* Camera */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">MP</label>
            <select
              value={localFilters.minCamera}
              onChange={(e) => handleLocalFilterChange('minCamera', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white text-sm sm:text-base"
            >
              <option value="">Any</option>
              <option value="12">12MP+</option>
              <option value="50">50MP+</option>
              <option value="64">64MP+</option>
              <option value="108">108MP+</option>
            </select>
          </div>

          {/* Battery */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Battery Capacity</label>
            <select
              value={localFilters.minBattery}
              onChange={(e) => handleLocalFilterChange('minBattery', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white text-sm sm:text-base"
            >
              <option value="">Any</option>
              <option value="4000">4000mAh+</option>
              <option value="4500">4500mAh+</option>
              <option value="5000">5000mAh+</option>
              <option value="6000">6000mAh+</option>
            </select>
          </div>

          {/* Processor */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Processor</label>
            <select
              value={localFilters.processor}
              onChange={(e) => handleLocalFilterChange('processor', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white text-sm sm:text-base"
            >
              <option value="">Any</option>
              <option value="Snapdragon 8 Gen 3">Snapdragon 8 Gen 3</option>
              <option value="Snapdragon 8 Gen 2">Snapdragon 8 Gen 2</option>
              <option value="Apple A17 Pro">Apple A17 Pro</option>
              <option value="MediaTek Dimensity">MediaTek Dimensity</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">Sort By</label>
            <select
              value={localFilters.sort}
              onChange={(e) => handleLocalFilterChange('sort', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white text-sm sm:text-base"
            >
              <option value="-createdAt">Newest</option>
              <option value="basePrice">Price: Low to High</option>
              <option value="-basePrice">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Saved Presets */}
        {savedPresets.length > 0 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2">Saved Presets</p>
            <div className="flex flex-wrap gap-2">
              {savedPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(preset)}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-white border border-blue-200 rounded-full text-xs sm:text-sm hover:bg-blue-50 transition-all duration-200"
                >
                  <span>{preset.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deletePreset(preset.id); }}
                    className="ml-1 hover:text-red-500"
                  >
                    <X size={12} className="sm:w-4 sm:h-4" />
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 flex gap-2 sm:gap-3 bg-white/80 backdrop-blur-xl flex-shrink-0 flex-wrap justify-stretch">
          <button
            onClick={handleResetAll}
            className="flex-1 min-w-[80px] sm:min-w-[100px] px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <Trash2 size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Reset All</span>
            <span className="sm:hidden">Reset</span>
          </button>
          
          <button
            onClick={() => setShowSaveDialog(!showSaveDialog)}
            className="flex-1 min-w-[80px] sm:min-w-[100px] px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <Save size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Save Preset</span>
            <span className="sm:hidden">Save</span>
          </button>

          <button
            onClick={handleApply}
            className="flex-1 min-w-[80px] sm:min-w-[100px] px-3 sm:px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 transform hover:scale-105 text-sm sm:text-base"
          >
            <Check size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Apply Filters</span>
            <span className="sm:hidden">Apply</span>
          </button>
        </div>

        {/* Save Preset Dialog */}
        {showSaveDialog && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 bg-gradient-to-r from-yellow-50 to-orange-50 flex gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
            <input
              type="text"
              placeholder="Preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && savePreset()}
              className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 border border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-500 text-sm sm:text-base"
              autoFocus
            />
            <button
              onClick={savePreset}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold transition-all duration-200 text-sm sm:text-base"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
