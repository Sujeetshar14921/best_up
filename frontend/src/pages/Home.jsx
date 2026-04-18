import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePhones } from '../context/PhoneContext'
import BannerDisplay, { HorizontalBannersSection } from '../components/BannerDisplay'
import {
  BrandsSection,
  ExplorePhonesSection,
  UpcomingPhonesSection,
  LatestPhonesSection,
  CTASection,
  TrendingPhones,
  TopRatedByCategory,
  PriceSegmentAnalysis
} from '../components/Home'

export default function Home() {
  const { phones, loading, error, fetchPhones } = usePhones()
  const [searchParams] = useSearchParams()
  const [exploreFilters, setExploreFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    minRam: '',
    sort: '-createdAt'
  })

  const searchQuery = (searchParams.get('search') || '').trim()
  const brandQuery = (searchParams.get('brand') || '').trim()

  useEffect(() => {
    const effectiveBrand = brandQuery || exploreFilters.brand
    const filters = {
      limit: 100,
      ...(effectiveBrand ? { brand: effectiveBrand } : {}),
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(exploreFilters.minPrice ? { 'price[gte]': exploreFilters.minPrice } : {}),
      ...(exploreFilters.maxPrice ? { 'price[lte]': exploreFilters.maxPrice } : {}),
      ...(exploreFilters.minRam ? { 'ram[gte]': exploreFilters.minRam } : {}),
      ...(exploreFilters.sort ? { sort: exploreFilters.sort } : {})
    }
    fetchPhones(filters)
  }, [fetchPhones, searchQuery, brandQuery, exploreFilters])

  const handleFilterChange = (filters) => {
    setExploreFilters(filters)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Vertical Banners displayed at top */}
      <BannerDisplay />

      {/* Brands Section */}
      <BrandsSection />

      {/* Explore Phones Section */}
      <ExplorePhonesSection 
        phones={phones} 
        loading={loading} 
        error={error}
        onFilterChange={handleFilterChange}
      />

      {/* Upcoming Phones Section */}
      <UpcomingPhonesSection />

      {/* Horizontal Banners Section - Middle of Page */}
      <HorizontalBannersSection />

      {/* Latest Phones Section */}
      <LatestPhonesSection 
        phones={phones} 
        loading={loading} 
        error={error}
      />

      {/* Trending Phones Section */}
      <TrendingPhones />

      {/* Top Rated by Category Section */}
      <TopRatedByCategory />

      {/* Price Segment Analysis Section */}
      <PriceSegmentAnalysis />

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
