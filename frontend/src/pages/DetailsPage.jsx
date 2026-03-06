import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Zap, Camera, Battery, Smartphone, Share2, Heart, Star, Cpu, Gauge, CalendarDays, MessageSquare } from 'lucide-react'
import { usePhones } from '../context/PhoneContext'
import LoadingError from '../components/LoadingError'
import { reviewAPI } from '../services/api'
import { phonesAPI } from '../services/api'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_ROOT = API.replace(/\/api\/?$/, '')

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'N/A'
  return `INR ${Number(value).toLocaleString('en-IN')}`
}

const scoreText = (score) => {
  if (score >= 4.5) return 'Excellent'
  if (score >= 4) return 'Very Good'
  if (score >= 3.2) return 'Good'
  return 'Average'
}

const getUseCases = (scores = {}) => {
  const mapping = [
    { key: 'gaming', label: 'Gaming', icon: 'Performance first' },
    { key: 'camera', label: 'Photography', icon: 'Camera lovers' },
    { key: 'battery', label: 'Heavy daily use', icon: 'Long battery life' },
    { key: 'display', label: 'Media and streaming', icon: 'Display quality' },
    { key: 'valueForMoney', label: 'Budget-smart buyers', icon: 'Best value' },
  ]

  return mapping
    .map((m) => ({ ...m, value: Number(scores[m.key] || 0) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
}

export default function DetailsPage() {
  const { slug } = useParams()
  const { loading, error } = usePhones()
  const [phone, setPhone] = useState(null)
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    totalHelpful: 0,
    positiveFeedbackRate: 0,
  })
  const [recentReviews, setRecentReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState('')
  const [helpfulLoadingId, setHelpfulLoadingId] = useState(null)
  const [likeUpdating, setLikeUpdating] = useState(false)
  const [phoneLiked, setPhoneLiked] = useState(false)

  const authToken = localStorage.getItem('bestup_token')

  const loadReviews = async (phoneId) => {
    if (!phoneId) return

    try {
      setReviewsLoading(true)
      const reviewResponse = await reviewAPI.getPhoneReviews(phoneId, {
        limit: 5,
        sortBy: '-createdAt'
      })
      const payload = reviewResponse?.data?.data || {}
      setReviewStats(payload.stats || {
        averageRating: 0,
        totalReviews: 0,
        totalHelpful: 0,
        positiveFeedbackRate: 0,
      })
      setRecentReviews(payload.reviews || [])
    } catch (reviewErr) {
      setReviewStats({
        averageRating: 0,
        totalReviews: 0,
        totalHelpful: 0,
        positiveFeedbackRate: 0,
      })
      setRecentReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const response = await fetch(`${API}/phones/${slug}`)
        const data = await response.json()
        const nextPhone = data.data || data
        setPhone(nextPhone)
        await loadReviews(nextPhone?._id)
      } catch (err) {
        console.error('Failed to fetch phone:', err)
      }
    }
    if (slug) fetchPhone()
  }, [slug])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    if (!authToken) {
      setReviewError('Please login first to submit your feedback.')
      return
    }

    if (!phone?._id) return

    const cleanTitle = reviewForm.title.trim()
    const cleanContent = reviewForm.content.trim()
    const numericRating = Number(reviewForm.rating)

    if (!cleanTitle || cleanTitle.length < 5) {
      setReviewError('Review title must be at least 5 characters.')
      return
    }

    if (!cleanContent || cleanContent.length < 10) {
      setReviewError('Feedback must be at least 10 characters.')
      return
    }

    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      setReviewError('Please choose a valid rating between 1 and 5.')
      return
    }

    try {
      setReviewSubmitting(true)
      setReviewError('')
      setReviewSuccess('')

      await reviewAPI.addReview({
        phoneId: phone._id,
        rating: numericRating,
        title: cleanTitle,
        content: cleanContent
      })

      setReviewSuccess('Thanks! Your feedback has been submitted.')
      setReviewForm({ rating: 5, title: '', content: '' })
      await loadReviews(phone._id)
    } catch (err) {
      const details = err.response?.data?.errors
      const detailMessage = Array.isArray(details) ? details.join(' | ') : ''
      const message = detailMessage || err.response?.data?.message || err.response?.data?.error || 'Failed to submit feedback'
      setReviewError(message)
    } finally {
      setReviewSubmitting(false)
    }
  }

  const handleHelpfulVote = async (reviewId, helpful = true) => {
    if (!authToken) {
      setReviewError('Please login first to react to feedback.')
      return
    }

    try {
      setHelpfulLoadingId(reviewId)
      await reviewAPI.markHelpful(reviewId, helpful)

      setRecentReviews((prev) =>
        prev.map((review) => {
          if (review._id !== reviewId) return review
          return {
            ...review,
            helpfulCount: helpful
              ? Number(review.helpfulCount || 0) + 1
              : Number(review.helpfulCount || 0),
            notHelpfulCount: helpful
              ? Number(review.notHelpfulCount || 0)
              : Number(review.notHelpfulCount || 0) + 1,
          }
        })
      )

      if (helpful) {
        setReviewStats((prev) => ({
          ...prev,
          totalHelpful: Number(prev.totalHelpful || 0) + 1,
        }))
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Could not save your reaction'
      setReviewError(message)
    } finally {
      setHelpfulLoadingId(null)
    }
  }

  const handlePhoneLike = async () => {
    if (!authToken) {
      setReviewError('Please login first to like this phone.')
      return
    }

    if (!phone?._id || likeUpdating) return

    try {
      setLikeUpdating(true)
      const response = await phonesAPI.toggleLike(phone._id)
      const nextLiked = Boolean(response.data?.data?.liked)
      const nextLikeCount = Number(response.data?.data?.likeCount || 0)

      setPhoneLiked(nextLiked)
      setPhone((prev) => (prev ? { ...prev, likeCount: nextLikeCount } : prev))
    } catch (err) {
      const message = err.response?.data?.message || 'Could not update like right now'
      setReviewError(message)
    } finally {
      setLikeUpdating(false)
    }
  }

  if (loading) return <LoadingError loading={true} />
  if (error) return <LoadingError error={error} />
  if (!phone) return <LoadingError error="Phone not found" />

  const specs = phone.specs || {}
  const rating = Number(reviewStats.averageRating || (phone.scores?.valueForMoney || 0) / 2 || phone.rating || 4.5)
  const reviewCount = Number(reviewStats.totalReviews || 0)
  const likeCount = Number(phone.likeCount || 0)
  const useCases = getUseCases(phone.scores || {})
  const pros = phone.pros || phone.highlights?.pros || []
  const cons = phone.cons || phone.highlights?.cons || []
  const variants = Array.isArray(phone.variants) ? phone.variants : []
  const variantPrices = variants.map((v) => v.price).filter(Boolean)
  const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : phone.basePrice
  const maxPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : phone.basePrice

  const quickFacts = [
    { label: 'Launch', value: phone.releaseDate ? new Date(phone.releaseDate).toLocaleDateString('en-IN') : 'Not available', icon: CalendarDays },
    { label: 'Processor', value: specs.performance?.processor || 'Not specified', icon: Cpu },
    { label: 'Battery', value: specs.battery?.capacity ? `${specs.battery.capacity} mAh` : 'Not specified', icon: Battery },
    { label: 'Refresh Rate', value: specs.display?.refreshRate ? `${specs.display.refreshRate} Hz` : 'Not specified', icon: Smartphone },
  ]

  const renderStars = (value) => {
    const rounded = Math.max(0, Math.min(5, Number(value || 0)))
    return [1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={16}
        className={n <= rounded ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Link to="/phones" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Phones
        </Link>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
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

          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <p className="text-xs uppercase tracking-wider font-semibold text-yellow-700">{phone.brand}</p>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">{phone.name}</h1>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-100 border border-yellow-200 text-yellow-800 font-semibold text-sm">
                  <span className="inline-flex items-center gap-1">{renderStars(rating)}</span>
                  {rating.toFixed(1)} / 5
                </span>
                <span className="text-sm text-gray-600">
                  {scoreText(rating)}
                  {reviewCount > 0 ? ` • ${reviewCount} reviews` : ''}
                </span>
                <span className="text-sm text-gray-600">• {likeCount} likes</span>
              </div>

              <div className="mt-7">
                <p className="text-sm text-gray-500">Price range</p>
                <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                  {formatCurrency(minPrice)}
                  {maxPrice && maxPrice !== minPrice ? ` - ${formatCurrency(maxPrice)}` : ''}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {quickFacts.map((fact) => (
                  <div key={fact.label} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-gray-600 text-xs font-semibold uppercase tracking-wide">
                      <fact.icon size={14} className="text-yellow-700" />
                      {fact.label}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">{fact.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handlePhoneLike}
                  disabled={likeUpdating}
                  className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 border transition-all ${
                    phoneLiked
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'
                  } ${likeUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <Heart size={18} className="fill-current" />
                  {likeCount} Likes
                </button>
                <button className="px-5 py-3 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-200">
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>

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
                      <span className="inline-flex items-center gap-2 text-gray-700 font-medium"><stat.icon size={14} className="text-yellow-700" />{stat.label}</span>
                      <span className="font-bold text-gray-900">{Number(stat.value).toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500" style={{ width: `${Math.max(0, Math.min(100, Number(stat.value) * 10))}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {variants.length > 0 && (
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
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <SpecPanel
            title="Display"
            items={[
              { label: 'Size', value: specs.display?.size },
              { label: 'Resolution', value: specs.display?.resolution },
              { label: 'Refresh Rate', value: specs.display?.refreshRate ? `${specs.display.refreshRate} Hz` : null },
              { label: 'Brightness', value: specs.display?.brightness ? `${specs.display.brightness} nits` : null },
            ]}
          />
          <SpecPanel
            title="Performance"
            items={[
              { label: 'Processor', value: specs.performance?.processor },
              { label: 'GPU', value: specs.performance?.gpu },
              { label: 'AnTuTu Score', value: specs.performance?.antutuScore ? Number(specs.performance.antutuScore).toLocaleString('en-IN') : null },
              { label: 'RAM Options', value: Array.isArray(specs.performance?.ramOptions) && specs.performance.ramOptions.length > 0 ? `${specs.performance.ramOptions.join(', ')} GB` : null },
            ]}
          />
          <SpecPanel
            title="Camera"
            items={[
              { label: 'Rear Main', value: specs.camera?.rear?.main?.megapixels ? `${specs.camera.rear.main.megapixels} MP` : null },
              { label: 'Ultra-wide', value: specs.camera?.rear?.ultraWide?.megapixels ? `${specs.camera.rear.ultraWide.megapixels} MP` : null },
              { label: 'Telephoto', value: specs.camera?.rear?.telephoto?.megapixels ? `${specs.camera.rear.telephoto.megapixels} MP` : null },
              { label: 'Front', value: specs.camera?.front?.megapixels ? `${specs.camera.front.megapixels} MP` : null },
            ]}
          />
          <SpecPanel
            title="Battery & Extras"
            items={[
              { label: 'Capacity', value: specs.battery?.capacity ? `${specs.battery.capacity} mAh` : null },
              { label: 'Charging', value: specs.battery?.chargingSpeed ? `${specs.battery.chargingSpeed} W` : null },
              { label: 'Wireless Charging', value: specs.battery?.wirelessCharging ? 'Yes' : 'No' },
              { label: 'OS', value: specs.os || null },
            ]}
          />
        </section>

        {(pros.length > 0 || cons.length > 0) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-green-200 p-6">
              <h3 className="text-xl font-bold text-green-700 mb-4">What users may like</h3>
              {pros.length > 0 ? (
                <ul className="space-y-3 text-sm">
                  {pros.map((pro, idx) => (
                    <li key={idx} className="text-gray-700">+ {pro}</li>
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
                    <li key={idx} className="text-gray-700">- {con}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No cons listed yet.</p>
              )}
            </div>
          </section>
        )}

        <section className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">User Feedback</h2>
            <span className="text-sm text-gray-500 inline-flex items-center gap-1">
              <MessageSquare size={14} /> {reviewCount} total feedback
            </span>
          </div>

          <form onSubmit={handleReviewSubmit} className="mb-6 rounded-2xl border border-gray-200 p-4 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm font-semibold text-gray-800">Rate this phone</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setReviewForm((prev) => ({ ...prev, rating: n }))}
                    className="p-0.5"
                  >
                    <Star
                      size={18}
                      className={n <= Number(reviewForm.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={reviewForm.title}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Review title"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <textarea
              value={reviewForm.content}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write your feedback"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-gray-500">Your feedback helps improve ratings and recommendations.</p>
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 disabled:opacity-60"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
            {reviewError && <p className="text-sm text-red-600">{reviewError}</p>}
            {reviewSuccess && <p className="text-sm text-green-700">{reviewSuccess}</p>}
          </form>

          {reviewsLoading ? (
            <p className="text-sm text-gray-500">Loading user feedback...</p>
          ) : recentReviews.length === 0 ? (
            <p className="text-sm text-gray-500">No user feedback available yet.</p>
          ) : (
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review._id} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-gray-900 line-clamp-1">{review.title}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                      {renderStars(review.rating)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{review.content}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500 gap-3 flex-wrap">
                    <span>by {review.userId?.name || 'User'}</span>
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        disabled={helpfulLoadingId === review._id}
                        onClick={() => handleHelpfulVote(review._id, true)}
                        className="px-2 py-1 rounded-md border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-60"
                      >
                        Helpful ({review.helpfulCount || 0})
                      </button>
                      <button
                        type="button"
                        disabled={helpfulLoadingId === review._id}
                        onClick={() => handleHelpfulVote(review._id, false)}
                        className="px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                      >
                        Not Helpful
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-xs text-gray-500">
                Positive feedback rate: {reviewStats.positiveFeedbackRate || 0}%
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 text-white p-8 md:p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Need a final decision?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Compare this phone with others and shortlist what matches your budget and usage style.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/compare?preselect=${encodeURIComponent(phone._id || '')}&preselectSlug=${encodeURIComponent(phone.slug || '')}`}
              className="px-6 py-3 rounded-xl font-bold bg-white text-orange-600 hover:opacity-90 transition-opacity"
            >
              Compare Phones
            </Link>
            <Link to="/phones" className="px-6 py-3 rounded-xl font-bold border border-white/70 bg-white/10 hover:bg-white/20 transition-colors">
              Explore More Phones
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

function SpecPanel({ title, items }) {
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

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900 font-bold">{value}</span>
    </div>
  )
}

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
