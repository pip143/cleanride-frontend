import { useState } from "react"
import { ProviderBookingsModel } from "../model/ProviderBookingsModel"
import { BOOKING_STATUSES } from "../../../../core/constants"

/**
 * useProviderBookingsPresenter - Business logic for provider bookings management
 * Handles data transformation, filtering, and status management
 */
export const useProviderBookingsPresenter = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    rejected: 0,
  })

  /**
   * Load all bookings for the provider
   */
  const loadBookings = async (providerId, status = null) => {
    setLoading(true)
    setError(null)
    try {
      const result = await ProviderBookingsModel.getBookings(providerId, status)
      if (result.success) {
        setBookings(transformBookings(result.data || []))
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
   * Load stats for the dashboard
   */
  const loadStats = async (providerId) => {
    try {
      const result = await ProviderBookingsModel.getBookingStats(providerId)
      if (result.success && result.data) {
        setStats(result.data)
      }
    } catch (err) {
      console.error("Failed to load booking stats:", err)
    }
  }

  /**
   * Accept a booking request
   */
  const acceptBooking = async (bookingId) => {
    try {
      const result = await ProviderBookingsModel.acceptBooking(bookingId)
      if (result.success) {
        // Update local bookings
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: BOOKING_STATUSES.ACCEPTED } : b
          )
        )
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch {
      return { success: false, error: "Failed to accept booking" }
    }
  }

  /**
   * Reject a booking request
   */
  const rejectBooking = async (bookingId, reason = "") => {
    try {
      const result = await ProviderBookingsModel.rejectBooking(bookingId, reason)
      if (result.success) {
        // Update local bookings
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: BOOKING_STATUSES.REJECTED } : b
          )
        )
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch {
      return { success: false, error: "Failed to reject booking" }
    }
  }

  /**
   * Mark booking as completed
   */
  const completeBooking = async (bookingId, notes = "") => {
    try {
      const result = await ProviderBookingsModel.completeBooking(bookingId, notes)
      if (result.success) {
        // Update local bookings
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: BOOKING_STATUSES.COMPLETED } : b
          )
        )
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch {
      return { success: false, error: "Failed to complete booking" }
    }
  }
  /**
   * Mark a booking as paid, usually after receiving cash
   */
  const markBookingPaid = async (bookingId) => {
    try {
      const result = await ProviderBookingsModel.markBookingPaid(bookingId)
      if (result.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, paymentStatus: "PAID", isPaid: true } : b
          )
        )
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch {
      return { success: false, error: "Failed to mark booking as paid" }
    }
  }

  /**
   * Get bookings by status
   */
  const getBookingsByStatus = (status) => {
    return bookings.filter((b) => b.status === status)
  }

  /**
   * Transform raw bookings data for display
   */
  const transformBookings = (rawBookings) => {
    return rawBookings.map((booking) => {
      const normalizedStatus = normalizeStatus(booking.status)
      const service = booking.service || {}
      const customer = booking.user || {}
      const vehicle = booking.vehicle || {}
      const bookingDateTime = booking.bookingDate
        ? new Date(`${booking.bookingDate}T${booking.bookingTime || "00:00"}`)
        : null

      return {
        ...booking,
        status: normalizedStatus,
        customerName: customer.name || customer.username || "Customer",
        serviceName: service.name || "Service",
        vehicleType: vehicle.vehicleType || vehicle.licensePlate || vehicle.plateNumber || "Vehicle",
        duration: service.duration ? `${service.duration} min` : "N/A",
        paymentStatus: booking.paymentStatus || "UNPAID",
        isPaid: (booking.paymentStatus || "UNPAID") === "PAID",
        displayPrice: `PHP ${Number(service.price || booking.price || 0).toFixed(2)}`,
        displayDate: bookingDateTime ? bookingDateTime.toLocaleDateString() : "No date",
        displayTime: bookingDateTime
          ? bookingDateTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "No time",
        statusColor: getStatusColor(normalizedStatus),
      }
    })
  }

  const normalizeStatus = (status) => {
    const statusMap = {
      CONFIRMED: BOOKING_STATUSES.ACCEPTED,
      CANCELLED: BOOKING_STATUSES.REJECTED,
    }
    return statusMap[status] || status
  }

  /**
   * Get color for booking status for UI display
   */
  const getStatusColor = (status) => {
    const colors = {
      [BOOKING_STATUSES.PENDING]: "bg-yellow-100 text-yellow-800",
      [BOOKING_STATUSES.ACCEPTED]: "bg-blue-100 text-blue-800",
      [BOOKING_STATUSES.COMPLETED]: "bg-green-100 text-green-800",
      [BOOKING_STATUSES.REJECTED]: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  /**
   * Get icon class for status
   */
  const getStatusIcon = (status) => {
    const icons = {
      [BOOKING_STATUSES.PENDING]: "Clock",
      [BOOKING_STATUSES.ACCEPTED]: "CheckCircle",
      [BOOKING_STATUSES.COMPLETED]: "CheckCircle2",
      [BOOKING_STATUSES.REJECTED]: "XCircle",
    }
    return icons[status] || "Circle"
  }

  return {
    // State
    bookings,
    loading,
    error,
    stats,

    // Methods
    loadBookings,
    loadStats,
    acceptBooking,
    rejectBooking,
    completeBooking,
    markBookingPaid,
    getBookingsByStatus,

    // Helpers
    getStatusColor,
    getStatusIcon,
  }
}
