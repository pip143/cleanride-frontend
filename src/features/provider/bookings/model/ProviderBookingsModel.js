import api from "../../../../services/api"

/**
 * ProviderBookingsModel - Handles all API calls for provider booking management
 * Manages provider's incoming bookings: view, accept, reject, and mark as complete
 */

export const ProviderBookingsModel = {
  /**
   * Get all bookings for the provider
   * Optionally filter by status
   */
  getBookings: async (providerId, status = null) => {
    try {
      const params = { providerId }
      if (status) params.status = status
      const response = await api.get("/api/provider/bookings", { params })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load bookings",
      }
    }
  },

  /**
   * Get single booking details
   */
  getBooking: async (bookingId) => {
    try {
      const response = await api.get(`/api/provider/bookings/${bookingId}`)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load booking",
      }
    }
  },

  /**
   * Accept a booking request
   */
  acceptBooking: async (bookingId) => {
    try {
      const response = await api.patch(`/api/provider/bookings/${bookingId}/accept`)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to accept booking",
      }
    }
  },

  /**
   * Reject a booking request
   */
  rejectBooking: async (bookingId, reason = "") => {
    try {
      const response = await api.patch(
        `/api/provider/bookings/${bookingId}/reject`,
        { reason }
      )
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to reject booking",
      }
    }
  },

  /**
   * Mark booking as completed
   */
  completeBooking: async (bookingId, notes = "") => {
    try {
      const response = await api.patch(
        `/api/provider/bookings/${bookingId}/complete`,
        { notes }
      )
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to complete booking",
      }
    }
  },

  /**
   * Get booking statistics for provider
   */
  getBookingStats: async (providerId) => {
    try {
      const response = await api.get("/api/provider/bookings/stats", {
        params: { providerId },
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load stats",
      }
    }
  },
}
