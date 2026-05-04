/**
 * Provider Dashboard Feature - Model
 * Handles all API calls related to provider dashboard
 */
import api from "../../../../services/api"

export const ProviderDashboardModel = {
  /**
   * Get provider's dashboard stats
   */
  getProviderStats: async (providerId) => {
    try {
      const response = await api.get("/api/provider/dashboard/stats", {
        params: { providerId },
      })
      return {
        success: true,
        data: response.data || {
          totalBookings: 0,
          pendingBookings: 0,
          totalServices: 0,
          averageRating: 0,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load stats",
      }
    }
  },

  /**
   * Get provider's recent bookings
   */
  getRecentBookings: async (providerId) => {
    try {
      const response = await api.get("/api/provider/dashboard/recent-bookings", {
        params: { providerId },
      })
      return {
        success: true,
        data: response.data || [],
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load bookings",
      }
    }
  },

  /**
   * Get provider's earnings summary
   */
  getEarnings: async (providerId) => {
    try {
      const response = await api.get("/api/provider/earnings", {
        params: { providerId },
      })
      return {
        success: true,
        data: response.data || {
          totalEarnings: 0,
          thisMonthEarnings: 0,
          pendingEarnings: 0,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load earnings",
      }
    }
  },
}
