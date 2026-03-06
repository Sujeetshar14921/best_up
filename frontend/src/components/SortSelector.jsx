import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, TrendingDown, TrendingUp, Zap } from 'lucide-react'

const SortSelector = ({ onSortChange, currentSort = 'relevance' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const sortOptions = [
    {
      id: 'relevance',
      label: 'Most Relevant',
      description: 'Best matches for your search',
      icon: Zap
    },
    {
      id: 'price-low-high',
      label: 'Price: Low to High',
      description: 'Cheapest first',
      icon: TrendingUp
    },
    {
      id: 'price-high-low',
      label: 'Price: High to Low',
      description: 'Most expensive first',
      icon: TrendingDown
    },
    {
      id: 'rating-high',
      label: 'Highest Rated',
      description: 'Best customer reviews',
      icon: TrendingUp
    },
    {
      id: 'rating-low',
      label: 'Lowest Rated',
      description: 'Least reviewed',
      icon: TrendingDown
    },
    {
      id: 'newest',
      label: 'Newest',
      description: 'Latest models first',
      icon: Zap
    },
    {
      id: 'popularity',
      label: 'Most Popular',
      description: 'Trending right now',
      icon: TrendingUp
    },
    {
      id: 'performance',
      label: 'Best Performance',
      description: 'Fastest processors',
      icon: Zap
    }
  ]

  const selectedOption = sortOptions.find(opt => opt.id === currentSort)
  const SelectedIcon = selectedOption?.icon || Zap

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionId) => {
    onSortChange(optionId)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 hover:shadow-md transition font-medium text-gray-700 w-full md:w-auto justify-between md:justify-between"
      >
        <div className="flex items-center gap-2">
          <SelectedIcon size={18} className="text-blue-600" />
          <span>{selectedOption?.label}</span>
        </div>
        <ChevronDown
          size={18}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 md:right-auto md:left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By</p>
          </div>

          {/* Options */}
          <div className="max-h-96 overflow-y-auto">
            {sortOptions.map(option => {
              const Icon = option.icon
              const isSelected = option.id === currentSort

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition ${
                    isSelected
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <Icon
                    size={20}
                    className={isSelected ? 'text-blue-600' : 'text-gray-400'}
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer Info */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            Currently sorting by: <span className="font-semibold text-gray-700">{selectedOption?.label}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SortSelector
