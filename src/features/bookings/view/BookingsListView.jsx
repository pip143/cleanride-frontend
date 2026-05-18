import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../shared/hooks/useAuth"
import { useToast } from "../../../shared/hooks/useToast"
import { BookingsPresenter } from "../index"
import { LoadingSpinner } from "../../../components/LoadingSpinner"
import { BOOKING_STATUSES } from "../../../core/constants"

export default function BookingsListView() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const { showToast } = useToast()

  const [state, setState] = useState({
    bookings: [],
    loading: true,
    error: null,
    filterStatus: "All",
  })

  useEffect(() => {
    if (!userId) {
      setState((prev) => ({ ...prev, error: "User not logged in" }))
      return
    }
    loadBookings()
  }, [userId])

  const loadBookings = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const result = await BookingsPresenter.loadBookings(userId)

    if (result.success) {
      setState((prev) => ({
        ...prev,
        bookings: result.data,
        loading: false,
      }))
    } else {
      setState((prev) => ({
        ...prev,
        error: result.error,
        loading: false,
      }))
      showToast(result.error, "error")
    }
  }

  if (state.loading) return <LoadingSpinner />

  const statuses = [
    "All",
    ...Object.values(BOOKING_STATUSES).map(
      (status) => status.charAt(0) + status.slice(1).toLowerCase()
    ),
  ]

  const filteredBookings =
    state.filterStatus === "All"
      ? state.bookings
      : state.bookings.filter(
          (b) =>
            b.status ===
            state.filterStatus.toUpperCase().replace(" ", "_")
        )

  const statusCounts = statuses.map((status) => {
    if (status === "All") return state.bookings.length
    const dbStatus = status.toUpperCase().replace(" ", "_")
    return state.bookings.filter((b) => b.status === dbStatus).length
  })

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">My Bookings</h1>
            <p className="text-blue-700 mt-1">Track and manage your service bookings</p>
          </div>
          <button
            onClick={() => navigate("/bookings/new")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition font-medium hover:scale-105"
          >
            + New Booking
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Filter */}
        <div className="flex gap-2 mb-6 border-b-2 border-blue-200 pb-4 overflow-x-auto">
          {statuses.map((status, idx) => (
            <button
              key={status}
              onClick={() => setState((prev) => ({ ...prev, filterStatus: status }))}
              className={`px-4 py-2 rounded-lg transition font-medium whitespace-nowrap ${
                state.filterStatus === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border-2 border-blue-200 text-blue-700 hover:border-blue-400"
              }`}
            >
              {status} ({statusCounts[idx]})
            </button>
          ))}
        </div>

        {/* Bookings List or Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border-2 border-blue-200 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start by booking a service for your vehicle</p>
            <button
              onClick={() => navigate("/bookings/new")}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Create Booking
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={() => {
                  handleCancelBooking(booking.id)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  async function handleCancelBooking(bookingId) {
    const result = await BookingsPresenter.cancelBooking(bookingId)
    if (result.success) {
      showToast("Booking cancelled successfully", "success")
      loadBookings()
    } else {
      showToast(result.error, "error")
    }
  }
}

function BookingCard({ booking, onCancel }) {
  const navigate = useNavigate()

  const statusColors = {
    PENDING: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-800" },
    CONFIRMED: { bg: "bg-green-50", border: "border-green-300", text: "text-green-800" },
    IN_PROGRESS: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-800" },
    COMPLETED: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-800" },
    CANCELLED: { bg: "bg-red-50", border: "border-red-300", text: "text-red-800" },
  }

  const colors = statusColors[booking.status] || statusColors.PENDING

  return (
    <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6 hover:shadow-lg transition`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{booking.serviceName}</h3>
          <p className={`text-sm font-medium mt-1 ${colors.text}`}>
            {booking.status.replace(/_/g, " ")}
          </p>
        </div>
        <span className="text-xl font-bold text-blue-600">{booking.displayPrice}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <InfoCell label="Vehicle" value={booking.vehicleName} />
        <InfoCell label="Date" value={booking.scheduledDate ? new Date(`${booking.scheduledDate}T00:00`).toLocaleDateString() : "No date"} />
        <InfoCell label="Time" value={formatBookingTime(booking.scheduledTime)} />
        <InfoCell label="Duration" value={booking.displayDuration} />
        <InfoCell label="Payment" value={booking.paymentStatus || "UNPAID"} valueClassName={booking.isPaid ? "text-green-700" : "text-yellow-700"} />
      </div>

      <div className="flex gap-2 justify-end">
        {booking.isPayable && (
          <button
            onClick={() => navigate("/payment/method", { state: { booking } })}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            Pay Now
          </button>
        )}
        {!booking.isLocked && (
          <button
            onClick={() => navigate(`/bookings/${booking.id}/edit`, { state: { booking } })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            View Details
          </button>
        )}
        {booking.isReviewable && (
          <button
            onClick={() => {
              sessionStorage.setItem("reviewBookingId", String(booking.id))
              navigate(`/reviews/new?bookingId=${booking.id}`, { state: { bookingId: booking.id } })
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
          >
            Leave Review
          </button>
        )}
        {booking.isLocked && (
          <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
            Reviewed
          </span>
        )}
        {booking.isCancelable && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

function formatBookingTime(time) {
  if (!time) return "No time"
  const normalized = String(time).slice(0, 5)
  const [hours, minutes] = normalized.split(":")
  if (!hours || !minutes) return time
  const date = new Date()
  date.setHours(Number(hours), Number(minutes), 0, 0)
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}
function InfoCell({ label, value, valueClassName = "text-gray-900" }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-600">{label}</p>
      <p className={`text-sm font-semibold mt-1 ${valueClassName}`}>{value}</p>
    </div>
  )
}
