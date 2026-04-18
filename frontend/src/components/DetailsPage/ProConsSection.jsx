import React from 'react'

export default function ProConsSection({ phone }) {
  const pros = phone.pros || phone.highlights?.pros || []
  const cons = phone.cons || phone.highlights?.cons || []

  if (pros.length === 0 && cons.length === 0) return null

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <div className="bg-white rounded-2xl border border-green-200 p-6">
        <h3 className="text-xl font-bold text-green-700 mb-4">What users may like</h3>
        {pros.length > 0 ? (
          <ul className="space-y-3 text-sm">
            {pros.map((pro, idx) => (
              <li key={idx} className="text-gray-700">
                + {pro}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No pros listed yet.</p>
        )}
      </div>
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h3 className="text-xl font-bold text-red-700 mb-4">Things to consider</h3>
        {cons.length > 0 ? (
          <ul className="space-y-3 text-sm">
            {cons.map((con, idx) => (
              <li key={idx} className="text-gray-700">
                - {con}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No cons listed yet.</p>
        )}
      </div>
    </section>
  )
}
