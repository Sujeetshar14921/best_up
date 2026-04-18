import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function BrandsSection() {
  const [brands, setBrands] = useState([])
  const brandScrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API}/brands`)
      setBrands(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch brands:', err)
    }
  }

  const scroll = (direction) => {
    if (brandScrollRef.current) {
      const scrollAmount = 300
      brandScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (!brands.length) return null

  return (
    <section className="py-16 md:py-28 px-0 bg-white overflow-hidden border-b border-gray-100">
      <div className="w-full">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">Popular Brands</h2>
          <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">Explore from the world's leading smartphone manufacturers</p>
        </div>

        {/* Brands Grid */}
        <div className="relative px-3 md:px-4">
          <div
            ref={brandScrollRef}
            className="flex gap-4 md:gap-8 overflow-x-auto scroll-smooth py-8 scrollbar-hide"
          >
            {brands.map((brand) => (
              <div
                key={brand._id}
                onClick={() => navigate(`/?brand=${encodeURIComponent(brand.name)}#explore-phones`)}
                className="flex-shrink-0 group cursor-pointer text-center transition-all duration-300"
              >
                {/* Clean White Card */}
                <div 
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl bg-white border-2 border-gray-100 group-hover:border-yellow-400 flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-xl"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-gray-800 font-bold text-xs sm:text-sm md:text-base mt-4 group-hover:text-yellow-600 transition-colors duration-300">{brand.name}</p>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-300 rounded-full p-2"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-300 rounded-full p-2"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}
