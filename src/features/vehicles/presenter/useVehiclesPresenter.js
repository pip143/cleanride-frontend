/**
 * Vehicles Feature - Presenter
 */
import vehiclesModel from "../model/VehiclesModel"

class VehiclesPresenter {
  /**
   * Load vehicles for user
   */
  async loadVehicles(userId) {
    try {
      const vehicles = await vehiclesModel.getVehicles(userId)
      return {
        success: true,
        data: this.transformVehicles(vehicles),
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to load vehicles"
      }
    }
  }

  /**
   * Create vehicle
   */
  async createVehicle(vehicleData) {
    try {
      const result = await vehiclesModel.createVehicle(vehicleData)
      return { success: true, data: result, error: null }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to create vehicle"
      }
    }
  }

  /**
   * Update vehicle
   */
  async updateVehicle(vehicleId, vehicleData) {
    try {
      const result = await vehiclesModel.updateVehicle(vehicleId, vehicleData)
      return { success: true, data: result, error: null }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to update vehicle"
      }
    }
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(vehicleId) {
    try {
      const result = await vehiclesModel.deleteVehicle(vehicleId)
      return { success: true, data: result, error: null }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to delete vehicle"
      }
    }
  }

  /**
   * Transform vehicles
   */
  transformVehicles(vehicles) {
    return vehicles.map((v) => ({
      ...v,
      displayName: `${v.year} ${v.make} ${v.model}`,
      displayPlate: v.licensePlate?.toUpperCase() || "N/A"
    }))
  }

  /**
   * Get vehicle type options
   */
  getVehicleTypeOptions() {
    return [
      { value: "SEDAN", label: "Sedan" },
      { value: "SUV", label: "SUV" },
      { value: "HATCHBACK", label: "Hatchback" },
      { value: "TRUCK", label: "Truck" },
      { value: "VAN", label: "Van" },
      { value: "COUPE", label: "Coupe" }
    ]
  }

  /**
   * Validate vehicle data
   */
  validateVehicle(data) {
    const errors = {}
    if (!data.make) errors.make = "Make is required"
    if (!data.model) errors.model = "Model is required"
    if (!data.year) errors.year = "Year is required"
    if (!data.licensePlate) errors.licensePlate = "License plate is required"
    if (!data.vehicleType) errors.vehicleType = "Vehicle type is required"

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}

export default new VehiclesPresenter()
