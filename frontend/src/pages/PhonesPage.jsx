import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePhones } from '../context/PhoneContext'
import PhoneCard from '../components/PhoneCard'
import FilterBar from '../components/FilterBar'
import LoadingError from '../components/LoadingError'

export default function PhonesPage() {
  const { phones, loading, error, fetchPhones } = usePhones()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    priceMin: '',
    priceMax: '',
    ram: '',
    sort: 'name'
  })
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const searchTimeoutRef = useRef(null)
  const urlSearchRef = useRef(searchParams.get('search') || '')

  // Update filters and search when URL params change
  useEffect(() => {
    const brandParam = searchParams.get('brand') || ''
    const searchParam = searchParams.get('search') || ''
    
    setFilters(prev => ({
      ...prev,
      brand: brandParam
    }))
    setSearchTerm(searchParam)
    urlSearchRef.current = searchParam
  }, [searchParams])

  // Fetch phones whenever filters or search changes
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // If search term came from URL params, fetch immediately
    // Otherwise apply debounce to user input
    const isFromUrl = searchTerm === urlSearchRef.current
    const delay = isFromUrl ? 0 : 500

    searchTimeoutRef.current = setTimeout(() => {
      const finalFilters = {
        ...filters,
        ...(searchTerm && { search: searchTerm }),
        limit: 100
      }
      // Remove empty filters
      Object.keys(finalFilters).forEach(key => {
        if (!finalFilters[key] && finalFilters[key] !== 0) delete finalFilters[key]
      })
      console.log('📤 Fetching phones with filters:', finalFilters)
      fetchPhones(finalFilters)
    }, delay)

    // Cleanup on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [filters, searchTerm, fetchPhones])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent mb-4">
            Explore All Phones
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Browse our complete catalog of smartphones from all major brands. Filter, search, and find your perfect match.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterBar 
            initialFilters={filters} 
            initialSearch={searchTerm}
            onFilterChange={handleFilterChange} 
            onSearch={handleSearch} 
          />
        </div>

        {/* Results */}
        <LoadingError loading={loading} error={error}>
          <div>
            {/* Results Count */}
            <div className="mb-6 text-gray-600">
              <p className="font-semibold">
                {phones.length} {phones.length === 1 ? 'phone' : 'phones'} found
              </p>
            </div>

            {/* Grid */}
            {phones.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600 text-lg mb-4">No phones match your criteria</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6">
                {phones.map((phone) => (
                  <div key={phone._id} className="flex-shrink-0 w-48">
                    <PhoneCard phone={phone} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </LoadingError>
      </div>
    </div>
  )
}
