import { useState, useCallback } from "react"
import { AuthContext } from "./AuthContext"
import { ROLES } from "../core/constants"

// AuthProvider component
export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => {
    // Initialize from localStorage immediately
    return localStorage.getItem("userId") || null
  })
  const [role, setRole] = useState(() => {
    // Initialize role from localStorage (CUSTOMER or PROVIDER)
    return localStorage.getItem("userRole") || ROLES.CUSTOMER
  })
  const [isAuthenticated, setIsAuthenticated] = useState(!!userId)
  const [isLoading] = useState(false)

  // Login function - accepts userId and optionally role
  const login = useCallback((userId, userRole = ROLES.CUSTOMER) => {
    localStorage.setItem("userId", userId)
    localStorage.setItem("userRole", userRole)
    setUserId(userId)
    setRole(userRole)
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

  // Switch role function (for testing/switching)
  const switchRole = useCallback((newRole) => {
    if (userId && [ROLES.CUSTOMER, ROLES.PROVIDER].includes(newRole)) {
      localStorage.setItem("userRole", newRole)
      setRole(newRole)
    }
  }, [userId])

  const value = {
    userId,
    role,
    isAuthenticated,
    isLoading,
    login,
    logout,
    switchRole,
    isCustomer: role === ROLES.CUSTOMER,
    isProvider: role === ROLES.PROVIDER,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
