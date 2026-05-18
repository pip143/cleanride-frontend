import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export const PaymentSuccessView = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [paymentData] = useState(location.state || {})
  const [confirmationNumber] = useState(() =>
    `CLEAN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/bookings")
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-bold">
            OK
          </div>
          <h1 className="text-4xl font-bold text-green-900 mb-2">Payment Saved</h1>
          <p className="text-green-700 mb-8">The booking is now marked as paid.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-4 mb-6">
            <Detail label="Payment Method" value={paymentData.method || "N/A"} />
            <Detail label="Service" value={paymentData.serviceName || "Service"} />
            <Detail label="Amount Paid" value={`$${Number(paymentData.amount || 0).toFixed(2)}`} strong />
            <Detail label="Booking ID" value={paymentData.bookingId || "N/A"} />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                PAID
              </span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-gray-600 text-xs mb-1">Confirmation Number</p>
            <p className="text-2xl font-bold text-green-700 font-mono">{confirmationNumber}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/bookings")}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
          >
            View Bookings
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-bold"
          >
            Dashboard
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">Redirecting to bookings in 5 seconds...</p>
      </div>
    </div>
  )
}

function Detail({ label, value, strong = false }) {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-gray-200 gap-4">
      <span className="text-gray-600">{label}</span>
      <span className={`text-right ${strong ? "font-semibold text-green-600 text-lg" : "font-semibold text-gray-900"}`}>
        {value}
      </span>
    </div>
  )
}