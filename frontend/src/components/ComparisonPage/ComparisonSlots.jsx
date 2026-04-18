import React from 'react'
import { Trophy, X, Plus } from 'lucide-react'
import { formatPrice, scorePhone } from './utils'

const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')

export default function ComparisonSlots({ selectedPhones, winner, onRemovePhone }) {
  return (
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
                onClick={() => onRemovePhone(phone._id)}
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
  )
}
