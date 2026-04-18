import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Sparkles, Swords } from 'lucide-react'
import { usePhones } from '../context/PhoneContext'
import {
  ComparisonSlots,
  SpecMatrix,
  PhonePool,
  scorePhone
} from '../components/ComparisonPage'

export default function ComparisonPage() {
  const { phones, loading, error, fetchPhones } = usePhones()
  const [searchParams] = useSearchParams()
  const [selectedPhones, setSelectedPhones] = useState([])
  const navbarSearch = (searchParams.get('search') || '').trim()
  const preselectId = (searchParams.get('preselect') || '').trim()
  const preselectSlug = (searchParams.get('preselectSlug') || '').trim().toLowerCase()
  const [preselectApplied, setPreselectApplied] = useState(false)

  // Fetch phones based on navbar search
  useEffect(() => {
    const query = navbarSearch
      ? { search: navbarSearch, limit: 80, sort: '-scores.valueForMoney' }
      : { limit: 80, sort: '-scores.valueForMoney' }
    fetchPhones(query)
  }, [fetchPhones, navbarSearch])

  // Auto-select a phone if preselected
  useEffect(() => {
    if (preselectApplied || phones.length === 0) return

    if (!preselectId && !preselectSlug) {
      setPreselectApplied(true)
      return
    }

    const matchedPhone = phones.find((p) =>
      (preselectId && p._id === preselectId) ||
      (preselectSlug && (p.slug || '').toLowerCase() === preselectSlug)
    )

    if (matchedPhone) {
      setSelectedPhones((prev) => {
        if (prev.some((p) => p._id === matchedPhone._id)) return prev
        return [matchedPhone, ...prev].slice(0, 3)
      })
    }

    setPreselectApplied(true)
  }, [phones, preselectId, preselectSlug, preselectApplied])

  // Filter out already selected phones
  const availablePhones = useMemo(() => {
    return (phones || []).filter((phone) => !selectedPhones.some((selected) => selected._id === phone._id))
  }, [phones, selectedPhones])

  // Get winner phone based on overall score
  const sortedSelected = useMemo(() => {
    return [...selectedPhones].sort((a, b) => scorePhone(b) - scorePhone(a))
  }, [selectedPhones])
  const winner = sortedSelected[0] || null

  // Specification rows for comparison table
  const specRows = [
    { label: 'Price', value: (phone) => `INR ${(phone.basePrice / 1000).toFixed(0)}K`, better: 'lower' },
    { label: 'Processor', value: (phone) => phone?.specs?.performance?.processor || 'N/A' },
    { label: 'RAM', value: (phone) => (phone?.specs?.performance?.ram ? `${phone.specs.performance.ram} GB` : 'N/A') },
    { label: 'Storage', value: (phone) => (phone?.specs?.performance?.storage ? `${phone.specs.performance.storage} GB` : 'N/A') },
    { label: 'Gaming Score', value: (phone) => `${(phone?.scores?.gaming || 0).toFixed(1)} / 10`, better: 'higher', scoreKey: 'gaming' },
    { label: 'Camera Score', value: (phone) => `${(phone?.scores?.camera || 0).toFixed(1)} / 10`, better: 'higher', scoreKey: 'camera' },
    { label: 'Battery Score', value: (phone) => `${(phone?.scores?.battery || 0).toFixed(1)} / 10`, better: 'higher', scoreKey: 'battery' },
    { label: 'Value Score', value: (phone) => `${(phone?.scores?.valueForMoney || 0).toFixed(1)} / 10`, better: 'higher', scoreKey: 'valueForMoney' }
  ]

  // Add/remove phone handlers
  const addPhone = (phone) => {
    if (selectedPhones.length >= 3) return
    if (selectedPhones.some((selected) => selected._id === phone._id)) return
    setSelectedPhones((prev) => [...prev, phone])
  }

  const removePhone = (phoneId) => {
    setSelectedPhones((prev) => prev.filter((phone) => phone._id !== phoneId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <section className="rounded-3xl border border-amber-200 bg-white/90 backdrop-blur p-8 shadow-xl mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-orange-700 bg-orange-100 px-3 py-1 rounded-full mb-4">
                <Swords size={14} />
                Battle Lab
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900">Phone Face-Off</h1>
              <p className="text-gray-600 mt-3 text-lg">
                Pick up to 3 phones and compare their strengths in one clean board.
              </p>
            </div>
            <div className="text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              Search on the navbar and then open compare to view that filtered set here.
            </div>
          </div>

          {navbarSearch && (
            <div className="mt-5 inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles size={16} />
              Filtered by navbar search: "{navbarSearch}"
            </div>
          )}
        </section>

        {/* Comparison Slots */}
        <ComparisonSlots
          selectedPhones={selectedPhones}
          winner={winner}
          onRemovePhone={removePhone}
        />

        {/* Spec Matrix */}
        <SpecMatrix
          selectedPhones={selectedPhones}
          specRows={specRows}
        />

        {/* Phone Pool */}
        <PhonePool
          availablePhones={availablePhones}
          selectedPhones={selectedPhones}
          onAddPhone={addPhone}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
