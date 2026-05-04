/**
 * Reviews Feature - Model
 */
import axiosInstance from "../../../core/api/axiosInstance"

const reviewsModel = {
  /**
   * Get reviews for a user
   */
  async getReviews(userId) {
    const response = await axiosInstance.get(`/api/reviews/user/${userId}`)
    return response.data || []
  },

  /**
   * Get reviews for a booking
   */
  async getBookingReview(bookingId) {
    const response = await axiosInstance.get(`/api/reviews/booking/${bookingId}`)
    return response.data
  },

  /**
   * Create a review
   */
  async createReview(reviewData) {
    const response = await axiosInstance.post(`/api/reviews/${reviewData.bookingId}`, {
      rating: reviewData.rating,
      comment: reviewData.comment,
    })
    return response.data
  },

  /**
   * Update a review
   */
  async updateReview(reviewId, reviewData) {
    const response = await axiosInstance.put(`/api/reviews/${reviewId}`, reviewData)
    return response.data
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId) {
    const response = await axiosInstance.delete(`/api/reviews/${reviewId}`)
    return response.data
  }
}

export default reviewsModel
