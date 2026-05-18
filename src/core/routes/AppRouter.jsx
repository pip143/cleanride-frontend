import { Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute, RoleProtectedRoute } from "./ProtectedRoute"
import { ROLES } from "../../core/constants"

// Pages (old structure - will be kept for backward compatibility)
import Login from "../../pages/Login"
import Register from "../../pages/Register"

// Feature views (new MVP structure)
import { DashboardView } from "../../features/dashboard"
import { ServicesView } from "../../features/services"
import { BookingsListView, BookingFormView } from "../../features/bookings"
import { VehiclesListView, VehicleFormView } from "../../features/vehicles"
import { ProfileView } from "../../features/profile"
import { ReviewFormView } from "../../features/reviews"

// Provider features
import { ProviderDashboardView } from "../../features/provider/dashboard"
import { ProviderServicesListView, ProviderServiceFormView } from "../../features/provider/services"
import { ProviderBookingsListView } from "../../features/provider/bookings"
import { ProviderReviewsView } from "../../features/provider/reviews"
import { ProviderPaymentsView } from "../../features/provider/payments"

// Payment features
import { PaymentMethodView, PaymentSuccessView } from "../../features/payments"

/**
 * AppRouter component
 * Defines all routes for the application with role-based protection
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ========== CUSTOMER ROUTES ========== */}
      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <DashboardView />
          </RoleProtectedRoute>
        }
      />

      {/* Services Routes */}
      <Route
        path="/services"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <ServicesView />
          </RoleProtectedRoute>
        }
      />

      {/* Bookings Routes */}
      <Route
        path="/bookings"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <BookingsListView />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/bookings/new"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <BookingFormView />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/bookings/:id/edit"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <BookingFormView />
          </RoleProtectedRoute>
        }
      />

      {/* Vehicles Routes */}
      <Route
        path="/vehicles"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <VehiclesListView />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/vehicles/new"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <VehicleFormView />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/vehicles/:id/edit"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <VehicleFormView />
          </RoleProtectedRoute>
        }
      />

      {/* Profile Routes (Available to all authenticated users) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileView />
          </ProtectedRoute>
        }
      />

      {/* Reviews Routes */}
      <Route
        path="/reviews/new"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <ReviewFormView />
          </RoleProtectedRoute>
        }
      />

      {/* ========== PAYMENT ROUTES ========== */}
      {/* Payment Method Selection */}
      <Route
        path="/payment/method"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <PaymentMethodView />
          </RoleProtectedRoute>
        }
      />

      {/* Payment Success */}
      <Route
        path="/payment/success"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <PaymentSuccessView />
          </RoleProtectedRoute>
        }
      />

      {/* ========== PROVIDER ROUTES ========== */}
      {/* Provider Dashboard */}
      <Route
        path="/provider/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.ADMIN]}>
            <ProviderDashboardView />
          </RoleProtectedRoute>
        }
      />

      {/* Provider Services Routes */}
      <Route
        path="/provider/services"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.ADMIN]}>
            <ProviderServicesListView />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/provider/services/new"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.ADMIN]}>
            <ProviderServiceFormView />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/provider/services/:id/edit"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.ADMIN]}>
            <ProviderServiceFormView />
          </RoleProtectedRoute>
        }
      />

      {/* Provider Bookings Routes */}
      <Route
        path="/provider/bookings"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.ADMIN]}>
            <ProviderBookingsListView />
          </RoleProtectedRoute>
        }
      />

      {/* Provider Reviews Routes */}
      <Route
        path="/provider/reviews"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.ADMIN]}>
            <ProviderReviewsView />
          </RoleProtectedRoute>
        }
      />

      {/* Provider Payments Routes */}
      <Route
        path="/provider/payments"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.ADMIN]}>
            <ProviderPaymentsView />
          </RoleProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
