import api from "../../../../services/api"

/**
 * ProviderReviewsModel - Handles API calls for provider review management
 * Retrieves reviews of provider's services and allows responding to reviews
 */

export const ProviderReviewsModel = {
  /**
   * Get all reviews for provider's services
   * Optionally filter by rating
   */
  getReviews: async (providerId, minRating = null) => {
    try {
      const params = { providerId }
      if (minRating) params.minRating = minRating
      const response = await api.get("/api/provider/reviews", { params })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load reviews",
      }
    }
  },

  /**
   * Get review statistics
   */
  getReviewStats: async (providerId) => {
    try {
      const response = await api.get("/api/provider/reviews/stats", {
        params: { providerId },
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load review stats",
      }
    }
  },

  /**
   * Respond to a review
   */
  respondToReview: async (reviewId, response) => {
    try {
      const result = await api.patch(`/api/provider/reviews/${reviewId}/respond`, {
        response,
      })
      return {
        success: true,
        data: result.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to respond to review",
      }
    }
  },

  /**
   * Flag a review as inappropriate
   */
  flagReview: async (reviewId, reason) => {
    try {
      const result = await api.post(`/api/provider/reviews/${reviewId}/flag`, {
        reason,
      })
      return {
        success: true,
        data: result.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to flag review",
      }
    }
  },
}
