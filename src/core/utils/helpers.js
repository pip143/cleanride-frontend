/**
 * Core utility helpers
 */

/**
 * Formats date to readable format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date
 */
export function formatDate(date) {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

/**
 * Formats date with time
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date and time
 */
export function formatDateTime(date) {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

/**
 * Formats currency
 * @param {number} value - Amount to format
 * @param {string} currency - Currency code (default: PHP)
 * @returns {string} - Formatted currency
 */
export function formatCurrency(value, currency = "PHP") {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: currency
  }).format(value)
}

/**
 * Debounce function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export function capitalize(str) {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert snake_case to Title Case
 * @param {string} str - Snake case string
 * @returns {string} - Title case string
 */
export function snakeCaseToTitleCase(str) {
  if (!str) return ""
  return str
    .split("_")
    .map((word) => capitalize(word))
    .join(" ")
}
