/**
 * Provider Services Feature - Presenter
 */
import ProviderServicesModel from "../model/ProviderServicesModel"
import { validateService } from "../../../../core/utils/validation"

class ProviderServicesPresenter {
  /**
   * Load provider services
   */
  async loadServices(providerId) {
    try {
      const services = await ProviderServicesModel.getServices(providerId)
      return {
        success: true,
        data: this.transformServices(services),
        error: null,
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to load services",
      }
    }
  }

  /**
   * Create service
   */
  async createService(serviceData) {
    try {
      const result = await ProviderServicesModel.createService(serviceData)
      return {
        success: true,
        data: result,
        error: null,
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to create service",
      }
    }
  }

  /**
   * Update service
   */
  async updateService(serviceId, serviceData) {
    try {
      const result = await ProviderServicesModel.updateService(serviceId, serviceData)
      return {
        success: true,
        data: result,
        error: null,
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to update service",
      }
    }
  }

  /**
   * Delete service
   */
  async deleteService(serviceId) {
    try {
      const result = await ProviderServicesModel.deleteService(serviceId)
      return {
        success: true,
        data: result,
        error: null,
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to delete service",
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
    }))
  }

  /**
   * Validate service data
   */
  validateService(data) {
    return validateService(data)
  }
}

export default new ProviderServicesPresenter()
