import React, { useState, useEffect } from 'react'
import LoadingError from '../LoadingError'
import PhoneCard from '../PhoneCard'

export default function LatestPhonesSection({ phones = [], loading, error }) {
  const getLatestPhones = () => (phones || []).filter(p => p && !p.isUpcoming).slice(0, 30)

  return (
    <section className="py-12 md:py-16 px-0 w-screen bg-white">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Latest Smartphones</h2>
          <p className="text-gray-600 text-lg">Fresh releases from the market</p>
        </div>

        <LoadingError loading={loading} error={error}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {getLatestPhones().map((phone) => (
              <div key={phone._id}>
                <PhoneCard phone={phone} />
              </div>
            ))}
          </div>
        </LoadingError>
      </div>
    </section>
  )
}
