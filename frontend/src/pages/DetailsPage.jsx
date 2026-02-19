import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Zap, Camera, Battery, Smartphone, Share2, Heart, Star, Cpu, Gauge, Wifi, Phone as PhoneIcon, TrendingUp, Shield, Droplet } from 'lucide-react'
import { usePhones } from '../context/PhoneContext'
import LoadingError from '../components/LoadingError'

export default function DetailsPage() {
  const { slug } = useParams()
  const { loading, error } = usePhones()
  const [phone, setPhone] = useState(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/phones/${slug}`)
        const data = await response.json()
        setPhone(data.data || data)
      } catch (err) {
        console.error('Failed to fetch phone:', err)
      }
    }
    if (slug) fetchPhone()
  }, [slug])

  if (loading) return <LoadingError loading={true} />
  if (error) return <LoadingError error={error} />
  if (!phone) return <LoadingError error="Phone not found" />

  const specs = phone.specs || {}
  const rating = phone.rating || 4.5
  const reviewCount = phone.reviewCount || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      {/* Hero Section with Image */}
      <div className="bg-gradient-to-br from-white via-yellow-50 to-orange-50 relative overflow-hidden pt-8 pb-20 px-4 border-b border-gray-200">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Back Button */}
          <Link to="/phones" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Phones
          </Link>

          {/* Hero Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <div className="flex justify-center items-center">
              {phone.imageId ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 blur-3xl opacity-20 rounded-full"></div>
                  <img
                    src={`http://localhost:5000/api/phones/admin/phones/${phone._id}/image`}
                    alt={phone.name}
                    className="relative max-w-sm h-auto rounded-3xl shadow-2xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-64 h-96 bg-gray-200 rounded-3xl shadow-2xl flex items-center justify-center">
                  <PhoneIcon size={100} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="text-gray-900 space-y-6">
              <div>
                <p className="text-yellow-600 font-semibold uppercase tracking-wider text-sm mb-2">{phone.brand}</p>
                <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight text-gray-900">{phone.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-xl border border-yellow-200">
                    <Star size={20} className="fill-yellow-500 text-yellow-500" />
                    <span className="font-bold text-gray-900">{rating}</span>
                    {reviewCount > 0 && <span className="text-sm text-gray-600">({reviewCount} reviews)</span>}
                  </div>
                </div>

                {/* Price Section */}
                <div className="space-y-2 mb-8">
                  <p className="text-gray-600 text-lg">Starting at</p>
                  <p className="text-5xl font-black bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                    ₹{(phone.basePrice / 100000).toFixed(1)}L
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              {phone.scores && (
                <div className="grid grid-cols-2 gap-3 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                  {[
                    { icon: Zap, label: 'Performance', value: phone.scores.gaming, color: 'from-yellow-500' },
                    { icon: Camera, label: 'Camera', value: phone.scores.camera, color: 'from-yellow-500' },
                    { icon: Battery, label: 'Battery', value: phone.scores.battery, color: 'from-yellow-500' },
                    { icon: Gauge, label: 'Value', value: phone.scores.valueForMoney, color: 'from-yellow-500' }
                  ].map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <stat.icon size={16} className="text-yellow-600" />
                        <span className="text-xs font-semibold text-gray-700">{stat.label}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${stat.color} to-orange-500`}
                          style={{ width: `${(stat.value / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    liked
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200'
                  }`}
                >
                  <Heart size={20} className={liked ? 'fill-current' : ''} />
                  {liked ? 'Liked' : 'Like'}
                </button>
                <button className="px-6 py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-200">
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full mb-4">
            <TrendingUp size={18} />
            <span className="font-semibold text-sm">Complete Details</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Detailed Specifications</h2>
          <p className="text-gray-600 text-lg max-w-2xl">Complete breakdown of all the technical specifications and features</p>
        </div>

        {/* Spec Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display Card */}
          {specs.display && (
            <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Display</h3>
                <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <Smartphone size={24} className="text-yellow-600" />
                </div>
              </div>
              <div className="space-y-4">
                {specs.display.size && (
                  <SpecCard label="Screen Size" value={`${specs.display.size}"`} icon="📏" />
                )}
                {specs.display.type && (
                  <SpecCard label="Technology" value={specs.display.type} icon="💫" />
                )}
                {specs.display.resolution && (
                  <SpecCard label="Resolution" value={specs.display.resolution} icon="🎯" />
                )}
                {specs.display.refreshRate && (
                  <SpecCard label="Refresh Rate" value={`${specs.display.refreshRate}Hz`} icon="⚡" />
                )}
              </div>
            </div>
          )}

          {/* Performance Card */}
          {specs.performance && (
            <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Performance</h3>
                <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <Cpu size={24} className="text-yellow-600" />
                </div>
              </div>
              <div className="space-y-4">
                {specs.performance.chipset && (
                  <SpecCard label="Processor" value={specs.performance.chipset} icon="🚀" />
                )}
                {specs.performance.cpu && (
                  <SpecCard label="CPU" value={specs.performance.cpu} icon="⚙️" />
                )}
                {specs.performance.gpu && (
                  <SpecCard label="GPU" value={specs.performance.gpu} icon="🎮" />
                )}
                {specs.performance.antutuScore && (
                  <SpecCard label="AnTuTu Score" value={specs.performance.antutuScore.toLocaleString()} icon="📊" />
                )}
              </div>
            </div>
          )}

          {/* Camera Card */}
          {specs.camera && (
            <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Camera</h3>
                <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <Camera size={24} className="text-yellow-600" />
                </div>
              </div>
              <div className="space-y-4">
                {specs.camera.rear?.main?.megapixels && (
                  <SpecCard label="Rear Main" value={`${specs.camera.rear.main.megapixels}MP`} icon="📷" />
                )}
                {specs.camera.rear?.ultraWide?.megapixels && (
                  <SpecCard label="Ultra Wide" value={`${specs.camera.rear.ultraWide.megapixels}MP`} icon="🌅" />
                )}
                {specs.camera.rear?.telephoto?.megapixels && (
                  <SpecCard label="Telephoto" value={`${specs.camera.rear.telephoto.megapixels}MP`} icon="🔭" />
                )}
                {specs.camera.front?.megapixels && (
                  <SpecCard label="Selfie Camera" value={`${specs.camera.front.megapixels}MP`} icon="🤳" />
                )}
              </div>
            </div>
          )}

          {/* Battery Card */}
          {specs.battery && (
            <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Battery</h3>
                <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <Battery size={24} className="text-yellow-600" />
                </div>
              </div>
              <div className="space-y-4">
                {specs.battery.capacity && (
                  <SpecCard label="Capacity" value={`${specs.battery.capacity.toLocaleString()}mAh`} icon="🔋" />
                )}
                {specs.battery.charging?.wired && (
                  <SpecCard label="Wired Charging" value={`${specs.battery.charging.wired}W`} icon="⚡" />
                )}
                {specs.battery.wirelessCharging && (
                  <SpecCard label="Wireless Charging" value="Yes" icon="📡" />
                )}
              </div>
            </div>
          )}

          {/* Storage Card */}
          {specs.storage && specs.storage.length > 0 && (
            <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Storage</h3>
                <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <Smartphone size={24} className="text-yellow-600" />
                </div>
              </div>
              <div className="space-y-4">
                {specs.storage.map((storage, idx) => (
                  <SpecCard key={idx} label={`Option ${idx + 1}`} value={typeof storage === 'string' ? storage : `${storage}GB`} icon="💾" />
                ))}
              </div>
            </div>
          )}

          {/* Connectivity Card */}
          {specs.connectivity && (
            <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Connectivity</h3>
                <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <Wifi size={24} className="text-yellow-600" />
                </div>
              </div>
              <div className="space-y-4">
                {specs.connectivity.network && specs.connectivity.network.length > 0 && (
                  <SpecCard label="Networks" value={specs.connectivity.network.join(', ')} icon="📡" />
                )}
                {specs.connectivity.nfc && (
                  <SpecCard label="NFC" value="Yes" icon="📲" />
                )}
                {specs.connectivity.headphoneJack && (
                  <SpecCard label="3.5mm Jack" value="Yes" icon="🎧" />
                )}
              </div>
            </div>
          )}

          {/* Body Card */}
          {specs.body && (
            <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Build</h3>
                <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <Shield size={24} className="text-yellow-600" />
                </div>
              </div>
              <div className="space-y-4">
                {specs.body.weight && (
                  <SpecCard label="Weight" value={`${specs.body.weight}g`} icon="⚖️" />
                )}
                {specs.body.ipRating && (
                  <SpecCard label="IP Rating" value={specs.body.ipRating} icon={<Droplet size={18} />} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Highlights Section */}
      {phone.highlights && (
        <div className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full mb-4">
                <Star size={18} />
                <span className="font-semibold text-sm">Key Highlights</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Highlights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pros */}
              {phone.highlights.pros && phone.highlights.pros.length > 0 && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
                  <h3 className="text-2xl font-bold text-yellow-700 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg">
                      <span className="text-lg">✓</span>
                    </div>
                    Pros
                  </h3>
                  <ul className="space-y-4">
                    {phone.highlights.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full">
                          <span className="text-white font-bold text-sm">+</span>
                        </div>
                        <span className="text-gray-700 font-medium">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {phone.highlights.cons && phone.highlights.cons.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border border-orange-200">
                  <h3 className="text-2xl font-bold text-orange-700 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-lg">
                      <span className="text-lg">✗</span>
                    </div>
                    Cons
                  </h3>
                  <ul className="space-y-4">
                    {phone.highlights.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 p-1.5 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full">
                          <span className="text-white font-bold text-sm">-</span>
                        </div>
                        <span className="text-gray-700 font-medium">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 relative overflow-hidden text-white py-20 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-48 h-48 bg-white rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-white rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to buy?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Check out the best deals and compare with other phones to make the perfect choice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/compare"
              className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:shadow-2xl transition-all hover:scale-105"
            >
              Compare Phones
            </Link>
            <Link
              to="/recommend"
              className="px-8 py-4 bg-white/20 text-white border-2 border-white rounded-xl font-bold hover:bg-white/30 transition-all"
            >
              Get Recommendations
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Spec Card Component
function SpecCard({ label, value, icon }) {
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

// Helper Component (kept for compatibility if needed)
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900 font-bold">{value}</span>
    </div>
  )
}
