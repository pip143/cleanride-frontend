/**
 * Error handling utilities
 */

/**
 * Get user-friendly error message from various error sources
 * @param {any} error - Error object
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(error) {
  if (!error) return "An unknown error occurred"

  // Axios error
  if (error.response) {
    const status = error.response.status
    const data = error.response.data

    // Handle specific error codes
    if (status === 400 && data?.message) {
      return data.message
    }
    if (status === 401) {
      return "Unauthorized. Please log in again."
    }
    if (status === 403) {
      return "Access denied."
    }
    if (status === 404) {
      return "Resource not found."
    }
    if (status === 409) {
      return data?.message || "Conflict. This resource may already exist."
    }
    if (status === 500) {
      return "Server error. Please try again later."
    }

    return data?.message || `Error: ${status}`
  }

  // Network error
  if (error.message === "Network Error") {
    return "Network error. Please check your connection."
  }

  // Default error message
  return error.message || "An unknown error occurred"
}

/**
 * Handle API error and provide feedback
 * @param {any} error - Error object
 * @param {Object} options - Options
 * @returns {Object} - Error info with message and status
 */
export function handleApiError(error) {
  const message = getErrorMessage(error)
  const status = error.response?.status
  const code = error.code

  return {
    message,
    status,
    code,
    isAuthError: status === 401,
    isNotFoundError: status === 404,
    isValidationError: status === 400,
    isConflictError: status === 409,
    isServerError: status >= 500
  }
}
