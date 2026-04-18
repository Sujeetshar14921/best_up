import React from 'react'
import { formatCurrency } from './utils.jsx'

export default function VariantsSection({ phone }) {
  const variants = Array.isArray(phone.variants) ? phone.variants : []

  if (variants.length === 0) return null

  return (
    <section className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Variants</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px]">
          <thead>
            <tr className="text-left border-b border-gray-200 text-sm text-gray-600">
              <th className="py-3 pr-3">RAM</th>
              <th className="py-3 pr-3">Storage</th>
              <th className="py-3 pr-3">Color</th>
              <th className="py-3 pr-3">Price</th>
              <th className="py-3 pr-3">Availability</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, idx) => (
              <tr key={`${v.sku || idx}-${v.ram}-${v.storage}`} className="border-b border-gray-100 text-sm">
                <td className="py-3 pr-3 font-medium">{v.ram ? `${v.ram} GB` : '-'}</td>
                <td className="py-3 pr-3">{v.storage ? `${v.storage} GB` : '-'}</td>
                <td className="py-3 pr-3">{v.color || '-'}</td>
                <td className="py-3 pr-3 font-semibold text-gray-900">{formatCurrency(v.price || phone.basePrice)}</td>
                <td className="py-3 pr-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {v.availability ? 'In stock' : 'Out of stock'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
