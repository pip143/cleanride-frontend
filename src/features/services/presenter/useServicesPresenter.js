/**
 * Services Feature - Presenter
 * Business logic for services
 */
import servicesModel from "../model/ServicesModel"

class ServicesPresenter {
  /**
   * Load all services with error handling
   */
  async loadServices() {
    try {
      const services = await servicesModel.getServices()
      return {
        success: true,
        data: this.transformServices(services),
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to load services"
      }
    }
  }

  /**
   * Transform services for display
   */
  transformServices(services) {
    return services.map((service) => ({
      ...service,
      displayPrice: `PHP ${service.price?.toFixed(2) || "0.00"}`,
      displayDuration: `${service.duration || 30} min`,
      formattedDescription: service.description || "Premium car wash service"
    }))
  }

  /**
   * Filter services by search term
   */
  filterServices(services, searchTerm) {
    if (!searchTerm) return services

    const term = searchTerm.toLowerCase()
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    )
  }

  /**
   * Sort services by field
   */
  sortServices(services, field = "price", order = "asc") {
    return [...services].sort((a, b) => {
      const valueA = a[field]
      const valueB = b[field]

      if (typeof valueA === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA
      }

      return order === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA))
    })
  }
}

export default new ServicesPresenter()
