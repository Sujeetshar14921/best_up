import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Trophy, X, Plus, Sparkles, Swords, Star, Camera, Battery, Cpu, IndianRupee, Smartphone } from 'lucide-react'
import { usePhones } from '../context/PhoneContext'
import LoadingError from '../components/LoadingError'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_ROOT = API.replace(/\/api\/?$/, '')

const scorePhone = (phone) => {
  const gaming = phone?.scores?.gaming || 0
  const camera = phone?.scores?.camera || 0
  const battery = phone?.scores?.battery || 0
  const value = phone?.scores?.valueForMoney || 0
  return gaming * 0.28 + camera * 0.24 + battery * 0.24 + value * 0.24
}

const formatPrice = (price) => {
  if (!price) return 'N/A'
  return `INR ${(price / 1000).toFixed(0)}K`
}

export default function ComparisonPage() {
  const { phones, loading, error, fetchPhones } = usePhones()
  const [searchParams] = useSearchParams()
  const [selectedPhones, setSelectedPhones] = useState([])
  const navbarSearch = (searchParams.get('search') || '').trim()
  const preselectId = (searchParams.get('preselect') || '').trim()
  const preselectSlug = (searchParams.get('preselectSlug') || '').trim().toLowerCase()
  const [preselectApplied, setPreselectApplied] = useState(false)

  useEffect(() => {
    const query = navbarSearch
      ? { search: navbarSearch, limit: 80, sort: '-scores.valueForMoney' }
      : { limit: 80, sort: '-scores.valueForMoney' }

    fetchPhones(query)
  }, [fetchPhones, navbarSearch])

  useEffect(() => {
    if (preselectApplied || phones.length === 0) return

    // No preselect query means nothing to auto-add.
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

  const availablePhones = useMemo(() => {
    return (phones || []).filter((phone) => !selectedPhones.some((selected) => selected._id === phone._id))
  }, [phones, selectedPhones])

  const sortedSelected = useMemo(() => {
    return [...selectedPhones].sort((a, b) => scorePhone(b) - scorePhone(a))
  }, [selectedPhones])

  const winner = sortedSelected[0] || null

  const specRows = [
    {
      label: 'Price',
      value: (phone) => formatPrice(phone.basePrice),
      better: 'lower'
    },
    {
      label: 'Processor',
      value: (phone) => phone?.specs?.performance?.processor || 'N/A'
    },
    {
      label: 'RAM',
      value: (phone) => {
        const ram = phone?.specs?.performance?.ram
        return ram ? `${ram} GB` : 'N/A'
      }
    },
    {
      label: 'Storage',
      value: (phone) => {
        const storage = phone?.specs?.performance?.storage
        return storage ? `${storage} GB` : 'N/A'
      }
    },
    {
      label: 'Gaming Score',
      value: (phone) => `${(phone?.scores?.gaming || 0).toFixed(1)} / 10`,
      better: 'higher',
      scoreKey: 'gaming'
    },
    {
      label: 'Camera Score',
      value: (phone) => `${(phone?.scores?.camera || 0).toFixed(1)} / 10`,
      better: 'higher',
      scoreKey: 'camera'
    },
    {
      label: 'Battery Score',
      value: (phone) => `${(phone?.scores?.battery || 0).toFixed(1)} / 10`,
      better: 'higher',
      scoreKey: 'battery'
    },
    {
      label: 'Value Score',
      value: (phone) => `${(phone?.scores?.valueForMoney || 0).toFixed(1)} / 10`,
      better: 'higher',
      scoreKey: 'valueForMoney'
    }
  ]

  const getBestPhoneId = (row) => {
    if (selectedPhones.length < 2) return null
    if (row.better === 'higher' && row.scoreKey) {
      return selectedPhones.reduce((best, phone) => {
        const bestScore = best?.scores?.[row.scoreKey] || 0
        const currentScore = phone?.scores?.[row.scoreKey] || 0
        return currentScore > bestScore ? phone : best
      }, selectedPhones[0])._id
    }

    if (row.better === 'lower' && row.label === 'Price') {
      return selectedPhones.reduce((best, phone) => {
        const bestPrice = best?.basePrice || Number.MAX_SAFE_INTEGER
        const currentPrice = phone?.basePrice || Number.MAX_SAFE_INTEGER
        return currentPrice < bestPrice ? phone : best
      }, selectedPhones[0])._id
    }

    return null
  }

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

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map((slot) => {
            const phone = selectedPhones[slot]
            if (!phone) {
              return (
                <div
                  key={slot}
                  className="rounded-2xl border-2 border-dashed border-amber-300 bg-white/80 p-6 min-h-44 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                    <Plus size={22} />
                  </div>
                  <p className="font-semibold text-gray-700">Select a phone below</p>
                  <p className="text-sm text-gray-500">Slot {slot + 1} of 3</p>
                </div>
              )
            }

            const isWinner = winner?._id === phone._id && selectedPhones.length >= 2

            return (
              <div key={phone._id} className={`rounded-2xl p-5 border bg-white shadow-sm ${isWinner ? 'border-yellow-400 ring-2 ring-yellow-300' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{phone.name}</h3>
                    <p className="text-sm text-gray-600">{phone.brand}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhone(phone._id)}
                    className="p-1.5 rounded-lg hover:bg-orange-100 text-orange-700"
                    aria-label="Remove phone"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-2xl font-black text-gray-900">{formatPrice(phone.basePrice)}</p>
                  <p className="text-sm text-gray-600">Overall score: {scorePhone(phone).toFixed(1)} / 10</p>
                </div>

                {isWinner && (
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full border border-yellow-300">
                    <Trophy size={14} />
                    Current Winner
                  </div>
                )}
              </div>
            )
          })}
        </section>

        {selectedPhones.length >= 2 && (
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-orange-50">
              <h2 className="text-2xl font-bold text-gray-900">Spec Matrix</h2>
              <p className="text-sm text-gray-600">Highlighted values indicate best in row.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Specification</th>
                    {selectedPhones.map((phone) => (
                      <th key={phone._id} className="text-center px-6 py-3 font-semibold text-gray-700">{phone.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specRows.map((row, idx) => {
                    const bestId = getBestPhoneId(row)
                    return (
                      <tr key={row.label} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                        <td className="px-6 py-4 font-medium text-gray-800">{row.label}</td>
                        {selectedPhones.map((phone) => (
                          <td
                            key={`${row.label}-${phone._id}`}
                            className={`px-6 py-4 text-center font-semibold ${bestId === phone._id ? 'text-orange-700 bg-orange-50' : 'text-gray-700'}`}
                          >
                            {row.value(phone)}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Phone Pool</h2>
            <p className="text-sm text-gray-600">
              {selectedPhones.length >= 3
                ? 'Maximum 3 selected. Remove one to add more.'
                : selectedPhones.length === 1
                ? 'Current phone is pre-selected. Choose 1 or 2 more phones.'
                : 'Choose phones to fill all three slots.'}
            </p>
          </div>

          <LoadingError loading={loading} error={error}>
            {availablePhones.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-gray-700 font-semibold">No phones available with current navbar search.</p>
                <Link to="/" className="inline-block mt-3 text-orange-600 font-semibold hover:text-orange-700">
                  Go to Home search
                </Link>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {availablePhones.map((phone) => (
                  <button
                    type="button"
                    key={phone._id}
                    disabled={selectedPhones.length >= 3}
                    onClick={() => addPhone(phone)}
                    className="text-left border border-gray-200 rounded-xl p-4 hover:border-orange-400 hover:bg-orange-50/40 transition disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    <div className="mb-3 h-36 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                      {phone.imageId ? (
                        <img
                          src={`${API_ROOT}/api/phones/admin/phones/${phone._id}/image`}
                          alt={phone.name}
                          className="w-auto h-32 max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <Smartphone size={52} className="text-gray-300" />
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">{phone.name}</h3>
                        <p className="text-sm text-gray-600">{phone.brand}</p>
                      </div>
                      <span className="text-xs font-semibold text-orange-700 bg-orange-100 border border-orange-200 px-2 py-1 rounded-full">
                        {scorePhone(phone).toFixed(1)}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="inline-flex items-center gap-1.5"><IndianRupee size={14} /> {formatPrice(phone.basePrice)}</div>
                      <div className="inline-flex items-center gap-1.5"><Cpu size={14} /> {phone?.scores?.gaming?.toFixed(1) || '0.0'}</div>
                      <div className="inline-flex items-center gap-1.5"><Camera size={14} /> {phone?.scores?.camera?.toFixed(1) || '0.0'}</div>
                      <div className="inline-flex items-center gap-1.5"><Battery size={14} /> {phone?.scores?.battery?.toFixed(1) || '0.0'}</div>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-700">
                      <Star size={14} /> Add to compare
                    </div>
                  </button>
                ))}
              </div>
            )}
          </LoadingError>
        </section>
      </div>
    </div>
  )
}
