import { useState } from "react"
import { ProviderPaymentsModel } from "../model/ProviderPaymentsModel"
import { PAYMENT_METHODS } from "../../../../core/constants"

/**
 * useProviderPaymentsPresenter - Business logic for provider payments
 * Handles earnings calculations, payment formatting, and payout logic
 */
export const useProviderPaymentsPresenter = () => {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    pendingEarnings: 0,
    withdrawnEarnings: 0,
  })
  const [paymentHistory, setPaymentHistory] = useState([])
  const [payoutHistory, setPayoutHistory] = useState([])
  const [availableBalance, setAvailableBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Load all earnings data
   */
  const loadEarnings = async (providerId) => {
    setLoading(true)
    setError(null)
    try {
      const result = await ProviderPaymentsModel.getEarnings(providerId)
      if (result.success && result.data) {
        setEarnings(transformEarnings(result.data))
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
   * Load payment history
   */
  const loadPaymentHistory = async (providerId) => {
    try {
      const result = await ProviderPaymentsModel.getPaymentHistory(providerId)
      if (result.success && result.data) {
        setPaymentHistory(transformPayments(result.data))
      } else {
        setError(result.error)
      }
    } catch {
      setError("Failed to load payment history")
    }
  }

  /**
   * Load payout history
   */
  const loadPayoutHistory = async (providerId) => {
    try {
      const result = await ProviderPaymentsModel.getPayoutHistory(providerId)
      if (result.success && result.data) {
        setPayoutHistory(transformPayouts(result.data))
      }
    } catch (err) {
      console.error("Failed to load payout history:", err)
    }
  }

  /**
   * Request a payout
   */
  const requestPayout = async (providerId, amount, paymentMethod) => {
    try {
      if (amount > availableBalance) {
        return {
          success: false,
          error: "Amount exceeds available balance",
        }
      }

      const result = await ProviderPaymentsModel.requestPayout(
        amount,
        paymentMethod
      )
      if (result.success) {
        // Update available balance
        setAvailableBalance((prev) => prev - amount)
        // Reload payout history
        await loadPayoutHistory(providerId)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch {
      return { success: false, error: "Failed to request payout" }
    }
  }

  /**
   * Get available balance
   */
  const getAvailableBalance = async (providerId) => {
    try {
      const result = await ProviderPaymentsModel.getAvailableBalance(providerId)
      if (result.success && result.data) {
        setAvailableBalance(result.data.balance || 0)
      }
    } catch (err) {
      console.error("Failed to get balance:", err)
    }
  }

  /**
   * Transform raw earnings data
   */
  const transformEarnings = (rawEarnings) => ({
    totalEarnings: rawEarnings.totalEarnings || 0,
    thisMonthEarnings: rawEarnings.thisMonthEarnings || 0,
    pendingEarnings: rawEarnings.pendingEarnings || 0,
    withdrawnEarnings: rawEarnings.withdrawnEarnings || 0,
    displayTotal: `$${Number(rawEarnings.totalEarnings || 0).toFixed(2)}`,
    displayMonth: `$${Number(rawEarnings.thisMonthEarnings || 0).toFixed(2)}`,
    displayPending: `$${Number(rawEarnings.pendingEarnings || 0).toFixed(2)}`,
    displayWithdrawn: `$${Number(
      rawEarnings.withdrawnEarnings || 0
    ).toFixed(2)}`,
  })

  /**
   * Transform payment data for display.
   * The backend returns bookings for provider payments, so read booking/service fields.
   */
  const transformPayments = (rawPayments) => {
    return (rawPayments || []).map((payment) => {
      const service = payment.service || {}
      const amount = service.price || payment.amount || payment.price || 0
      const dateValue = payment.bookingDate || payment.createdAt || payment.date
      const displayDate = dateValue
        ? new Date(dateValue).toLocaleDateString()
        : "No date"
      const status = payment.paymentStatus || "UNPAID"

      return {
        ...payment,
        description: service.name
          ? `${service.name} Payment`
          : payment.description || "Service Payment",
        amount,
        status,
        displayAmount: `$${Number(amount).toFixed(2)}`,
        displayDate,
        statusColor: getPaymentStatusColor(status),
      }
    })
  }

  /**
   * Transform payout data for display
   */
  const transformPayouts = (rawPayouts) => {
    return (rawPayouts || []).map((payout) => ({
      ...payout,
      displayAmount: `$${Number(payout.amount || 0).toFixed(2)}`,
      displayDate: new Date(payout.requestDate).toLocaleDateString(),
      statusColor: getPayoutStatusColor(payout.status),
    }))
  }

  /**
   * Get color for payment status
   */
  const getPaymentStatusColor = (status) => {
    const colors = {
      completed: "text-green-600 bg-green-50",
      COMPLETED: "text-green-600 bg-green-50",
      PAID: "text-green-600 bg-green-50",
      pending: "text-yellow-600 bg-yellow-50",
      PENDING: "text-yellow-600 bg-yellow-50",
      UNPAID: "text-yellow-600 bg-yellow-50",
      CONFIRMED: "text-blue-600 bg-blue-50",
      failed: "text-red-600 bg-red-50",
    }
    return colors[status] || "text-gray-600 bg-gray-50"
  }

  /**
   * Get color for payout status
   */
  const getPayoutStatusColor = (status) => {
    const colors = {
      completed: "text-green-600 bg-green-50",
      COMPLETED: "text-green-600 bg-green-50",
      PAID: "text-green-600 bg-green-50",
      processing: "text-blue-600 bg-blue-50",
      pending: "text-yellow-600 bg-yellow-50",
      PENDING: "text-yellow-600 bg-yellow-50",
      UNPAID: "text-yellow-600 bg-yellow-50",
      CONFIRMED: "text-blue-600 bg-blue-50",
      failed: "text-red-600 bg-red-50",
    }
    return colors[status] || "text-gray-600 bg-gray-50"
  }

  return {
    // State
    earnings,
    paymentHistory,
    payoutHistory,
    availableBalance,
    loading,
    error,

    // Methods
    loadEarnings,
    loadPaymentHistory,
    loadPayoutHistory,
    requestPayout,
    getAvailableBalance,

    // Helpers
    getPaymentStatusColor,
    getPayoutStatusColor,
  }
}
