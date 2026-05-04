/**
 * Provider Services Feature - Model
 */
import axiosInstance from "../../../../core/api/axiosInstance"

const ProviderServicesModel = {
  /**
   * Get provider's services
   */
  async getServices(providerId) {
    const response = await axiosInstance.get(`/api/provider/${providerId}/services`)
    return response.data || []
  },

  /**
   * Get specific service
   */
  async getService(serviceId) {
    const response = await axiosInstance.get(`/api/services/${serviceId}`)
    return response.data
  },

  /**
   * Create new service
   */
  async createService(serviceData) {
    const response = await axiosInstance.post(`/api/provider/services`, serviceData)
    return response.data
  },

  /**
   * Update service
   */
  async updateService(serviceId, serviceData) {
    const response = await axiosInstance.put(`/api/services/${serviceId}`, serviceData)
    return response.data
  },

  /**
   * Delete service
   */
  async deleteService(serviceId) {
    const response = await axiosInstance.delete(`/api/services/${serviceId}`)
    return response.data
  },
}

export default ProviderServicesModel
