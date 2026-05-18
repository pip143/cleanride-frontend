import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { PAYMENT_METHODS } from "../../../core/constants"
import { useToast } from "../../../shared/hooks/useToast"
import BookingsPresenter from "../../bookings/presenter/useBookingsPresenter"

export const PaymentMethodView = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const booking = location.state?.booking
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const amount = Number(
    booking?.service?.price ||
      String(booking?.displayPrice || "0").replace(/[^0-9.]/g, "") ||
      0
  )
  const serviceName = booking?.serviceName || booking?.service?.name || "Selected service"

  const paymentMethodOptions = [
    {
      id: PAYMENT_METHODS.CASH,
      name: "Cash",
      description: "Record this booking as paid in cash",
      icon: "Cash",
      badge: "On-site",
    },
    {
      id: PAYMENT_METHODS.GCASH,
      name: "GCash",
      description: "Record this booking as paid through GCash",
      icon: "GCash",
      badge: "Mobile",
    },
    {
      id: PAYMENT_METHODS.CARD,
      name: "Credit/Debit Card",
      description: "Record this booking as paid by card",
      icon: "Card",
      badge: "Card",
    },
  ]

  const handleContinue = async () => {
    if (!booking?.id) {
      showToast("No booking selected for payment", "error")
      navigate("/bookings")
      return
    }

    if (!selectedMethod) {
      showToast("Please select a payment method", "error")
      return
    }

    setIsProcessing(true)
    const result = await BookingsPresenter.payBooking(booking.id)
    setIsProcessing(false)

    if (!result.success) {
      showToast(result.error, "error")
      return
    }

    navigate("/payment/success", {
      replace: true,
      state: {
        method: selectedMethod,
        amount,
        bookingId: booking.id,
        serviceName,
        paymentStatus: "PAID",
      },
    })
  }

  if (!booking?.id) {
    return (
      <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-8 max-w-md text-center shadow-md">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">No Booking Selected</h1>
          <p className="text-gray-600 mb-6">Open payment from a confirmed booking.</p>
          <button
            onClick={() => navigate("/bookings")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Select Payment Method</h1>
          <p className="text-blue-700">Choose how the customer payment was made</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Amount</p>
              <p className="text-4xl font-bold text-blue-600">${amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm mb-2">Service</p>
              <p className="text-lg font-semibold text-gray-900">{serviceName}</p>
              <p className="text-xs text-gray-500">Booking #{booking.id}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {paymentMethodOptions.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => setSelectedMethod(option.id)}
              className={`w-full text-left p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedMethod === option.id
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300 shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{option.name}</h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {option.badge}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-8">
          <p className="text-blue-900 text-sm">
            This MVP records payment status in CleanRide. It does not process real bank or card payments.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-bold"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={isProcessing || !selectedMethod}
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
              isProcessing
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } ${!selectedMethod && "opacity-50"}`}
          >
            {isProcessing ? "Saving Payment..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  )
}