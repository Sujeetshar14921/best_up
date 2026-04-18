import React from 'react'
import { MessageSquare, Star } from 'lucide-react'
import { renderStars } from './utils.jsx'

export default function ReviewSection({
  reviewCount,
  reviewStats,
  reviewForm,
  onReviewFormChange,
  onReviewSubmit,
  reviewSubmitting,
  reviewError,
  reviewSuccess,
  recentReviews,
  reviewsLoading,
  helpfulLoadingId,
  onHelpfulVote
}) {
  return (
    <section className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">User Feedback</h2>
        <span className="text-sm text-gray-500 inline-flex items-center gap-1">
          <MessageSquare size={14} /> {reviewCount} total feedback
        </span>
      </div>

      <form onSubmit={onReviewSubmit} className="mb-6 rounded-2xl border border-gray-200 p-4 bg-gray-50 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm font-semibold text-gray-800">Rate this phone</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onReviewFormChange({ ...reviewForm, rating: n })}
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
          onChange={(e) => onReviewFormChange({ ...reviewForm, title: e.target.value })}
          placeholder="Review title"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
        <textarea
          value={reviewForm.content}
          onChange={(e) => onReviewFormChange({ ...reviewForm, content: e.target.value })}
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
                    onClick={() => onHelpfulVote(review._id, true)}
                    className="px-2 py-1 rounded-md border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-60"
                  >
                    Helpful ({review.helpfulCount || 0})
                  </button>
                  <button
                    type="button"
                    disabled={helpfulLoadingId === review._id}
                    onClick={() => onHelpfulVote(review._id, false)}
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
  )
}
