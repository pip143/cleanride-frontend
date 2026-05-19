/**
 * Dashboard Feature - Presenter (Business Logic)
 * Handles business logic, data transformation
 * Calls model functions, controls view state
 * No JSX allowed
 */
import dashboardModel from "../model/DashboardModel"

class DashboardPresenter {
  /**
   * Load dashboard data for a user
   */
  async loadDashboardData(userId) {
    try {
      const [stats, services, bookings] = await Promise.all([
        dashboardModel.getDashboardStats(userId),
        dashboardModel.getServices(),
        dashboardModel.getRecentBookings(userId)
      ])

      return {
        success: true,
        data: {
          stats,
          services: this.transformServices(services),
          recentBookings: bookings,
          userGreeting: this.generateGreeting(stats.userProfile?.name)
        },
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to load dashboard"
      }
    }
  }

  /**
   * Transform services for display
   */
  transformServices(services) {
    return services.map((service) => ({
      ...service,
      displayPrice: `PHP ${service.price?.toFixed(2)}`,
      displayDuration: `${service.duration || 30} min`
    }))
  }

  /**
   * Generate personalized greeting
   */
  generateGreeting(userName) {
    const hour = new Date().getHours()
    let greeting = "Good morning"

    if (hour >= 12 && hour < 17) {
      greeting = "Good afternoon"
    } else if (hour >= 17) {
      greeting = "Good evening"
    }

    return userName ? `${greeting}, ${userName}!` : greeting + "!"
  }

  /**
   * Calculate dashboard stats summary
   */
  calculateStatsSummary(stats) {
    return {
      totalBookings: stats.totalBookings,
      totalVehicles: stats.totalVehicles,
      completedPercentage:
        stats.totalBookings > 0
          ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
          : 0
    }
  }
}

export default new DashboardPresenter()
