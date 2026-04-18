import React from 'react'
import { Zap, Camera, Battery, Gauge } from 'lucide-react'

export default function ScoreBreakdownSection({ phone }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Score Breakdown</h2>
      <div className="space-y-4">
        {[
          { icon: Zap, label: 'Gaming', value: phone.scores?.gaming || 0 },
          { icon: Camera, label: 'Camera', value: phone.scores?.camera || 0 },
          { icon: Battery, label: 'Battery', value: phone.scores?.battery || 0 },
          { icon: Gauge, label: 'Value', value: phone.scores?.valueForMoney || 0 },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="inline-flex items-center gap-2 text-gray-700 font-medium">
                <stat.icon size={14} className="text-yellow-700" />
                {stat.label}
              </span>
              <span className="font-bold text-gray-900">{Number(stat.value).toFixed(1)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                style={{ width: `${Math.max(0, Math.min(100, Number(stat.value) * 10))}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
