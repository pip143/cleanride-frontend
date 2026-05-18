/**
 * Bookings Feature - Model
 * Handles all booking API calls
 */
import axiosInstance from "../../../core/api/axiosInstance"

const bookingsModel = {
  /**
   * Get all bookings for a user
   */
  async getBookings(userId) {
    const response = await axiosInstance.get(`/api/bookings/user/${userId}`)
    return response.data || []
  },

  /**
   * Get a specific booking by ID
   */
  async getBooking(bookingId) {
    const response = await axiosInstance.get(`/api/bookings/${bookingId}`)
    return response.data
  },

  /**
   * Create a new booking
   */
  async createBooking(bookingData) {
    const response = await axiosInstance.post("/api/bookings", bookingData)
    return response.data
  },

  /**
   * Update a booking
   */
  async updateBooking(bookingId, bookingData) {
    const response = await axiosInstance.put(`/api/bookings/${bookingId}`, bookingData)
    return response.data
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId) {
    const response = await axiosInstance.put(
      `/api/bookings/${bookingId}/status`,
      null,
      { params: { status: "CANCELLED" } }
    )
    return response.data
  },

  /**
   * Mark a booking as paid
   */
  async payBooking(bookingId) {
    const response = await axiosInstance.patch(`/api/bookings/${bookingId}/pay`)
    return response.data
  },
  /**
   * Delete a booking
   */
  async deleteBooking(bookingId) {
    const response = await axiosInstance.delete(`/api/bookings/${bookingId}`)
    return response.data
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId, status) {
    const response = await axiosInstance.put(
      `/api/bookings/${bookingId}/status`,
      null,
      { params: { status } }
    )
    return response.data
  }
}

export default bookingsModel
