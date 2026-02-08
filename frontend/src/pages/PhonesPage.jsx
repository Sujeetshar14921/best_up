import React, { useEffect, useState } from 'react'
import { usePhones } from '../context/PhoneContext'
import PhoneCard from '../components/PhoneCard'
import FilterBar from '../components/FilterBar'
import LoadingError from '../components/LoadingError'

export default function PhonesPage() {
  const { phones, loading, error, fetchPhones } = usePhones()
  const [filters, setFilters] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const finalFilters = {
      ...filters,
      ...(searchTerm && { search: searchTerm })
    }
    fetchPhones(finalFilters)
  }, [filters, searchTerm])

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
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Explore All Phones
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Browse our complete catalog of smartphones from all major brands. Filter, search, and find your perfect match.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterBar onFilterChange={handleFilterChange} onSearch={handleSearch} />
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
