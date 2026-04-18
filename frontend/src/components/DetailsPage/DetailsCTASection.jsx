import React from 'react'
import { Link } from 'react-router-dom'

export default function DetailsCTASection({ phone }) {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 text-white p-8 md:p-10 text-center">
      <h2 className="text-3xl md:text-4xl font-black mb-3">Need a final decision?</h2>
      <p className="text-white/90 mb-6 max-w-2xl mx-auto">
        Compare this phone with others and shortlist what matches your budget and usage style.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to={`/compare?preselect=${encodeURIComponent(phone._id || '')}&preselectSlug=${encodeURIComponent(phone.slug || '')}`}
          className="px-6 py-3 rounded-xl font-bold bg-white text-orange-600 hover:opacity-90 transition-opacity"
        >
          Compare Phones
        </Link>
        <Link to="/" className="px-6 py-3 rounded-xl font-bold border border-white/70 bg-white/10 hover:bg-white/20 transition-colors">
          Explore More Phones
        </Link>
      </div>
    </section>
  )
}
