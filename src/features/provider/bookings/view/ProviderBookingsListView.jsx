import { useEffect, useState } from "react"
import { useAuth } from "../../../../shared/hooks/useAuth"
import { useProviderBookingsPresenter } from "../presenter/useProviderBookingsPresenter"
import { BOOKING_STATUSES } from "../../../../core/constants"
import { LoadingSpinner } from "../../../../components/LoadingSpinner"
import { useToast } from "../../../../shared/hooks/useToast"

const bookingStatusTabs = [
  { label: "Pending", value: BOOKING_STATUSES.PENDING },
  { label: "Accepted", value: BOOKING_STATUSES.ACCEPTED },
  { label: "Completed", value: BOOKING_STATUSES.COMPLETED },
  { label: "Rejected", value: BOOKING_STATUSES.REJECTED },
]

/**
 * ProviderBookingsListView - Display provider's bookings with filtering and actions
 * Allows provider to view, accept, reject, and mark bookings as complete
 */
export const ProviderBookingsListView = () => {
  const { userId } = useAuth()
  const presenter = useProviderBookingsPresenter()
  const { showToast } = useToast()
  const [selectedStatus, setSelectedStatus] = useState(BOOKING_STATUSES.PENDING)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    if (userId) {
      presenter.loadBookings(userId)
    }
  }, [userId])

  const handleAcceptBooking = async (bookingId) => {
    const result = await presenter.acceptBooking(bookingId)
    if (result.success) {
      showToast("Booking accepted successfully", "success")
    } else {
      showToast(result.error, "error")
    }
  }

  const handleRejectBooking = async () => {
    if (selectedBookingId) {
      const result = await presenter.rejectBooking(selectedBookingId, rejectReason)
      if (result.success) {
        showToast("Booking rejected successfully", "success")
        setShowRejectModal(false)
        setRejectReason("")
        setSelectedBookingId(null)
      } else {
        showToast(result.error, "error")
      }
    }
  }

  const handleCompleteBooking = async (booking) => {
    if (!booking.isPaid) {
      showToast("Customer payment is still unpaid", "error")
      return
    }

    const result = await presenter.completeBooking(booking.id)
    if (result.success) {
      showToast("Booking marked as completed", "success")
    } else {
      showToast(result.error, "error")
    }
  }

  const filteredBookings = presenter.getBookingsByStatus(selectedStatus)

  if (presenter.loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Manage Bookings
          </h1>
          <p className="text-purple-700">
            Review and manage customer booking requests
          </p>
        </div>

        {/* Error Display */}
        {presenter.error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
            {presenter.error}
          </div>
        )}

        {/* Status Tabs */}
        <div className="mb-6 border-b-2 border-purple-300 flex gap-2 overflow-x-auto">
          {bookingStatusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-6 py-3 font-semibold whitespace-nowrap transition-all border-b-4 -mb-0.5 ${
                selectedStatus === tab.value
                  ? "text-purple-600 border-purple-600"
                  : "text-purple-500 border-transparent hover:text-purple-700"
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-purple-200 text-purple-800 rounded-full px-3 py-0.5 text-sm">
                {presenter.getBookingsByStatus(tab.value).length}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-purple-600 text-lg">
              No {selectedStatus.toLowerCase()} bookings
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {booking.customerName}
                    </h3>
                    <p className="text-purple-600 font-semibold mb-2">
                      {booking.serviceName}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Date & Time:</span>{" "}
                        {booking.displayDate} at {booking.displayTime}
                      </div>
                      <div>
                        <span className="font-semibold">Price:</span>{" "}
                        {booking.displayPrice}
                      </div>
                      <div>
                        <span className="font-semibold">Vehicle:</span>{" "}
                        {booking.vehicleType}
                      </div>
                      <div>
                        <span className="font-semibold">Duration:</span>{" "}
                        {booking.duration || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Payment:</span>{" "}
                        <span className={booking.isPaid ? "text-green-600 font-semibold" : "text-yellow-700 font-semibold"}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ml-4 ${presenter.getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  {booking.status === BOOKING_STATUSES.PENDING && (
                    <>
                      <button
                        onClick={() => handleAcceptBooking(booking.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBookingId(booking.id)
                          setShowRejectModal(true)
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {booking.status === BOOKING_STATUSES.ACCEPTED && (
                    <button
                      onClick={() => handleCompleteBooking(booking)}
                      className={`px-4 py-2 rounded-lg transition-colors font-semibold ${booking.isPaid ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-600 cursor-not-allowed"}`}
                    >
                      {booking.isPaid ? "Mark Complete" : "Awaiting Payment"}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      /* TODO: Implement view details modal */
                    }}
                    className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reject Booking
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 mb-4"
              rows="4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason("")
                  setSelectedBookingId(null)
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectBooking}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
