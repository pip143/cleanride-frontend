// Email validation
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) ? null : 'Invalid email address'
}

// Password validation
export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return null
}

// Username validation
export function validateUsername(username) {
  if (!username) return 'Username is required'
  if (username.length < 3) return 'Username must be at least 3 characters'
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'Username can only contain letters, numbers, underscores, and hyphens'
  }
  return null
}

// Required field validation
export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`
  }
  return null
}

// Number range validation
export function validateRange(value, min, max, fieldName) {
  const num = Number(value)
  if (isNaN(num)) return `${fieldName} must be a number`
  if (num < min || num > max) {
    return `${fieldName} must be between ${min} and ${max}`
  }
  return null
}

// Phone number validation
export function validatePhoneNumber(phone) {
  if (!phone) return 'Phone number is required'
  const phoneRegex = /^[0-9+\-\s()]{7,}$/
  return phoneRegex.test(phone) ? null : 'Invalid phone number'
}

// Booking validation
export function validateBooking(booking) {
  const errors = {}

  if (!booking.serviceId) errors.serviceId = 'Service is required'
  if (!booking.vehicleId) errors.vehicleId = 'Vehicle is required'
  if (!booking.date) errors.date = 'Date is required'
  if (!booking.time) errors.time = 'Time is required'
  if (!booking.location) errors.location = 'Location is required'

  return Object.keys(errors).length > 0 ? errors : null
}

// Vehicle validation
export function validateVehicle(vehicle) {
  const errors = {}

  if (!vehicle.make) errors.make = 'Make is required'
  if (!vehicle.model) errors.model = 'Model is required'
  if (!vehicle.plateNumber) errors.plateNumber = 'Plate number is required'
  if (!vehicle.vehicleType) errors.vehicleType = 'Vehicle type is required'
  if (!vehicle.color) errors.color = 'Color is required'

  return Object.keys(errors).length > 0 ? errors : null
}

// Review validation
export function validateReview(review) {
  const errors = {}

  if (!review.rating) errors.rating = 'Rating is required'
  if (!review.comment || !review.comment.trim()) {
    errors.comment = 'Comment is required'
  }
  if (review.comment && review.comment.trim().length < 10) {
    errors.comment = 'Comment must be at least 10 characters'
  }

  return Object.keys(errors).length > 0 ? errors : null
}

// Service validation
export function validateService(service) {
  const errors = {}

  if (!service.name) errors.name = 'Service name is required'
  if (!service.description) errors.description = 'Description is required'
  if (!service.price) errors.price = 'Price is required'
  else if (Number(service.price) <= 0) errors.price = 'Price must be greater than 0'
  if (!service.duration) errors.duration = 'Duration is required'
  else if (Number(service.duration) <= 0) errors.duration = 'Duration must be greater than 0'

  return Object.keys(errors).length > 0 ? errors : null
}
