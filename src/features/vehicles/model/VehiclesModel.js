/**
 * Vehicles Feature - Model
 */
import axiosInstance from "../../../core/api/axiosInstance"

function normalizeVehiclePayload(vehicleData) {
  const plate = vehicleData.licensePlate || vehicleData.plateNumber || ""
  return {
    ...vehicleData,
    licensePlate: plate,
    plateNumber: plate,
  }
}

const vehiclesModel = {
  /**
   * Get all vehicles for a user
   */
  async getVehicles(userId) {
    const response = await axiosInstance.get(`/api/vehicles/user/${userId}`)
    return response.data || []
  },

  /**
   * Get a specific vehicle
   */
  async getVehicle(vehicleId) {
    const response = await axiosInstance.get(`/api/vehicles/${vehicleId}`)
    return response.data
  },

  /**
   * Create a vehicle
   */
  async createVehicle(vehicleData) {
    const { userId, ...data } = normalizeVehiclePayload(vehicleData)
    const response = await axiosInstance.post(`/api/vehicles/${userId}`, data)
    return response.data
  },

  /**
   * Update a vehicle
   */
  async updateVehicle(vehicleId, vehicleData) {
    const response = await axiosInstance.put(`/api/vehicles/${vehicleId}`, normalizeVehiclePayload(vehicleData))
    return response.data
  },

  /**
   * Delete a vehicle
   */
  async deleteVehicle(vehicleId) {
    const response = await axiosInstance.delete(`/api/vehicles/${vehicleId}`)
    return response.data
  }
}

export default vehiclesModel
