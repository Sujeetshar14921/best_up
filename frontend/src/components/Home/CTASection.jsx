import React from 'react'
import { TrendingUp } from 'lucide-react'

export default function CTASection() {
  const handleExploreClick = () => {
    const section = document.getElementById('explore-phones')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="py-12 md:py-20 px-3 md:px-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 text-white relative overflow-hidden rounded-2xl mx-9">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-96 -right-96 w-full h-full rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          Find Your <span className="text-yellow-300">Best</span><span className="text-white">Up</span> Phone
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Explore thousands of phones with detailed specs, ratings, and AI-powered recommendations
        </p>
        <button
          onClick={handleExploreClick}
          className="inline-flex items-center gap-2 px-6 sm:px-8 md:px-10 py-3 md:py-4 bg-white text-orange-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
        >
          <TrendingUp size={20} />
          Explore All Phones
        </button>
      </div>
    </section>
  )
}
