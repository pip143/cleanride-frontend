import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../shared/hooks/useAuth"

export function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, logout, isProvider, switchRole } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Don't show nav on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/") {
    return null
  }

  // Customer menu items
  const customerMenuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Services", path: "/services" },
    { label: "Bookings", path: "/bookings" },
    { label: "Vehicles", path: "/vehicles" },
    { label: "Profile", path: "/profile" },
  ]

  // Provider menu items
  const providerMenuItems = [
    { label: "Dashboard", path: "/provider/dashboard" },
    { label: "Services", path: "/provider/services" },
    { label: "Bookings", path: "/provider/bookings" },
    { label: "Reviews", path: "/provider/reviews" },
    { label: "Payments", path: "/provider/payments" },
    { label: "Profile", path: "/profile" },
  ]

  const menuItems = isProvider ? providerMenuItems : customerMenuItems

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 border-b-4 border-blue-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => navigate(isProvider ? "/provider/dashboard" : "/dashboard")}
            className="text-2xl font-bold text-white hover:text-blue-100 transition"
          >
            🚗 CleanRide
          </button>

          {/* Nav Links */}
          {isAuthenticated && (
            <div className="flex items-center gap-8">
              <div className="flex gap-6">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`pb-2 font-medium transition whitespace-nowrap ${
                      location.pathname === item.path
                        ? "text-white border-b-2 border-white"
                        : "text-blue-100 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Role Indicator & Switch */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-blue-100 text-sm font-medium">
                    {isProvider ? "Provider" : "Customer"}
                  </span>
                  {switchRole && (
                    <button
                      onClick={() => {
                        // For testing: switch between roles
                        switchRole(isProvider ? "CUSTOMER" : "PROVIDER")
                        navigate(isProvider ? "/dashboard" : "/provider/dashboard")
                      }}
                      className="text-xs px-2 py-1 bg-blue-800 text-blue-100 rounded hover:bg-blue-900 transition"
                      title="Switch role (testing)"
                    >
                      Switch
                    </button>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-sm hover:shadow-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
