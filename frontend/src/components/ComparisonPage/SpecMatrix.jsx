import React from 'react'
import { getBestPhoneId } from './utils'

export default function SpecMatrix({ selectedPhones, specRows }) {
  if (selectedPhones.length < 2) return null

  return (
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
                <th key={phone._id} className="text-center px-6 py-3 font-semibold text-gray-700">
                  {phone.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map((row, idx) => {
              const bestId = getBestPhoneId(selectedPhones, row)
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
  )
}
