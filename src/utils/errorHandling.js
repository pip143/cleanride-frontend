/**
 * Error handling utilities
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

  // Generic error message
  return error.message || "An unknown error occurred"
}

export function isValidationError(error) {
  return error?.response?.status === 400
}

export function isUnauthorized(error) {
  return error?.response?.status === 401
}

export function isNotFound(error) {
  return error?.response?.status === 404
}

export function isConflict(error) {
  return error?.response?.status === 409
}
