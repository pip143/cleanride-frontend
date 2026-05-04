/**
 * Profile Feature - Presenter
 */
import profileModel from "../model/ProfileModel"

class ProfilePresenter {
  /**
   * Load user profile
   */
  async loadProfile(userId) {
    try {
      const profile = await profileModel.getProfile(userId)
      return {
        success: true,
        data: this.transformProfile(profile),
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to load profile"
      }
    }
  }

  /**
   * Update profile
   */
  async updateProfile(userId, profileData) {
    try {
      const result = await profileModel.updateProfile(userId, profileData)
      return {
        success: true,
        data: result,
        message: "Profile updated successfully",
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to update profile"
      }
    }
  }

  /**
   * Update password
   */
  async updatePassword(userId, currentPassword, newPassword) {
    try {
      const result = await profileModel.updatePassword(userId, {
        currentPassword,
        newPassword
      })
      return {
        success: true,
        data: result,
        message: "Password updated successfully",
        error: null
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update password"
      return {
        success: false,
        data: null,
        error: message
      }
    }
  }

  /**
   * Upload photo
   */
  async uploadPhoto(userId, file) {
    try {
      const result = await profileModel.uploadPhoto(userId, file)
      return {
        success: true,
        data: result,
        message: "Photo uploaded successfully",
        error: null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to upload photo"
      }
    }
  }

  /**
   * Get profile photo
   */
  async getPhoto(userId) {
    try {
      const photo = await profileModel.getPhoto(userId)
      return {
        success: true,
        data: photo,
        error: null
      }
    } catch {
      return {
        success: false,
        data: null,
        error: null // Don't show error for photo, just no photo
      }
    }
  }

  /**
   * Transform profile for display
   */
  transformProfile(profile) {
    return {
      ...profile,
      formattedJoinDate: this.formatDate(profile.createdAt),
      initials: this.getInitials(profile.name)
    }
  }

  /**
   * Format date
   */
  formatDate(date) {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  /**
   * Get initials from name
   */
  getInitials(name) {
    if (!name) return "?"
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
  }

  /**
   * Validate profile data
   */
  validateProfileUpdate(data) {
    const errors = {}
    if (!data.name || data.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.email = "Please enter a valid email"
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Validate password change
   */
  validatePasswordChange(currentPassword, newPassword, confirmPassword) {
    const errors = {}
    if (!currentPassword) errors.currentPassword = "Current password is required"
    if (!newPassword || newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Validate photo file
   */
  validatePhotoFile(file) {
    const errors = {}
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]

    if (!file) errors.file = "Please select a file"
    if (file && file.size > maxSize) errors.file = "File must be less than 5MB"
    if (file && !allowedTypes.includes(file.type)) {
      errors.file = "File must be an image (JPEG, PNG, GIF)"
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Check valid email
   */
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }
}

export default new ProfilePresenter()
