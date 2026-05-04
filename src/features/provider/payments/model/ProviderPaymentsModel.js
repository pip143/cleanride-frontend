import api from "../../../../services/api"

/**
 * ProviderPaymentsModel - Handles API calls for provider payment management
 * Manages earnings, payment history, and payout requests
 */

export const ProviderPaymentsModel = {
  /**
   * Get provider earnings summary
   */
  getEarnings: async (providerId) => {
    try {
      const response = await api.get("/api/provider/earnings", {
        params: { providerId },
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load earnings",
      }
    }
  },

  /**
   * Get payment history
   */
  getPaymentHistory: async (providerId, limit = 50, offset = 0) => {
    try {
      const response = await api.get("/api/provider/payments", {
        params: { providerId, limit, offset },
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load payment history",
      }
    }
  },

  /**
   * Request a payout
   */
  requestPayout: async (amount, paymentMethod) => {
    try {
      const response = await api.post("/api/provider/payouts/request", {
        amount,
        paymentMethod,
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to request payout",
      }
    }
  },

  /**
   * Get payout history
   */
  getPayoutHistory: async (providerId) => {
    try {
      const response = await api.get("/api/provider/payouts", {
        params: { providerId },
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load payout history",
      }
    }
  },

  /**
   * Get available balance for payout
   */
  getAvailableBalance: async (providerId) => {
    try {
      const response = await api.get("/api/provider/balance", {
        params: { providerId },
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load balance",
      }
    }
  },
}
