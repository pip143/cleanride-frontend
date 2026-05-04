import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

/**
 * Hook to access auth context
 * Returns: {
 *   userId,
 *   role,
 *   isAuthenticated,
 *   isLoading,
 *   isCustomer,
 *   isProvider,
 *   login(userId, role),
 *   logout(),
 *   switchRole(newRole)
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
