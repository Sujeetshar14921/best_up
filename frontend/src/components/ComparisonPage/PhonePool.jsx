import React from 'react'
import { Star, Smartphone, Camera, Battery, Cpu, IndianRupee } from 'lucide-react'
import { Link } from 'react-router-dom'
import LoadingError from '../LoadingError'
import { formatPrice, scorePhone } from './utils'

const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')

export default function PhonePool({ availablePhones, selectedPhones, onAddPhone, loading, error }) {
  const getStatusText = () => {
    if (selectedPhones.length >= 3) {
      return 'Maximum 3 selected. Remove one to add more.'
    } else if (selectedPhones.length === 1) {
      return 'Current phone is pre-selected. Choose 1 or 2 more phones.'
    } else {
      return 'Choose phones to fill all three slots.'
    }
  }

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Phone Pool</h2>
        <p className="text-sm text-gray-600">{getStatusText()}</p>
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
                onClick={() => onAddPhone(phone)}
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
                  <div className="inline-flex items-center gap-1.5">
                    <IndianRupee size={14} /> {formatPrice(phone.basePrice)}
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Cpu size={14} /> {phone?.scores?.gaming?.toFixed(1) || '0.0'}
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Camera size={14} /> {phone?.scores?.camera?.toFixed(1) || '0.0'}
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Battery size={14} /> {phone?.scores?.battery?.toFixed(1) || '0.0'}
                  </div>
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
  )
}
