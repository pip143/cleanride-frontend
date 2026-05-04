/**
 * Reviews Feature - Presenter
 */
import reviewsModel from "../model/ReviewsModel"

class ReviewsPresenter {
  /**
   * Load user reviews
   */
  async loadUserReviews(userId) {
    try {
      const reviews = await reviewsModel.getReviews(userId)
      return {
        success: true,
        data: this.transformReviews(reviews),
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to load reviews"
      }
    }
  }

  /**
   * Create review
   */
  async createReview(reviewData) {
    try {
      const result = await reviewsModel.createReview(reviewData)
      return {
        success: true,
        data: result,
        message: "Review submitted successfully",
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || error.response?.data?.message || "Failed to submit review"
      }
    }
  }

  /**
   * Update review
   */
  async updateReview(reviewId, reviewData) {
    try {
      const result = await reviewsModel.updateReview(reviewId, reviewData)
      return {
        success: true,
        data: result,
        message: "Review updated successfully",
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to update review"
      }
    }
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId) {
    try {
      const result = await reviewsModel.deleteReview(reviewId)
      return {
        success: true,
        data: result,
        message: "Review deleted successfully",
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to delete review"
      }
    }
  }

  /**
   * Transform reviews
   */
  transformReviews(reviews) {
    return reviews.map((review) => ({
      ...review,
      formattedDate: this.formatDate(review.createdAt),
      ratingDisplay: this.getRatingDisplay(review.rating),
      isEditable: false
    }))
  }

  /**
   * Format date
   */
  formatDate(date) {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  /**
   * Get rating display (stars)
   */
  getRatingDisplay(rating) {
    if (!rating) return ""
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating)
    return stars
  }

  /**
   * Check if review is editable (within 7 days)
   */
  isReviewEditable(review) {
    if (!review.createdAt) return false
    const createdDate = new Date(review.createdAt)
    const now = new Date()
    const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7
  }

  /**
   * Validate review data
   */
  validateReview(data) {
    const errors = {}

    if (!data.bookingId) errors.bookingId = "Booking is required"
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errors.rating = "Rating must be between 1 and 5"
    }
    if (!data.comment || data.comment.trim().length < 10) {
      errors.comment = "Comment must be at least 10 characters"
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Get star options
   */
  getStarOptions() {
    return [
      { value: 5, label: "★★★★★ Excellent" },
      { value: 4, label: "★★★★☆ Good" },
      { value: 3, label: "★★★☆☆ Average" },
      { value: 2, label: "★★☆☆☆ Poor" },
      { value: 1, label: "★☆☆☆☆ Very Poor" }
    ]
  }
}

export default new ReviewsPresenter()
