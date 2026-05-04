import { useEffect, useState } from "react"
import { useAuth } from "../../../../shared/hooks/useAuth"
import { useProviderReviewsPresenter } from "../presenter/useProviderReviewsPresenter"
import { LoadingSpinner } from "../../../../components/LoadingSpinner"
import { useToast } from "../../../../shared/hooks/useToast"

/**
 * ProviderReviewsView - Display reviews of provider's services with response capability
 * Shows review statistics and allows provider to respond to customer reviews
 */
export const ProviderReviewsView = () => {
  const { userId } = useAuth()
  const presenter = useProviderReviewsPresenter()
  const { showToast } = useToast()
  const [selectedRating, setSelectedRating] = useState(null)
  const [respondingToId, setRespondingToId] = useState(null)
  const [responseText, setResponseText] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    if (userId) {
      presenter.loadReviews(userId)
      presenter.loadStats(userId)
    }
  }, [userId])

  const handleRespond = async (reviewId) => {
    if (!responseText.trim()) {
      showToast("Please enter a response", "error")
      return
    }

    const result = await presenter.respondToReview(reviewId, responseText.trim())
    if (result.success) {
      showToast("Response posted successfully", "success")
      setResponseText("")
      setRespondingToId(null)
    } else {
      showToast(result.error, "error")
    }
  }

  const handleFlagReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to flag this review?")) {
      const result = await presenter.flagReview(
        reviewId,
        "Inappropriate content"
      )
      if (result.success) {
        showToast("Review flagged successfully", "success")
      } else {
        showToast(result.error, "error")
      }
    }
  }

  const filteredReviews = selectedRating
    ? presenter.getReviewsByRating(selectedRating)
    : presenter.reviews

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdDate) - new Date(a.createdDate)
    } else if (sortBy === "highest") {
      return b.rating - a.rating
    } else if (sortBy === "lowest") {
      return a.rating - b.rating
    }
    return 0
  })

  if (presenter.loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Reviews & Ratings
          </h1>
          <p className="text-purple-700">
            Manage customer feedback and respond to reviews
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Average Rating</p>
            <p className="text-4xl font-bold text-purple-600 mb-2">
              {presenter.stats.averageRating?.toFixed(1) || "0.0"}
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-yellow-500">
                  {i <= Math.floor(presenter.stats.averageRating || 0)
                    ? "★"
                    : "☆"}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Total Reviews</p>
            <p className="text-4xl font-bold text-blue-600">
              {presenter.stats.totalReviews || 0}
            </p>
            <p className="text-gray-600 text-sm mt-2">From completed bookings</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">5-Star Reviews</p>
            <p className="text-4xl font-bold text-green-600">
              {presenter.stats.fiveStarCount || 0}
            </p>
            <p className="text-gray-600 text-sm mt-2">
              {presenter.stats.totalReviews > 0
                ? Math.round(
                    ((presenter.stats.fiveStarCount || 0) /
                      presenter.stats.totalReviews) *
                      100
                  )
                : 0}
              % of reviews
            </p>
          </div>
        </div>

        {/* Filter and Sort */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <div className="flex gap-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() =>
                  setSelectedRating(selectedRating === rating ? null : rating)
                }
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedRating === rating
                    ? "bg-yellow-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {rating} ★
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        {/* Error Display */}
        {presenter.error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
            {presenter.error}
          </div>
        )}

        {/* Reviews List */}
        {sortedReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No reviews yet</p>
            <p className="text-gray-500">
              Reviews will appear here once customers complete bookings
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* Review Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">
                        {review.customerName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {review.displayDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {review.ratingStars.map((star, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            star === "full"
                              ? "text-yellow-500"
                              : star === "half"
                              ? "text-yellow-300"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span
                        className={`ml-2 font-semibold ${review.ratingColor}`}
                      >
                        {review.rating}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-600 text-sm font-semibold">
                    {review.serviceName}
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {review.comment}
                </p>

                {/* Provider Response */}
                {review.providerResponse && (
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
                    <p className="text-sm font-semibold text-purple-900 mb-1">
                      Your Response:
                    </p>
                    <p className="text-gray-700">{review.providerResponse}</p>
                  </div>
                )}

                {/* Response Form */}
                {respondingToId === review.id ? (
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Write your response..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 mb-3"
                      rows="3"
                      maxLength="500"
                    />
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => {
                          setRespondingToId(null)
                          setResponseText("")
                        }}
                        className="px-3 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-semibold text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRespond(review.id)}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
                      >
                        Post Response
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    {!review.providerResponse && (
                      <button
                        onClick={() => setRespondingToId(review.id)}
                        className="px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors font-semibold text-sm"
                      >
                        Respond
                      </button>
                    )}
                    <button
                      onClick={() => handleFlagReview(review.id)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-semibold text-sm"
                    >
                      Flag
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
