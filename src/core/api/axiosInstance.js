import axios from "axios"

/**
 * Axios instance with base configuration
 * Base URL: deployed Render backend by default
 * Content-Type: application/json
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://cleanride-backend-1.onrender.com",
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
