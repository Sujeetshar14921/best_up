import React, { useState, useEffect, useMemo } from 'react'
import { X, Check, TrendingUp, Search, Trophy, Star, Zap, Camera, Battery, DollarSign } from 'lucide-react'
import { usePhones } from '../context/PhoneContext'
import LoadingError from '../components/LoadingError'

export default function ComparisonPage() {
  const { phones, loading, error, fetchPhones } = usePhones()
  const [selectedPhones, setSelectedPhones] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPhones, setFilteredPhones] = useState([])
  const [showSearch, setShowSearch] = useState(true)

  useEffect(() => {
    fetchPhones({ search: searchTerm })
  }, [searchTerm])

  useEffect(() => {
    setFilteredPhones(phones.filter(p => !selectedPhones.find(sp => sp._id === p._id)))
  }, [phones, selectedPhones])

  const handleSelectPhone = (phone) => {
    if (selectedPhones.length < 3) {
      setSelectedPhones([...selectedPhones, phone])
    }
  }

  const handleRemovePhone = (phoneId) => {
    setSelectedPhones(selectedPhones.filter(p => p._id !== phoneId))
  }

  const getWinner = (attribute, phones) => {
    if (attribute === 'price') {
      return selectedPhones.reduce((min, p) => (p.basePrice < min.basePrice ? p : min))._id
    }
    if (attribute === 'gaming') {
      return selectedPhones.reduce((max, p) => ((p.scores?.gaming || 0) > (max.scores?.gaming || 0) ? p : max))._id
    }
    if (attribute === 'camera') {
      return selectedPhones.reduce((max, p) => ((p.scores?.camera || 0) > (max.scores?.camera || 0) ? p : max))._id
    }
    if (attribute === 'battery') {
      return selectedPhones.reduce((max, p) => ((p.scores?.battery || 0) > (max.scores?.battery || 0) ? p : max))._id
    }
    if (attribute === 'value') {
      return selectedPhones.reduce((max, p) => ((p.scores?.valueForMoney || 0) > (max.scores?.valueForMoney || 0) ? p : max))._id
    }
  }

  // Calculate overall winner based on weighted scores
  const overallWinner = useMemo(() => {
    if (selectedPhones.length < 2) return null
    
    const scores = selectedPhones.map(phone => {
      const score = (
        (phone.scores?.gaming || 0) * 0.25 +
        (phone.scores?.camera || 0) * 0.25 +
        (phone.scores?.battery || 0) * 0.25 +
        (phone.scores?.valueForMoney || 0) * 0.25
      )
      return { phone, totalScore: score }
    })
    
    return scores.reduce((max, current) => 
      current.totalScore > max.totalScore ? current : max
    ).phone
  }, [selectedPhones])

  // Get category winners
  const categoryWinners = useMemo(() => {
    if (selectedPhones.length < 2) return {}
    return {
      gaming: selectedPhones.reduce((max, p) => ((p.scores?.gaming || 0) > (max.scores?.gaming || 0) ? p : max)),
      camera: selectedPhones.reduce((max, p) => ((p.scores?.camera || 0) > (max.scores?.camera || 0) ? p : max)),
      battery: selectedPhones.reduce((max, p) => ((p.scores?.battery || 0) > (max.scores?.battery || 0) ? p : max)),
      value: selectedPhones.reduce((max, p) => ((p.scores?.valueForMoney || 0) > (max.scores?.valueForMoney || 0) ? p : max))
    }
  }, [selectedPhones])

  const comparisonSpecs = [
    { label: 'Price', key: 'price', display: (phone) => `₹${(phone.basePrice / 1000).toFixed(0)}K` },
    { label: 'Processor', key: 'processor', display: (phone) => phone.specs?.performance?.processor },
    { label: 'RAM', key: 'ram', display: (phone) => `${phone.specs?.performance?.ram}GB` },
    { label: 'Storage', key: 'storage', display: (phone) => `${phone.specs?.performance?.storage}GB` },
    { label: 'Display Size', key: 'displaySize', display: (phone) => `${phone.specs?.display?.size}"` },
    { label: 'Refresh Rate', key: 'refreshRate', display: (phone) => `${phone.specs?.display?.refreshRate}Hz` },
    { label: 'Main Camera', key: 'mainCamera', display: (phone) => `${phone.specs?.camera?.rear?.main?.megapixels}MP` },
    { label: 'Selfie Camera', key: 'selfieCamera', display: (phone) => `${phone.specs?.camera?.front?.megapixels}MP` },
    { label: 'Battery', key: 'battery', display: (phone) => `${(phone.specs?.battery?.capacity / 1000).toFixed(1)}K mAh` },
    { label: 'Charging', key: 'charging', display: (phone) => `${phone.specs?.battery?.fastCharging}W` },
    { label: 'Gaming Score', key: 'gaming', display: (phone) => `${phone.scores?.gaming?.toFixed(1) || 'N/A'}/10` },
    { label: 'Camera Score', key: 'camera', display: (phone) => `${phone.scores?.camera?.toFixed(1) || 'N/A'}/10` },
    { label: 'Battery Score', key: 'battery', display: (phone) => `${phone.scores?.battery?.toFixed(1) || 'N/A'}/10` },
    { label: 'Value Score', key: 'value', display: (phone) => `${phone.scores?.valueForMoney?.toFixed(1) || 'N/A'}/10` }
  ]

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Compare Phones
          </h1>
          <p className="text-gray-600 text-lg">
            Select 2-3 phones to compare side by side
          </p>
        </div>

        {/* Selected Phones */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedPhones.map((phone) => (
              <div key={phone._id} className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 border-2 border-primary/20 relative">
                {overallWinner?._id === phone._id && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full p-2 shadow-lg">
                    <Trophy size={20} />
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{phone.name}</h3>
                  <button
                    onClick={() => handleRemovePhone(phone._id)}
                    className="p-1 hover:bg-red-100 rounded-lg transition-all"
                  >
                    <X size={18} className="text-red-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{phone.brand}</p>
                <p className="text-lg font-bold gradient-text">₹{(phone.basePrice / 1000).toFixed(0)}K</p>
              </div>
            ))}
            
            {selectedPhones.length < 3 && (
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="bg-white border-2 border-dashed border-primary rounded-lg p-4 hover:bg-primary/5 transition-all flex flex-col items-center justify-center min-h-24"
              >
                <Search size={24} className="text-primary mb-2" />
                <span className="font-semibold text-primary">Add Phone</span>
              </button>
            )}
          </div>

          {selectedPhones.length < 2 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              ⚠️ Select at least 2 phones to compare
            </div>
          )}
        </div>

        {/* Search Section */}
        {showSearch && selectedPhones.length < 3 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Search size={20} className="text-primary" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <LoadingError loading={loading} error={error}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredPhones.map((phone) => (
                  <button
                    key={phone._id}
                    onClick={() => handleSelectPhone(phone)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <h4 className="font-bold text-gray-900">{phone.name}</h4>
                    <p className="text-sm text-gray-600">{phone.brand}</p>
                    <p className="text-lg font-bold gradient-text mt-2">₹{(phone.basePrice / 1000).toFixed(0)}K</p>
                  </button>
                ))}
              </div>
            </LoadingError>
          </div>
        )}

        {/* Winner Suggestion */}
        {selectedPhones.length >= 2 && overallWinner && (
          <div className="mb-8 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 rounded-2xl shadow-lg border-2 border-yellow-300 overflow-hidden relative">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-300 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative p-8 z-10">
              {/* Header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <Trophy size={40} className="text-yellow-600 animate-bounce" />
                <h2 className="text-4xl font-black gradient-text">BEST CHOICE</h2>
                <Trophy size={40} className="text-yellow-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Winner Card */}
                <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-yellow-400">
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{overallWinner.name}</h3>
                    <p className="text-lg text-gray-600 mb-3">{overallWinner.brand}</p>
                    <p className="text-4xl font-black gradient-text">₹{(overallWinner.basePrice / 1000).toFixed(0)}K</p>
                  </div>

                  {/* Score Breakdown */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2">
                        <Zap size={18} className="text-red-600" />
                        <span className="font-semibold text-gray-700">Gaming</span>
                      </div>
                      <span className="text-lg font-bold text-red-600">{overallWinner.scores?.gaming?.toFixed(1) || 'N/A'}/10</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="flex items-center gap-2">
                        <Camera size={18} className="text-pink-600" />
                        <span className="font-semibold text-gray-700">Camera</span>
                      </div>
                      <span className="text-lg font-bold text-pink-600">{overallWinner.scores?.camera?.toFixed(1) || 'N/A'}/10</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Battery size={18} className="text-green-600" />
                        <span className="font-semibold text-gray-700">Battery</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">{overallWinner.scores?.battery?.toFixed(1) || 'N/A'}/10</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-blue-600" />
                        <span className="font-semibold text-gray-700">Value</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{overallWinner.scores?.valueForMoney?.toFixed(1) || 'N/A'}/10</span>
                    </div>
                  </div>
                </div>

                {/* Why This Phone */}
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star size={24} className="text-yellow-500" />
                    Why This Phone?
                  </h4>

                  <div className="space-y-3">
                    {categoryWinners.gaming?._id === overallWinner._id && (
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <Zap size={20} className="text-red-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">🎮 Best for Gaming</p>
                          <p className="text-sm text-gray-600">Unbeatable gaming performance among selected phones</p>
                        </div>
                      </div>
                    )}

                    {categoryWinners.camera?._id === overallWinner._id && (
                      <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                        <Camera size={20} className="text-pink-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">📸 Best Camera Quality</p>
                          <p className="text-sm text-gray-600">Superior imaging capabilities for photography</p>
                        </div>
                      </div>
                    )}

                    {categoryWinners.battery?._id === overallWinner._id && (
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Battery size={20} className="text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">🔋 Best Battery Life</p>
                          <p className="text-sm text-gray-600">Longest lasting battery among alternatives</p>
                        </div>
                      </div>
                    )}

                    {categoryWinners.value?._id === overallWinner._id && (
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <DollarSign size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">💰 Best Value for Money</p>
                          <p className="text-sm text-gray-600">Excellent performance at the best price</p>
                        </div>
                      </div>
                    )}

                    {/* Overall score */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-primary">
                      <p className="text-sm text-gray-600 mb-2">🏆 Overall Score</p>
                      <p className="text-3xl font-black gradient-text">
                        {((
                          (overallWinner.scores?.gaming || 0) * 0.25 +
                          (overallWinner.scores?.camera || 0) * 0.25 +
                          (overallWinner.scores?.battery || 0) * 0.25 +
                          (overallWinner.scores?.valueForMoney || 0) * 0.25
                        ) / 10).toFixed(1)}/10
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {selectedPhones.length >= 2 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Specification</th>
                  {selectedPhones.map((phone) => (
                    <th key={phone._id} className="px-6 py-4 text-center">
                      <div className="font-bold text-gray-900 mb-1">{phone.name}</div>
                      <div className="text-xs text-gray-600">{phone.brand}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonSpecs.map((spec, idx) => {
                  const winnerId = getWinner(spec.key, selectedPhones)
                  return (
                    <tr key={spec.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-semibold text-gray-900">{spec.label}</td>
                      {selectedPhones.map((phone) => (
                        <td
                          key={phone._id}
                          className={`px-6 py-4 text-center font-semibold ${
                            winnerId === phone._id
                              ? 'bg-green-50 text-green-700'
                              : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {winnerId === phone._id && spec.key !== 'price' && (
                              <TrendingUp size={16} />
                            )}
                            {spec.display(phone) || 'N/A'}
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedPhones.length === 0 && !showSearch && (
          <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">No phones selected yet</p>
            <p className="text-gray-500 text-sm">Click "Add Phone" to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
