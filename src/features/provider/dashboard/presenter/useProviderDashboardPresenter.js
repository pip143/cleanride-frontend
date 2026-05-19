/**
 * Provider Dashboard Feature - Presenter (Hook)
 * Business logic for provider dashboard using React hooks
 */
import { useState } from "react"
import { ProviderDashboardModel } from "../model/ProviderDashboardModel"

export function useProviderDashboardPresenter() {
  const [stats, setStats] = useState(null)
  const [earnings, setEarnings] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadDashboardData = async (providerId) => {
    try {
      setLoading(true)
      setError(null)

      const [statsResult, earningsResult, bookingsResult] = await Promise.all([
        ProviderDashboardModel.getProviderStats(providerId),
        ProviderDashboardModel.getEarnings(providerId),
        ProviderDashboardModel.getRecentBookings(providerId),
      ])

      if (statsResult.success && earningsResult.success && bookingsResult.success) {
        setStats(transformStats(statsResult.data))
        setEarnings(transformEarnings(earningsResult.data))
        setRecentBookings(transformBookings(bookingsResult.data))
      } else {
        setError(statsResult.error || earningsResult.error || bookingsResult.error)
      }
    } catch {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const transformStats = (statsData) => ({
    totalBookings: statsData?.totalBookings || 0,
    pendingBookings: statsData?.pendingBookings || 0,
    totalServices: statsData?.totalServices || 0,
    averageRating: statsData?.averageRating || 0,
  })

  const transformEarnings = (earningsData) => ({
    totalEarnings: earningsData?.totalEarnings || 0,
    thisMonthEarnings: earningsData?.thisMonthEarnings || 0,
    pendingEarnings: earningsData?.pendingEarnings || 0,
    displayTotal: `PHP ${Number(earningsData?.totalEarnings || 0).toFixed(2)}`,
    displayMonth: `PHP ${Number(earningsData?.thisMonthEarnings || 0).toFixed(2)}`,
    displayPending: `PHP ${Number(earningsData?.pendingEarnings || 0).toFixed(2)}`,
  })

  const transformBookings = (bookingsData) => {
    return (bookingsData || []).map((booking) => {
      const service = booking.service || {}
      const customer = booking.user || {}
      const vehicle = booking.vehicle || {}
      const bookingDateTime = booking.bookingDate
        ? new Date(`${booking.bookingDate}T${booking.bookingTime || "00:00"}`)
        : null

      return {
        ...booking,
        customerName: customer.name || customer.username || "Customer",
        serviceName: service.name || booking.serviceName || "Service",
        vehicleName:
          [vehicle.make, vehicle.model].filter(Boolean).join(" ") ||
          vehicle.licensePlate ||
          vehicle.plateNumber ||
          "Vehicle",
        displayPrice: `PHP ${Number(service.price || booking.price || 0).toFixed(2)}`,
        displayDate: bookingDateTime ? bookingDateTime.toLocaleDateString() : "No date",
        displayTime: bookingDateTime
          ? bookingDateTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "No time",
      }
    })
  }

  return {
    stats,
    earnings,
    recentBookings,
    loading,
    error,
    loadDashboardData,
  }
}