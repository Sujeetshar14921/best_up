import React from 'react'
import { Smartphone } from 'lucide-react'
import { getUseCases } from './utils.jsx'

const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')

export default function PhoneImageSection({ phone }) {
  const useCases = getUseCases(phone.scores || {})

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm">
      <div className="h-96 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center overflow-hidden">
        {phone.imageId ? (
          <img
            src={`${API_ROOT}/api/phones/admin/phones/${phone._id}/image`}
            alt={phone.name}
            className="max-h-80 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <Smartphone size={72} className="text-gray-300" />
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {useCases.map((item) => (
          <span key={item.key} className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold border border-yellow-200">
            Best for {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
