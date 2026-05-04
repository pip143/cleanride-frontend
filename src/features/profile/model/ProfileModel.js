/**
 * Profile Feature - Model
 */
import axiosInstance from "../../../core/api/axiosInstance"

const profileModel = {
  /**
   * Get user profile
   */
  async getProfile(userId) {
    const response = await axiosInstance.get(`/api/users/${userId}/profile`)
    return response.data
  },

  /**
   * Update profile
   */
  async updateProfile(userId, profileData) {
    const response = await axiosInstance.put(`/api/users/${userId}/profile`, profileData)
    return response.data
  },

  /**
   * Update password
   */
  async updatePassword(userId, passwordData) {
    const response = await axiosInstance.put(`/api/users/${userId}/password`, passwordData)
    return response.data
  },

  /**
   * Upload profile photo
   */
  async uploadPhoto(userId, file) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await axiosInstance.post(`/api/users/${userId}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    return response.data
  },

  /**
   * Get profile photo
   */
  async getPhoto(userId) {
    const response = await axiosInstance.get(`/api/users/${userId}/photo`)
    return response.data
  }
}

export default profileModel
