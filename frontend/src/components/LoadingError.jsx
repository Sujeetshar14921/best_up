import React from 'react'
import { AlertCircle, Loader } from 'lucide-react'

export default function LoadingError({ loading, error, children }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="w-12 h-12 text-yellow-500 animate-spin" />
        <p className="text-gray-600 mt-4">Loading amazing phones...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900">Error Loading Data</h3>
          <p className="text-red-700 mt-1">{error}</p>
          <p className="text-sm text-red-600 mt-2">Please check your backend server is running on port 5000</p>
        </div>
      </div>
    )
  }

  return children
}
