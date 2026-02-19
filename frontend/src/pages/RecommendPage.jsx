import React, { useState, useMemo } from 'react'
import { Zap, Target, DollarSign, ArrowRight, CheckCircle, Trophy, Smartphone, Wifi, Flame, Lightbulb, TrendingUp } from 'lucide-react'
import { usePhones } from '../context/PhoneContext'
import PhoneCard from '../components/PhoneCard'
import LoadingError from '../components/LoadingError'

export default function RecommendPage() {
  const { recommendations, loading, error, fetchRecommendations } = usePhones()
  const [budget, setBudget] = useState(30000)
  const [priority, setPriority] = useState('Gaming')
  const [submitted, setSubmitted] = useState(false)

  const priorities = [
    { value: 'Gaming', label: 'Gaming', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    { value: 'Camera', label: 'Camera', icon: Target, color: 'from-orange-500 to-red-500' },
    { value: 'Vlogging', label: 'Vlogging', icon: Target, color: 'from-yellow-400 to-orange-500' },
    { value: 'Battery', label: 'Battery', icon: Zap, color: 'from-yellow-500 to-orange-600' },
    { value: 'Value', label: 'Value for Money', icon: DollarSign, color: 'from-yellow-500 to-orange-500' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    fetchRecommendations(budget, priority)
  }

  const budgetRanges = [
    { label: 'Budget (~₹15K)', value: 15000 },
    { label: 'Mid-range (~₹30K)', value: 30000 },
    { label: 'Flagship (~₹60K)', value: 60000 },
    { label: 'Premium (₹100K+)', value: 100000 }
  ]

  // Get top 3 phones
  const topThreePhones = useMemo(() => {
    return recommendations.slice(0, 3)
  }, [recommendations])

  // Get winner (best overall)
  const getWinner = (phones) => {
    if (phones.length === 0) return null
    
    const scoreMap = {
      'Gaming': 'gaming',
      'Camera': 'camera',
      'Vlogging': 'camera',
      'Battery': 'battery',
      'Value': 'valueForMoney'
    }
    
    const scoreKey = scoreMap[priority]
    return phones.reduce((max, p) => 
      ((p.scores?.[scoreKey] || 0) > (max.scores?.[scoreKey] || 0) ? p : max)
    )
  }

  const winner = submitted && topThreePhones.length > 0 ? getWinner(topThreePhones) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full mb-4">
            <Lightbulb size={18} className="text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">Smart Recommendations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect <span className="text-yellow-500">Phone</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Answer a few questions about your needs and budget, and get personalized recommendations based on your priorities.
          </p>
        </div>

        {/* Recommendation Form */}
        {!submitted || topThreePhones.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 mb-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Budget Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={22} className="text-yellow-600" />
                  <label className="text-xl font-bold text-gray-900">
                    What's your budget?
                  </label>
                </div>
                <div className="space-y-6">
                  <input
                    type="range"
                    min="10000"
                    max="150000"
                    step="1000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Selected Budget</p>
                      <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                        ₹{budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {budgetRanges.map(({ label, value }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setBudget(value)}
                          className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                            budget === value
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Target size={22} className="text-yellow-600" />
                  <label className="text-xl font-bold text-gray-900">
                    What matters most to you?
                  </label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {priorities.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPriority(value)}
                      className={`p-4 rounded-xl font-semibold transition-all flex flex-col items-center gap-2 border-2 ${
                        priority === value
                          ? 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg scale-105 border-orange-700'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      <Icon size={28} />
                      <span className="text-xs md:text-sm text-center font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Recommendations
                <ArrowRight size={24} />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setSubmitted(false)}
            className="mb-8 px-6 py-2 bg-white rounded-lg border border-gray-200 font-semibold hover:bg-gray-50 transition-all text-gray-700"
          >
            ← Change Preferences
          </button>
        )}

        {/* Results */}
        {submitted && (
          <LoadingError loading={loading} error={error}>
            <div className="space-y-8">
              {/* Summary */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      Top 3 recommendations for {priority} enthusiasts
                    </p>
                    <p className="text-gray-600 mt-1">
                      Budget: <span className="font-semibold">₹{budget.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Top 3 Phones */}
              {topThreePhones.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <Smartphone size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 text-lg font-semibold">No phones match your criteria</p>
                  <p className="text-gray-500 mt-2">Try adjusting your budget or preferences for more options</p>
                </div>
              ) : (
                <>
                  {/* Cards Grid */}
                  <div className="flex flex-wrap justify-center gap-6 mb-8">
                    {topThreePhones.map((phone, idx) => (
                      <div key={phone._id} className="relative flex-shrink-0 w-48">
                        {/* Rank Badge */}
                        <div className="absolute top-2 left-2 z-20">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white text-white ${
                            idx === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                            idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                            'bg-gradient-to-br from-orange-500 to-orange-600'
                          }`}>
                            #{idx + 1}
                          </div>
                        </div>
                        <PhoneCard phone={phone} />
                      </div>
                    ))}
                  </div>

                  {/* Winner Section */}
                  {winner && (
                    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-8 text-center mt-8 shadow-lg">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <Trophy size={40} className="text-yellow-600" />
                        <h2 className="text-4xl font-bold text-gray-900">Best Match!</h2>
                        <Trophy size={40} className="text-yellow-600" />
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-gray-700 text-lg mb-4 font-semibold">Based on {priority.toLowerCase()} performance</p>
                        <div className="bg-white rounded-xl p-8 inline-block shadow-md border border-yellow-100">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{winner.name}</h3>
                          <p className="text-gray-600 mb-3">{winner.brand}</p>
                          <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent mb-6">₹{(winner.basePrice / 1000).toFixed(0)}K</p>
                          
                          {/* Performance Metrics */}
                          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                            {priority === 'Value' && winner.scores?.valueForMoney && (
                              <div className="bg-yellow-50 rounded-lg p-3"><p className="text-yellow-700 font-bold text-lg">{winner.scores.valueForMoney.toFixed(1)}/10</p><p className="text-yellow-700 text-xs font-semibold">Value Score</p></div>
                            )}
                            {priority === 'Gaming' && winner.scores?.gaming && (
                              <div className="bg-orange-50 rounded-lg p-3"><p className="text-orange-700 font-bold text-lg">{winner.scores.gaming.toFixed(1)}/10</p><p className="text-orange-700 text-xs font-semibold">Gaming Score</p></div>
                            )}
                            {(priority === 'Camera' || priority === 'Vlogging') && winner.scores?.camera && (
                              <div className="bg-yellow-50 rounded-lg p-3"><p className="text-yellow-700 font-bold text-lg">{winner.scores.camera.toFixed(1)}/10</p><p className="text-yellow-700 text-xs font-semibold">Camera Score</p></div>
                            )}
                            {priority === 'Battery' && winner.scores?.battery && (
                              <div className="bg-orange-50 rounded-lg p-3"><p className="text-orange-700 font-bold text-lg">{winner.scores.battery.toFixed(1)}/10</p><p className="text-orange-700 text-xs font-semibold">Battery Score</p></div>
                            )}
                            {winner.baseSpecs && (
                              <div className="bg-yellow-50 rounded-lg p-3"><p className="text-yellow-700 font-bold text-lg">{winner.baseSpecs?.ram || 'N/A'}</p><p className="text-yellow-700 text-xs font-semibold">RAM</p></div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button onClick={() => window.location.href = `/details/${winner.slug}`} className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all">
                        View Full Details
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </LoadingError>
        )}

        {/* Info Cards */}
        {!submitted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: Flame,
                title: 'Gaming Performance',
                description: 'Processor speed, GPU power, refresh rate, and cooling system analysis',
                color: 'text-orange-600',
                bgColor: 'bg-orange-50'
              },
              {
                icon: Target,
                title: 'Camera Quality',
                description: 'Sensor quality, OIS, zoom capabilities, and video recording features',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50'
              },
              {
                icon: TrendingUp,
                title: 'Value for Money',
                description: 'Best performance-to-price ratio for your budget and needs',
                color: 'text-orange-600',
                bgColor: 'bg-orange-50'
              }
            ].map((info, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-200">
                <div className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <info.icon size={24} className={info.color} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{info.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{info.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
