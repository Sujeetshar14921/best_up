import React from 'react'

export function SpecPanel({ title, items }) {
  const validItems = items.filter((item) => item.value !== null && item.value !== undefined && item.value !== '')

  if (validItems.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {validItems.map((item) => (
          <div key={item.label} className="flex justify-between gap-4 text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-900 text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900 font-bold">{value}</span>
    </div>
  )
}

export function SpecCard({ label, value, icon }) {
  return (
    <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{typeof icon === 'string' ? icon : ''}</span>
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-gray-900 font-bold text-sm">{value}</p>
        </div>
      </div>
    </div>
  )
}
