import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePhones } from '../context/PhoneContext'
import LoadingError from '../components/LoadingError'
import { reviewAPI, phonesAPI } from '../services/api'
import {
  PhoneImageSection,
  PhoneHeaderSection,
  ScoreBreakdownSection,
  VariantsSection,
  SpecsSection,
  ProConsSection,
  ReviewSection,
  DetailsCTASection
} from '../components/DetailsPage'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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

  // Load reviews for a phone
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

  // Fetch phone details on mount
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

  // Handle review submission
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

  // Handle helpful votes on reviews
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

  // Handle phone like/unlike
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

  // Loading states
  if (loading) return <LoadingError loading={true} />
  if (error) return <LoadingError error={error} />
  if (!phone) return <LoadingError error="Phone not found" />

  const reviewCount = Number(reviewStats.totalReviews || 0)
  const rating = Number(reviewStats.averageRating || (phone.scores?.valueForMoney || 0) / 2 || phone.rating || 4.5)
  const likeCount = Number(phone.likeCount || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Hero Section with Image and Header */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <PhoneImageSection phone={phone} />
          <div className="space-y-5">
            <PhoneHeaderSection
              phone={phone}
              rating={rating}
              reviewCount={reviewCount}
              likeCount={likeCount}
              phoneLiked={phoneLiked}
              likeUpdating={likeUpdating}
              onPhoneLike={handlePhoneLike}
            />
            <ScoreBreakdownSection phone={phone} />
          </div>
        </section>

        {/* Variants Section */}
        <VariantsSection phone={phone} />

        {/* Specs Section */}
        <SpecsSection phone={phone} />

        {/* Pros and Cons Section */}
        <ProConsSection phone={phone} />

        {/* Reviews Section */}
        <ReviewSection
          reviewCount={reviewCount}
          reviewStats={reviewStats}
          reviewForm={reviewForm}
          onReviewFormChange={setReviewForm}
          onReviewSubmit={handleReviewSubmit}
          reviewSubmitting={reviewSubmitting}
          reviewError={reviewError}
          reviewSuccess={reviewSuccess}
          recentReviews={recentReviews}
          reviewsLoading={reviewsLoading}
          helpfulLoadingId={helpfulLoadingId}
          onHelpfulVote={handleHelpfulVote}
        />

        {/* CTA Section */}
        <DetailsCTASection phone={phone} />
      </div>
    </div>
  )
}

