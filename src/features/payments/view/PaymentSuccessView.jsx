import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

/**
 * PaymentSuccessView - Shows confirmation after successful payment
 * Mock implementation - displays payment confirmation details
 */
export const PaymentSuccessView = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [paymentData] = useState(location.state || {})
  const [confirmationNumber] = useState(() =>
    `CLEAN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  )

  useEffect(() => {
    // Auto-navigate to bookings after 5 seconds
    const timer = setTimeout(() => {
      navigate("/bookings")
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-4xl font-bold text-green-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-green-700 mb-8">
            Your booking has been confirmed
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-900">
                {paymentData.method || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-semibold text-green-600 text-lg">
                ${paymentData.amount?.toFixed(2) || "0.00"}
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Booking ID</span>
              <span className="font-mono text-gray-900 text-sm">
                {paymentData.bookingId || "#MOCK001"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Confirmed
              </span>
            </div>
          </div>

          {/* Confirmation Number */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-gray-600 text-xs mb-1">Confirmation Number</p>
            <p className="text-2xl font-bold text-green-700 font-mono">
              {confirmationNumber}
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 text-sm font-semibold mb-2">Next Steps:</p>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>✓ Check your email for confirmation details</li>
              <li>✓ Service provider will contact you shortly</li>
              <li>✓ Track your booking in the Bookings section</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/bookings")}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-bold"
          >
            Dashboard
          </button>
        </div>

        {/* Auto-redirect Message */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Redirecting to bookings in 5 seconds...
        </p>
      </div>
    </div>
  )
}
