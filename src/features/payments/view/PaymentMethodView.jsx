import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PAYMENT_METHODS } from "../../../core/constants"
import { useToast } from "../../../shared/hooks/useToast"

/**
 * PaymentMethodView - Select payment method for booking
 * Allows customers to choose how they want to pay (Cash, GCash, Card)
 * Mock implementation - in production would integrate with payment gateway
 */
export const PaymentMethodView = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock booking data - would come from location state in production
  const bookingPrice = 49.99

  const paymentMethodOptions = [
    {
      id: PAYMENT_METHODS.CASH,
      name: "Cash",
      description: "Pay the service provider directly at the time of service",
      icon: "💵",
      badge: "Most Popular",
    },
    {
      id: PAYMENT_METHODS.GCASH,
      name: "GCash",
      description: "Quick and secure mobile payment through GCash",
      icon: "📱",
      badge: "Fast",
    },
    {
      id: PAYMENT_METHODS.CARD,
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, or other major cards",
      icon: "💳",
      badge: "Secure",
    },
  ]

  const handleContinue = async () => {
    if (!selectedMethod) {
      showToast("Please select a payment method", "error")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      // Navigate to payment confirmation
      navigate("/payment/success", {
        state: {
          method: selectedMethod,
          amount: bookingPrice,
          bookingId: "mock-booking-id",
        },
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Select Payment Method
          </h1>
          <p className="text-blue-700">
            Choose how you'd like to pay for this service
          </p>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Amount</p>
              <p className="text-4xl font-bold text-blue-600">${bookingPrice.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm mb-2">Service</p>
              <p className="text-lg font-semibold text-gray-900">
                Car Wash - Standard
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Cards */}
        <div className="space-y-4 mb-8">
          {paymentMethodOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedMethod(option.id)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 ${
                selectedMethod === option.id
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300 shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{option.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {option.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {option.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMethod === option.id && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {option.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-8">
          <p className="text-blue-900 text-sm">
            <span className="font-semibold">Note:</span> Your payment information
            is secure and encrypted. We never store your card details.
          </p>
        </div>

        {/* Action Buttons */}
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
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all transform ${
              isProcessing
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
            } ${!selectedMethod && "opacity-50"}`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block animate-spin">⚙️</span>
                Processing...
              </span>
            ) : (
              "Continue to Payment"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
