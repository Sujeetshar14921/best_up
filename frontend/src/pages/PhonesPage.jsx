import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePhones } from '../context/PhoneContext'
import PhoneCard from '../components/PhoneCard'
import FilterBar from '../components/FilterBar'
import LoadingError from '../components/LoadingError'
import AdvancedFilters from '../components/AdvancedFilters'
import SortSelector from '../components/SortSelector'
import Pagination from '../components/Pagination'

export default function PhonesPage() {
  const { phones, loading, error, fetchPhones } = usePhones()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    priceMin: searchParams.get('minPrice') || '',
    priceMax: searchParams.get('maxPrice') || '',
    ram: '',
    sort: 'name'
  })
  const [advancedFilters, setAdvancedFilters] = useState({
    priceMin: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : 0,
    priceMax: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : 150000,
    ram: [],
    storage: [],
    display: [],
    refreshRate: [],
    battery: [],
    processor: []
  })
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [totalPages, setTotalPages] = useState(1)
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
    setCurrentPage(1)
  }

  const handleAdvancedFilterChange = (newFilters) => {
    setAdvancedFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Apply sorting to phones
  const getSortedPhones = () => {
    if (!phones || phones.length === 0) return []
    
    let sorted = [...phones]
    switch (sortBy) {
      case 'price-low-high':
        sorted.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0))
        break
      case 'price-high-low':
        sorted.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0))
        break
      case 'rating-high':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'rating-low':
        sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0))
        break
      case 'newest':
        sorted.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0))
        break
      case 'popularity':
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'performance':
        sorted.sort((a, b) => (b.scores?.performance || 0) - (a.scores?.performance || 0))
        break
      default: // relevance
        // Keep original order
        break
    }
    return sorted
  }

  // Apply pagination
  const sortedPhones = getSortedPhones()
  const paginatedPhones = sortedPhones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setTotalPages(Math.ceil(sortedPhones.length / itemsPerPage))
  }, [sortedPhones.length, itemsPerPage])

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

        {/* Advanced Filters & Sort */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="hidden md:block flex-1">
            <AdvancedFilters 
              onFilterChange={handleAdvancedFilterChange}
              initialFilters={advancedFilters}
            />
          </div>
          <div className="md:hidden w-full">
            <AdvancedFilters 
              onFilterChange={handleAdvancedFilterChange}
              initialFilters={advancedFilters}
            />
          </div>
          <div className="w-full md:w-64">
            <SortSelector 
              onSortChange={handleSortChange}
              currentSort={sortBy}
            />
          </div>
        </div>

        {/* Results */}
        <LoadingError loading={loading} error={error}>
          <div>
            {/* Results Count */}
            <div className="mb-6 text-gray-600">
              <p className="font-semibold">
                {phones.length} {phones.length === 1 ? 'phone' : 'phones'} found
                {paginatedPhones.length > 0 && ` (Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, sortedPhones.length)} of ${sortedPhones.length})`}
              </p>
            </div>

            {/* Grid */}
            {sortedPhones.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600 text-lg mb-4">No phones match your criteria</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                  {paginatedPhones.map((phone) => (
                    <div key={phone._id} className="flex-shrink-0 w-48">
                      <PhoneCard phone={phone} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      itemsPerPage={itemsPerPage}
                      totalItems={sortedPhones.length}
                      loading={loading}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </LoadingError>
      </div>
    </div>
  )
}
