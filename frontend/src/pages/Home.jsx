import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Smartphone, TrendingUp, Star, Sparkles, Clock } from 'lucide-react'
import { usePhones } from '../context/PhoneContext'
import PhoneCard from '../components/PhoneCard'
import LoadingError from '../components/LoadingError'
import BannerDisplay, { HorizontalBannersSection } from '../components/BannerDisplay'
import axios from 'axios'

export default function Home() {
  const { phones, loading, error, fetchPhones } = usePhones()
  const scrollContainerRef = useRef(null)
  const brandScrollRef = useRef(null)
  const upcomingScrollRef = useRef(null)
  const [brands, setBrands] = useState([])
  const [upcomingPhones, setUpcomingPhones] = useState([])

  useEffect(() => {
    fetchPhones({ limit: 20 })
    fetchBrands()
    fetchUpcomingPhones()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/brands')
      setBrands(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch brands:', err)
    }
  }

  const fetchUpcomingPhones = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/phones?isUpcoming=true&limit=10')
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
              <Link 
                to="/phones"
                className="text-lg font-semibold text-blue-600 hover:text-green-500 flex items-center gap-2 transition-colors"
              >
                View All
                <ChevronRight size={24} />
              </Link>
            </div>

            {/* Brands Carousel with Scroll Buttons */}
            <div className="relative">
              <div
                ref={brandScrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-6 scrollbar-hide"
              >
                {brands.map((brand) => (
                  <div
                    key={brand._id}
                    className="flex-shrink-0 group cursor-pointer text-center"
                  >
                    <div className="w-40 h-40 bg-gray-50 rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex items-center justify-center group-hover:scale-105 hover:-translate-y-1 mb-4">
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        className="w-28 h-28 object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22112%22 height=%22112%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22112%22 height=%22112%22/%3E%3C/svg%3E'
                        }}
                      />
                    </div>
                    <p className="text-gray-700 font-semibold text-base group-hover:text-blue-600 transition-colors line-clamp-1">{brand.name}</p>
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
            </div>
          </div>
        </section>
      )}

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
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
              >
                {getFeaturedPhones().map((phone) => (
                  <div key={phone._id} className="flex-shrink-0 w-56 transform transition-all duration-300 hover:scale-105">
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
                <span className="px-4 py-2 bg-yellow-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2 justify-center">
                  <Sparkles size={18} />
                  Coming Soon
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Upcoming Launches</h2>
              <p className="text-gray-600 text-lg">Exciting new phones on the horizon</p>
            </div>

            <div className="relative">
              <div
                ref={upcomingScrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
              >
                {upcomingPhones.map((phone) => (
                  <div key={phone._id} className="flex-shrink-0 w-56">
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
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
              >
                {getPopularPhones().map((phone) => (
                  <div key={phone._id} className="flex-shrink-0 w-56 transform transition-all duration-300 hover:scale-105">
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
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
              >
                {getLatestPhones().map((phone) => (
                  <div key={phone._id} className="flex-shrink-0 w-56 transform transition-all duration-300 hover:scale-105">
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-green-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-96 -right-96 w-full h-full rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">Find Your <span className="text-yellow-400">Best</span><span className="text-blue-600">Up</span> Phone</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Explore thousands of phones with detailed specs, ratings, and AI-powered recommendations</p>
          <Link
            to="/phones"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
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
  const launchDate = phone.launchDate ? new Date(phone.launchDate) : null
  const daysUntilLaunch = launchDate ? Math.ceil((launchDate - new Date()) / (1000 * 60 * 60 * 24)) : null

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative bg-yellow-50 h-48 overflow-hidden flex items-center justify-center">
        {phone.imageId ? (
          <img
            src={`http://localhost:5000/api/phones/admin/phones/${phone._id}/image`}
            alt={phone.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <Smartphone size={64} className="text-gray-400" />
        )}
        
        {/* Coming Soon Badge */}
        <div className="absolute top-3 right-3 bg-yellow-500 text-blue-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Sparkles size={14} />
          Coming
        </div>

        {/* Launch Date Badge */}
        {daysUntilLaunch !== null && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
            <Clock size={14} />
            {daysUntilLaunch > 0 ? `${daysUntilLaunch} days` : 'Launching soon'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">{phone.brand}</p>
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">{phone.name}</h3>

        {phone.overview && (
          <p className="text-gray-600 text-xs line-clamp-2 mb-4 flex-1">{phone.overview}</p>
        )}

        {phone.basePrice && (
          <div className="mb-4 pt-4 border-t border-gray-100">
            <p className="text-gray-500 text-xs mb-1">Expected Price</p>
            <p className="text-lg font-bold text-gray-900">₹{(phone.basePrice / 100000).toFixed(1)}L</p>
          </div>
        )}

        <Link
          to={`/phones/${phone.slug}`}
          className="inline-flex items-center justify-center gap-2 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all hover:scale-105"
        >
          View Details
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
