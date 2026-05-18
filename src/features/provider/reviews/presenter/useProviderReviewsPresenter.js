import { useState } from "react"
import { ProviderReviewsModel } from "../model/ProviderReviewsModel"

/**
 * useProviderReviewsPresenter - Business logic for provider review management
 * Handles data transformation, filtering, and response logic
 */
export const useProviderReviewsPresenter = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStarCount: 0,
    fourStarCount: 0,
    threeStarCount: 0,
    twoStarCount: 0,
    oneStarCount: 0,
  })

  /**
   * Load all reviews for provider
   */
  const loadReviews = async (providerId) => {
    setLoading(true)
    setError(null)
    try {
      const result = await ProviderReviewsModel.getReviews(providerId)
      if (result.success) {
        setReviews(transformReviews(result.data || []))
      } else {
        setError(result.error)
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load review statistics
   */
  const loadStats = async (providerId) => {
    try {
      const result = await ProviderReviewsModel.getReviewStats(providerId)
      if (result.success && result.data) {
        setStats(result.data)
      }
    } catch (err) {
      console.error("Failed to load review stats:", err)
    }
  }

  /**
   * Respond to a review
   */
  const respondToReview = async (reviewId, response) => {
    try {
      const result = await ProviderReviewsModel.respondToReview(reviewId, response)
      if (result.success) {
        // Update review in local state
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, providerResponse: response, hasResponded: true }
              : r
          )
        )
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch {
      return { success: false, error: "Failed to respond to review" }
    }
  }

  /**
   * Flag a review as inappropriate
   */
  const flagReview = async (reviewId, reason) => {
    try {
      const result = await ProviderReviewsModel.flagReview(reviewId, reason)
      if (result.success) {
        // Remove review from display
        setReviews((prev) => prev.filter((r) => r.id !== reviewId))
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch {
      return { success: false, error: "Failed to flag review" }
    }
  }

  /**
   * Get reviews by rating
   */
  const getReviewsByRating = (rating) => {
    return reviews.filter((r) => r.rating === rating)
  }

  /**
   * Transform raw review data
   */
  const transformReviews = (rawReviews) => {
    return rawReviews.map((review) => {
      const booking = review.booking || {}
      const service = review.service || booking.service || {}
      const customer = review.user || review.customer || booking.user || {}
      const createdAt = review.createdAt || review.createdDate || review.updatedAt

      return {
        ...review,
        customerName:
          review.customerName || customer.name || customer.fullName || customer.username || "Customer",
        serviceName:
          review.serviceName || service.name || service.serviceName || booking.serviceName || "Service",
        displayDate: formatDisplayDate(createdAt),
        ratingColor: getRatingColor(review.rating),
        ratingStars: generateStarArray(review.rating),
      }
    })
  }

  const formatDisplayDate = (value) => {
    if (!value) return "No date"
    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return "No date"

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  /**
   * Get color for rating
   */
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 3.5) return "text-blue-600"
    if (rating >= 2.5) return "text-yellow-600"
    return "text-red-600"
  }

  /**
   * Generate array of stars for display
   */
  const generateStarArray = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push("full")
      } else if (i - rating < 1) {
        stars.push("half")
      } else {
        stars.push("empty")
      }
    }
    return stars
  }

  return {
    // State
    reviews,
    loading,
    error,
    stats,

    // Methods
    loadReviews,
    loadStats,
    respondToReview,
    flagReview,
    getReviewsByRating,

    // Helpers
    getRatingColor,
    generateStarArray,
  }
}
