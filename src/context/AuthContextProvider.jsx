import { useState, useCallback } from "react"
import { AuthContext } from "./AuthContext"
import { ROLES, normalizeRole, isProviderRole } from "../core/constants"

// AuthProvider component
export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => {
    // Initialize from localStorage immediately
    return localStorage.getItem("userId") || null
  })
  const [role, setRole] = useState(() => {
    return normalizeRole(localStorage.getItem("userRole") || ROLES.CUSTOMER)
  })
  const [isAuthenticated, setIsAuthenticated] = useState(!!userId)
  const [isLoading] = useState(false)

  // Login function - accepts userId and optionally role
  const login = useCallback((userId, userRole = ROLES.CUSTOMER) => {
    const normalizedRole = normalizeRole(userRole)
    localStorage.setItem("userId", userId)
    localStorage.setItem("userRole", normalizedRole)
    setUserId(userId)
    setRole(normalizedRole)
    setIsAuthenticated(true)
  }, [])

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    setUserId(null)
    setRole(ROLES.CUSTOMER)
    setIsAuthenticated(false)
  }, [])

  const value = {
    userId,
    role,
    isAuthenticated,
    isLoading,
    login,
    logout,
    isCustomer: role === ROLES.CUSTOMER,
    isProvider: isProviderRole(role),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
