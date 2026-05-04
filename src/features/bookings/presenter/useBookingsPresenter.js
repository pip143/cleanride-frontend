/**
 * Bookings Feature - Presenter
 * Business logic for booking operations
 */
import bookingsModel from "../model/BookingsModel"

class BookingsPresenter {
  /**
   * Load user bookings
   */
  async loadBookings(userId) {
    try {
      const bookings = await bookingsModel.getBookings(userId)
      return {
        success: true,
        data: this.transformBookings(bookings),
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to load bookings"
      }
    }
  }

  /**
   * Create new booking
   */
  async createBooking(bookingData) {
    try {
      const result = await bookingsModel.createBooking(bookingData)
      return {
        success: true,
        data: result,
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to create booking"
      }
    }
  }

  /**
   * Update booking
   */
  async updateBooking(bookingId, bookingData) {
    try {
      const result = await bookingsModel.updateBooking(bookingId, bookingData)
      return {
        success: true,
        data: result,
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to update booking"
      }
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId) {
    try {
      const result = await bookingsModel.cancelBooking(bookingId)
      return {
        success: true,
        data: result,
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to cancel booking"
      }
    }
  }

  /**
   * Transform bookings for display
   */
  transformBookings(bookings) {
    return bookings.map((booking) => {
      const service = booking.service || {}
      const vehicle = booking.vehicle || {}
      const normalizedStatus = this.normalizeStatus(booking.status)
      const vehicleName = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ")
      const hasReview = Boolean(booking.hasReview)

      return {
        ...booking,
        hasReview,
        status: normalizedStatus,
        serviceName: service.name || "Service",
        vehicleName: vehicleName || vehicle.licensePlate || vehicle.plateNumber || "Vehicle",
        scheduledDate: booking.bookingDate || booking.scheduledDate || "",
        scheduledTime: booking.bookingTime || booking.timeSlot || booking.scheduledTime || "",
        displayPrice: `$${Number(service.price || booking.totalPrice || 0).toFixed(2)}`,
        displayDuration: service.duration ? `${service.duration} min` : "N/A",
        statusBadge: this.getStatusBadge(normalizedStatus),
        isEditable: ["PENDING", "CONFIRMED"].includes(normalizedStatus) && !hasReview,
        isCancelable: ["PENDING", "CONFIRMED"].includes(normalizedStatus) && !hasReview,
        isReviewable: normalizedStatus === "COMPLETED" && !hasReview,
        isLocked: normalizedStatus === "COMPLETED" && hasReview
      }
    })
  }

  normalizeStatus(status) {
    const statusMap = {
      ACCEPTED: "CONFIRMED",
      REJECTED: "CANCELLED",
    }
    return statusMap[status] || status
  }

  /**
   * Get status badge with color
   */
  getStatusBadge(status) {
    const badges = {
      PENDING: { label: "Pending", color: "#ff9800" },
      CONFIRMED: { label: "Confirmed", color: "#4caf50" },
      IN_PROGRESS: { label: "In Progress", color: "#2196f3" },
      COMPLETED: { label: "Completed", color: "#9c27b0" },
      CANCELLED: { label: "Cancelled", color: "#f44336" }
    }
    return badges[status] || { label: status, color: "#999" }
  }

  /**
   * Filter bookings by status
   */
  filterByStatus(bookings, status) {
    if (status === "all") return bookings
    return bookings.filter((b) => b.status === status)
  }

  /**
   * Get status options
   */
  getStatusOptions() {
    return [
      { value: "PENDING", label: "Pending" },
      { value: "CONFIRMED", label: "Confirmed" },
      { value: "IN_PROGRESS", label: "In Progress" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" }
    ]
  }

  /**
   * Validate booking data
   */
  validateBooking(data) {
    const errors = {}

    if (!data.vehicleId) errors.vehicleId = "Vehicle is required"
    if (!data.serviceId) errors.serviceId = "Service is required"
    if (!data.bookingDate) errors.bookingDate = "Booking date is required"
    if (!data.timeSlot) errors.timeSlot = "Time slot is required"

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}

export default new BookingsPresenter()
