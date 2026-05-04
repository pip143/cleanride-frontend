/**
 * Provider Dashboard Feature - Presenter (Hook)
 * Business logic for provider dashboard using React hooks
 */
import { useState } from 'react'
import { ProviderDashboardModel } from "../model/ProviderDashboardModel"

export function useProviderDashboardPresenter() {
  const [stats, setStats] = useState(null)
  const [earnings, setEarnings] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Load provider dashboard data
   */
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

  /**
   * Transform stats for display
   */
  const transformStats = (statsData) => {
    return {
      totalBookings: statsData?.totalBookings || 0,
      pendingBookings: statsData?.pendingBookings || 0,
      totalServices: statsData?.totalServices || 0,
      averageRating: statsData?.averageRating || 4.5,
    }
  }

  /**
   * Transform earnings for display
   */
  const transformEarnings = (earningsData) => {
    return {
      totalEarnings: earningsData?.totalEarnings || 0,
      thisMonthEarnings: earningsData?.thisMonthEarnings || 0,
      pendingEarnings: earningsData?.pendingEarnings || 0,
      displayTotal: `$${Number(earningsData?.totalEarnings || 0).toFixed(2)}`,
      displayMonth: `$${Number(earningsData?.thisMonthEarnings || 0).toFixed(2)}`,
      displayPending: `$${Number(earningsData?.pendingEarnings || 0).toFixed(2)}`,
    }
  }

  /**
   * Transform bookings for display
   */
  const transformBookings = (bookingsData) => {
    return (bookingsData || []).map((booking) => ({
      ...booking,
      displayPrice: `$${Number(booking.price || 0).toFixed(2)}`,
      displayDate: new Date(booking.bookedDate).toLocaleDateString(),
      displayTime: new Date(booking.bookedDate).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }))
  }

  return {
    // State
    stats,
    earnings,
    recentBookings,
    loading,
    error,

    // Methods
    loadDashboardData,
  }
}
