import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Smartphone, TrendingUp, Star, Sparkles, Clock, Heart, Cpu, SlidersHorizontal, X } from 'lucide-react'
import { usePhones } from '../context/PhoneContext'
import PhoneCard from '../components/PhoneCard'
import LoadingError from '../components/LoadingError'
import BannerDisplay, { HorizontalBannersSection } from '../components/BannerDisplay'
import TrendingPhones from '../components/TrendingPhones'
import TopRatedByCategory from '../components/TopRatedByCategory'
import PriceSegmentAnalysis from '../components/PriceSegmentAnalysis'
import SearchSuggestions from '../components/SearchSuggestions'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_ROOT = API.replace(/\/api\/?$/, '')

export default function Home() {
  const { phones, loading, error, fetchPhones } = usePhones()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const scrollContainerRef = useRef(null)
  const brandScrollRef = useRef(null)
  const upcomingScrollRef = useRef(null)
  const [brands, setBrands] = useState([])
  const [upcomingPhones, setUpcomingPhones] = useState([])
  const [showAllBrands, setShowAllBrands] = useState(false)
  const [showExploreFilters, setShowExploreFilters] = useState(false)
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
    fetchBrands()
    fetchUpcomingPhones()
  }, [])

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

  useEffect(() => {
    if (window.location.hash === '#explore-phones' || searchQuery || brandQuery) {
      const timer = setTimeout(() => {
        const section = document.getElementById('explore-phones')
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [searchQuery, brandQuery])

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API}/brands`)
      setBrands(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch brands:', err)
    }
  }

  const fetchUpcomingPhones = async () => {
    try {
      const response = await axios.get(`${API}/phones?isUpcoming=true&limit=10`)
      setUpcomingPhones(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch upcoming phones:', err)
    }
  }

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const getFeaturedPhones = () => (phones || []).filter(p => p && !p.isUpcoming && p.scores?.valueForMoney >= 8).slice(0, 10)
  const getPopularPhones = () => (phones || []).filter(p => p && !p.isUpcoming && p.scores?.gaming >= 8).slice(0, 10)
  const getLatestPhones = () => (phones || []).filter(p => p && !p.isUpcoming).slice(0, 10)
  const getExplorePhones = () => (phones || []).filter(p => p && !p.isUpcoming)

  const handleExploreFilterChange = (key, value) => {
    setExploreFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearExploreFilters = () => {
    setExploreFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      minRam: '',
      sort: '-createdAt'
    })
  }

  const explorePhones = getExplorePhones()
  const exactMatchPhones = searchQuery
    ? explorePhones.filter((p) => (p.name || '').trim().toLowerCase() === searchQuery.toLowerCase())
    : []
  const displayExplorePhones = exactMatchPhones.length > 0 ? exactMatchPhones : explorePhones

  return (
    <div className="min-h-screen bg-white">
      {/* Vertical Banners displayed at top */}
      <BannerDisplay />

      {/* Brands Section - Top */}
      {brands && brands.length > 0 && (
        <section className="py-20 px-4 bg-white overflow-hidden border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Featured Mobile Brands</h2>
              <button
                type="button"
                onClick={() => setShowAllBrands((prev) => !prev)}
                className="text-lg font-semibold text-yellow-600 hover:text-orange-600 flex items-center gap-2 transition-colors"
              >
                {showAllBrands ? 'Show Less' : 'View All'}
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Brands Carousel with Scroll Buttons */}
            <div className="relative overflow-visible">
              {showAllBrands ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 py-4">
                  {brands.map((brand) => (
                    <div
                      key={brand._id}
                      onClick={() => navigate(`/?brand=${encodeURIComponent(brand.name)}#explore-phones`)}
                      className="group cursor-pointer text-center"
                    >
                      <div className="w-40 h-40 mx-auto bg-gray-50 rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all duration-300 flex items-center justify-center group-hover:scale-105 hover:-translate-y-1 mb-4">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-28 h-28 object-contain group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22112%22 height=%22112%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22112%22 height=%22112%22/%3E%3C/svg%3E'
                          }}
                        />
                      </div>
                      <p className="text-gray-700 font-semibold text-base group-hover:text-yellow-600 transition-colors line-clamp-1">{brand.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div
                    ref={brandScrollRef}
                    className="flex gap-6 overflow-x-auto scroll-smooth py-8 px-2 scrollbar-hide"
                  >
                    {brands.map((brand) => (
                      <div
                        key={brand._id}
                        onClick={() => navigate(`/?brand=${encodeURIComponent(brand.name)}#explore-phones`)}
                        className="flex-shrink-0 group cursor-pointer text-center"
                      >
                        <div className="w-40 h-40 bg-gray-50 rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-400 transition-all duration-300 flex items-center justify-center group-hover:scale-105 hover:-translate-y-1 mb-4">
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-28 h-28 object-contain group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22112%22 height=%22112%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22112%22 height=%22112%22/%3E%3C/svg%3E'
                            }}
                          />
                        </div>
                        <p className="text-gray-700 font-semibold text-base group-hover:text-yellow-600 transition-colors line-clamp-1">{brand.name}</p>
                      </div>
                    ))}
                  </div>

                  {/* Scroll Buttons */}
                  <button
                    onClick={() => scroll(brandScrollRef, 'left')}
                    className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-16 bg-transparent text-gray-400 p-2 rounded-full transition-all hover:scale-110 z-10 hover:text-gray-700"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => scroll(brandScrollRef, 'right')}
                    className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-16 bg-transparent text-gray-400 p-2 rounded-full transition-all hover:scale-110 z-10 hover:text-gray-700"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Explore Phones Section (moved from Explore page intent) */}
      <section id="explore-phones" className="py-16 px-4 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Explore Phones</h2>
            <p className="text-gray-600 text-lg">
              {brandQuery
                ? `Showing ${brandQuery} phones`
                : searchQuery
                ? `Search results for "${searchQuery}"`
                : 'Use the navbar search to find and explore phones here'}
            </p>
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setShowExploreFilters(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
              >
                <SlidersHorizontal size={18} />
                Filter Results
              </button>
            </div>
          </div>

          <LoadingError loading={loading} error={error}>
            {displayExplorePhones.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-700 text-lg mb-2">No phones found</p>
                <p className="text-gray-500 text-sm">Try a different phone name or brand in the top search bar.</p>
              </div>
            ) : (
              <div className="flex flex-nowrap overflow-x-auto gap-6 py-2 scrollbar-hide">
                {displayExplorePhones.slice(0, 24).map((phone) => (
                  <div key={phone._id} className="flex-shrink-0 w-56">
                    <PhoneCard phone={phone} />
                  </div>
                ))}
              </div>
            )}
          </LoadingError>
        </div>

        {showExploreFilters && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Filter Explore Phones</h3>
                <button
                  type="button"
                  onClick={() => setShowExploreFilters(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                  <select
                    value={exploreFilters.brand}
                    onChange={(e) => handleExploreFilterChange('brand', e.target.value)}
                    disabled={Boolean(brandQuery)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">All Brands</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  {brandQuery && (
                    <p className="mt-1 text-xs text-gray-500">Brand is locked from selected logo: {brandQuery}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price (INR)</label>
                  <input
                    type="number"
                    min="0"
                    value={exploreFilters.minPrice}
                    onChange={(e) => handleExploreFilterChange('minPrice', e.target.value)}
                    placeholder="10000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price (INR)</label>
                  <input
                    type="number"
                    min="0"
                    value={exploreFilters.maxPrice}
                    onChange={(e) => handleExploreFilterChange('maxPrice', e.target.value)}
                    placeholder="50000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum RAM</label>
                  <select
                    value={exploreFilters.minRam}
                    onChange={(e) => handleExploreFilterChange('minRam', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Any</option>
                    <option value="4">4GB</option>
                    <option value="6">6GB</option>
                    <option value="8">8GB</option>
                    <option value="12">12GB</option>
                    <option value="16">16GB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort</label>
                  <select
                    value={exploreFilters.sort}
                    onChange={(e) => handleExploreFilterChange('sort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500"
                  >
                    <option value="-createdAt">Newest</option>
                    <option value="basePrice">Price: Low to High</option>
                    <option value="-basePrice">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={clearExploreFilters}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowExploreFilters(false)}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Phones Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Best Value Phones</h2>
            <p className="text-gray-600 text-lg">Top-rated phones that offer exceptional value</p>
          </div>

          <LoadingError loading={loading} error={error}>
            <div className="relative overflow-visible">
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scroll-smooth py-10 px-2 scrollbar-hide"
              >
                {getFeaturedPhones().map((phone) => (
                  <div key={phone._id} className="flex-shrink-0 w-56 my-2">
                    <PhoneCard phone={phone} />
                  </div>
                ))}
              </div>

              {/* Scroll Buttons */}
              <button
                onClick={() => scroll(scrollContainerRef, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-transparent text-gray-400 p-2 rounded-full transition-all hover:scale-110 hover:text-gray-700"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll(scrollContainerRef, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-transparent text-gray-400 p-2 rounded-full transition-all hover:scale-110 hover:text-gray-700"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </LoadingError>
        </div>
      </section>

      {/* Upcoming Phones Section */}
      {upcomingPhones && upcomingPhones.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-2 justify-center">
                  <Sparkles size={18} />
                  Coming Soon
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Upcoming Launches</h2>
              <p className="text-gray-600 text-lg">Exciting new phones on the horizon</p>
            </div>

            <div className="relative overflow-visible">
              <div
                ref={upcomingScrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth py-10 px-2 scrollbar-hide"
              >
                {upcomingPhones.map((phone) => (
                  <div key={phone._id} className="flex-shrink-0 w-56 my-2">
                    <UpcomingPhoneCard phone={phone} />
                  </div>
                ))}
              </div>

              {/* Scroll Buttons */}
              <button
                onClick={() => scroll(upcomingScrollRef, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-transparent text-gray-400 p-2 rounded-full transition-all hover:scale-110 hover:text-gray-700"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll(upcomingScrollRef, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-transparent text-gray-400 p-2 rounded-full transition-all hover:scale-110 hover:text-gray-700"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Popular Gaming Phones Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
              Gaming Powerhouses
            </h2>
            <p className="text-gray-600 text-lg">Ultimate gaming and performance smartphones</p>
          </div>

          <LoadingError loading={loading} error={error}>
            <div className="relative overflow-visible">
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scroll-smooth py-10 px-2 scrollbar-hide"
              >
                {getPopularPhones().map((phone) => (
                  <div key={phone._id} className="flex-shrink-0 w-56 my-2">
                    <PhoneCard phone={phone} />
                  </div>
                ))}
              </div>

              {/* Scroll Buttons */}
              <button
                onClick={() => scroll(scrollContainerRef, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-transparent text-gray-400 p-2 rounded-full transition-all hover:scale-110 hover:text-gray-700"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll(scrollContainerRef, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-transparent text-gray-400 p-2 rounded-full transition-all hover:scale-110 hover:text-gray-700"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </LoadingError>
        </div>
      </section>

      {/* Horizontal Banners Section - Middle of Page */}
      <HorizontalBannersSection />

      {/* Latest Phones Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Latest Smartphones</h2>
            <p className="text-gray-600 text-lg">Fresh releases from the market</p>
          </div>

          <LoadingError loading={loading} error={error}>
            <div className="relative overflow-visible">
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scroll-smooth py-10 px-2 scrollbar-hide"
              >
                {getLatestPhones().map((phone) => (
                  <div key={phone._id} className="flex-shrink-0 w-56 my-2">
                    <PhoneCard phone={phone} />
                  </div>
                ))}
              </div>

              {/* Scroll Buttons */}
              <button
                onClick={() => scroll(scrollContainerRef, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-transparent text-gray-400 p-2 rounded-full transition-all hover:scale-110 hover:text-gray-700"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll(scrollContainerRef, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-transparent text-gray-400 p-2 rounded-full transition-all hover:scale-110 hover:text-gray-700"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </LoadingError>
        </div>
      </section>

      {/* Trending Phones Section */}
      <TrendingPhones />

      {/* Top Rated by Category Section */}
      <TopRatedByCategory />

      {/* Price Segment Analysis Section */}
      <PriceSegmentAnalysis />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-96 -right-96 w-full h-full rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">Find Your <span className="text-yellow-300">Best</span><span className="text-white">Up</span> Phone</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Explore thousands of phones with detailed specs, ratings, and AI-powered recommendations</p>
          <Link
            to="/phones"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-orange-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <TrendingUp size={24} />
            Explore All Phones
          </Link>
        </div>
      </section>
    </div>
  )
}

// Upcoming Phone Card Component
function UpcomingPhoneCard({ phone }) {
  const [isFavorite, setIsFavorite] = useState(false)
  
  const launchDate = phone.launchDate ? new Date(phone.launchDate) : null
  const daysUntilLaunch = launchDate ? Math.ceil((launchDate - new Date()) / (1000 * 60 * 60 * 24)) : null
  const phoneSlug = phone.slug || phone.name.toLowerCase().replace(/\s+/g, '-')

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
  }

  return (
    <Link
      to={`/phone/${phoneSlug}`}
      className="group flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2 border border-gray-100 hover:border-yellow-400 relative"
    >
      {/* Top Action Button */}
      <div className="absolute top-2 right-2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleFavoriteClick}
          className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isFavorite
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/90 text-gray-700 hover:bg-red-50'
          }`}
          title="Add to favorites"
        >
          <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
        </button>
      </div>

      {/* Coming Soon Badge */}
      <div className="absolute top-2 left-2 flex gap-1.5 z-10">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
          <Sparkles size={12} />
          <span className="text-xs font-bold">Coming</span>
        </div>
      </div>

      {/* Phone Image Section */}
      <div className="relative h-40 flex items-center justify-center rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden border-b border-gray-200">
        {phone.imageId ? (
          <img
            src={`${API_ROOT}/api/phones/admin/phones/${phone._id}/image`}
            alt={phone.name}
            className="w-auto h-32 max-w-full max-h-full object-contain group-hover:scale-120 transition-transform duration-500 mx-auto"
            style={{ display: 'block' }}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <Smartphone size={64} className="text-gray-400 group-hover:text-yellow-500 transition-colors duration-300 mx-auto" />
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 gap-2 p-4">
        {/* Phone Name */}
        <div>
          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-300 text-sm mb-0.5">
            {phone.name}
          </h3>
          {phone.brand && (
            <p className="text-xs text-gray-500 font-medium">{phone.brand}</p>
          )}
        </div>

        {/* Overview */}
        {phone.overview && (
          <p className="text-gray-600 text-xs line-clamp-2 mb-1 flex-1">{phone.overview}</p>
        )}

        {/* Launch Date Info */}
        {daysUntilLaunch !== null && (
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5 mb-1">
            <Clock size={13} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">
              {daysUntilLaunch > 0 ? `${daysUntilLaunch} days left` : 'Launching very soon!'}
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="border-t border-gray-200 pt-2.5 mt-auto">
          {phone.basePrice && (
            <>
              <p className="text-xs text-gray-500 font-semibold mb-0.5">Expected Price</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  ₹{(phone.basePrice / 100000).toFixed(1)}L
                </p>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 flex items-center justify-center group-hover:shadow-lg transition-all group-hover:scale-110 shadow-md">
                  <Zap size={18} className="text-white fill-white" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
