import axios from "axios"

/**
 * Axios instance with base configuration
 * Base URL: http://localhost:8080
 * Content-Type: application/json
 */
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json"
  }
})

/**
 * Response interceptor for error handling
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - could trigger logout here if needed
      localStorage.removeItem("userId")
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
