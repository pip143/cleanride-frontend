import { Navigate } from "react-router-dom"
import { useAuth } from "../../shared/hooks/useAuth"
import { ROLES } from "../../core/constants"

/**
 * ProtectedRoute component
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

/**
 * RoleProtectedRoute component
 * Protects routes by role (CUSTOMER or PROVIDER)
 * Redirects to unauthorized page if user role doesn't match
 */
export function RoleProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role } = useAuth()

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Not in allowed roles - redirect to appropriate dashboard
  if (!allowedRoles.includes(role)) {
    if (role === ROLES.PROVIDER) {
      return <Navigate to="/provider/dashboard" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return children
}
