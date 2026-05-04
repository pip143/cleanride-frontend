/**
 * Services Feature - Model
 * Handles all API calls for car wash services
 */
import axiosInstance from "../../../core/api/axiosInstance"

const servicesModel = {
  /**
   * Get all available services
   */
  async getServices() {
    const response = await axiosInstance.get("/api/services")
    return response.data || []
  },

  /**
   * Get a specific service by ID
   */
  async getService(serviceId) {
    const response = await axiosInstance.get(`/api/services/${serviceId}`)
    return response.data
  },

  /**
   * Create a new service (admin only)
   */
  async createService(serviceData) {
    const response = await axiosInstance.post("/api/services", serviceData)
    return response.data
  },

  /**
   * Update a service (admin only)
   */
  async updateService(serviceId, serviceData) {
    const response = await axiosInstance.put(`/api/services/${serviceId}`, serviceData)
    return response.data
  },

  /**
   * Delete a service (admin only)
   */
  async deleteService(serviceId) {
    const response = await axiosInstance.delete(`/api/services/${serviceId}`)
    return response.data
  }
}

export default servicesModel
