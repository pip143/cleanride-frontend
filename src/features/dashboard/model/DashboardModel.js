/**
 * Dashboard Feature - Model
 * Handles all API calls related to dashboard
 * No UI logic, no React hooks
 */
import axiosInstance from "../../../core/api/axiosInstance"

const dashboardModel = {
  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    const response = await axiosInstance.get(`/api/users/${userId}/profile`)
    return response.data
  },

  /**
   * Get user's recent bookings
   */
  async getRecentBookings(userId, limit = 5) {
    const response = await axiosInstance.get(`/api/bookings/user/${userId}`, {
      params: { limit }
    })
    return response.data || []
  },

  /**
   * Get all available services for dashboard quick book
   */
  async getServices() {
    const response = await axiosInstance.get("/api/services")
    return response.data || []
  },

  /**
   * Get dashboard stats
   */
  async getDashboardStats(userId) {
    try {
      const [bookings, vehicles, profile] = await Promise.all([
        axiosInstance.get(`/api/bookings/user/${userId}`),
        axiosInstance.get(`/api/vehicles/user/${userId}`),
        axiosInstance.get(`/api/users/${userId}/profile`)
      ])

      const bookingsData = bookings.data || []
      const completedCount = bookingsData.filter(
        (b) => b.status === "COMPLETED" || b.status === "completed"
      ).length

      return {
        totalBookings: bookingsData.length,
        vehiclesCount: vehicles.data?.length || 0,
        completedServices: completedCount,
        userProfile: profile.data
      }
    } catch (error) {
      throw error
    }
  }
}

export default dashboardModel
