import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../../shared/hooks/useAuth"
import { useToast } from "../../../../shared/hooks/useToast"
import { LoadingSpinner } from "../../../../components/LoadingSpinner"
import { useProviderDashboardPresenter } from "../presenter/useProviderDashboardPresenter"

export function ProviderDashboardView() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const { showToast } = useToast()
  const presenter = useProviderDashboardPresenter()

  useEffect(() => {
    if (!userId) {
      showToast("User not logged in", "error")
      return
    }
    presenter.loadDashboardData(userId)
  }, [userId])

  if (presenter.loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 border-b-2 border-purple-800 px-6 py-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Provider Dashboard</h2>
        <p className="text-purple-100">Manage your services and bookings</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {presenter.error && (
          <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {presenter.error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatBox stat={presenter.stats?.totalBookings} label="Total Bookings" icon="B" />
          <StatBox stat={presenter.stats?.pendingBookings} label="Pending Requests" icon="P" />
          <StatBox stat={presenter.stats?.totalServices} label="Your Services" icon="S" />
          <StatBox stat={presenter.stats?.averageRating} label="Average Rating" icon="R" />
        </div>

        <div className="bg-white rounded-lg shadow-md border-2 border-purple-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-purple-900 mb-4">Earnings Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
              <p className="text-sm text-green-700 font-medium mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">{presenter.earnings?.displayTotal}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-1">This Month</p>
              <p className="text-2xl font-bold text-blue-600">{presenter.earnings?.displayMonth}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
              <p className="text-sm text-yellow-700 font-medium mb-1">Pending Payment</p>
              <p className="text-2xl font-bold text-yellow-600">{presenter.earnings?.displayPending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border-2 border-purple-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-purple-900">Recent Bookings</h3>
            <button
              onClick={() => navigate("/provider/bookings")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
            >
              View All
            </button>
          </div>

          {presenter.recentBookings.length === 0 ? (
            <div className="text-center py-8 bg-purple-50 rounded-lg border-2 border-purple-200">
              <p className="text-purple-700">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {presenter.recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex justify-between items-center p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition"
                >
                  <div>
                    <p className="font-semibold text-purple-900">{booking.serviceName}</p>
                    <p className="text-xs text-purple-600">{booking.vehicleName}</p>
                    <p className="text-sm text-purple-700">
                      {booking.displayDate} at {booking.displayTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-purple-600">{booking.displayPrice}</span>
                    <button
                      onClick={() =>
                        navigate(`/provider/bookings/${booking.id}`, {
                          state: { booking },
                        })
                      }
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/provider/services")}
            className="p-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition"
          >
            <p className="text-2xl mb-2 font-bold">S</p>
            <p className="font-semibold">Manage Services</p>
            <p className="text-sm text-purple-100 mt-1">Create, edit, or delete services</p>
          </button>
          <button
            onClick={() => navigate("/provider/bookings")}
            className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg transition"
          >
            <p className="text-2xl mb-2 font-bold">B</p>
            <p className="font-semibold">Manage Bookings</p>
            <p className="text-sm text-indigo-100 mt-1">Accept, reject, or complete bookings</p>
          </button>
        </div>
      </div>
    </div>
  )
}

function StatBox({ stat, label, icon }) {
  return (
    <div className="bg-white border-2 border-purple-200 rounded-lg p-4 shadow-md hover:shadow-lg hover:border-purple-400 transition">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
        {icon}
      </div>
      <div className="text-2xl font-bold text-purple-600">{stat ?? 0}</div>
      <div className="text-sm text-purple-700 mt-1 font-medium">{label}</div>
    </div>
  )
}