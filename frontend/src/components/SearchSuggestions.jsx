import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Zap, Smartphone } from 'lucide-react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function SearchSuggestions({ onNavigate }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim().length >= 2) {
        fetchSuggestions()
      } else {
        setSuggestions(null)
      }
    }, 300) // Debounce

    return () => clearTimeout(timer)
  }, [searchInput])

  const fetchSuggestions = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API}/analytics/suggestions`, {
        params: { q: searchInput }
      })
      setSuggestions(response.data.data)
    } catch (err) {
      console.error('Error fetching suggestions:', err)
    } finally {
      setLoading(false)
    }
  }

  const goTo = (path) => {
    if (onNavigate) {
      onNavigate(path)
      return
    }
    navigate(path)
  }

  const buildSearchPath = (query) => {
    const trimmed = (query || '').trim()
    if (!trimmed) return null

    if (location.pathname === '/compare') {
      return `/compare?search=${encodeURIComponent(trimmed)}`
    }

    return `/?search=${encodeURIComponent(trimmed)}#explore-phones`
  }

  const handleSelectPhone = (phoneName) => {
    setSearchInput('')
    setSuggestions(null)
    setShowSuggestions(false)
    const path = buildSearchPath(phoneName)
    if (path) goTo(path)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      const path = buildSearchPath(searchInput)
      setSearchInput('')
      setSuggestions(null)
      setShowSuggestions(false)
      if (path) goTo(path)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for phones..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full px-4 py-3 pl-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-yellow-500 transition-all"
        />
        <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions && (suggestions.phones?.length > 0 || suggestions.brands?.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 overflow-hidden">
            {/* Phones */}
            {suggestions.phones && suggestions.phones.length > 0 && (
              <div className="border-b border-gray-200">
                <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-700">
                  📱 Phones
                </div>
                {suggestions.phones.map(phone => (
                  <button
                    key={phone._id}
                    type="button"
                    onClick={() => handleSelectPhone(phone.name)}
                    className="w-full text-left px-4 py-2 hover:bg-yellow-50 transition-colors flex items-center gap-3"
                  >
                    <Smartphone size={18} className="text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{phone.name}</p>
                      <p className="text-xs text-gray-500">{phone.brand}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Brands */}
            {suggestions.brands && suggestions.brands.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 font-semibold text-sm text-gray-700">
                  🏷️ Brands
                </div>
                {suggestions.brands.map(brand => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => {
                      setSearchInput('')
                      setSuggestions(null)
                      setShowSuggestions(false)
                      const path = buildSearchPath(brand)
                      if (path) goTo(path)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-yellow-50 transition-colors text-sm text-gray-700 hover:text-yellow-600"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && searchInput.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 p-4 text-center">
            <p className="text-gray-500 text-sm">Searching...</p>
          </div>
        )}
      </div>
    </form>
  )
}
