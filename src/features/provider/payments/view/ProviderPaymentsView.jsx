import { useEffect, useState } from "react"
import { useAuth } from "../../../../shared/hooks/useAuth"
import { useProviderPaymentsPresenter } from "../presenter/useProviderPaymentsPresenter"
import { PAYMENT_METHODS } from "../../../../core/constants"
import { LoadingSpinner } from "../../../../components/LoadingSpinner"
import { useToast } from "../../../../shared/hooks/useToast"

/**
 * ProviderPaymentsView - Display earnings and handle payout requests (mock)
 * Shows earnings summary and allows providers to view payment history
 */
export const ProviderPaymentsView = () => {
  const { userId } = useAuth()
  const presenter = useProviderPaymentsPresenter()
  const { showToast } = useToast()
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState("")
  const [payoutMethod, setPayoutMethod] = useState(PAYMENT_METHODS.BANK_TRANSFER)
  const [activeTab, setActiveTab] = useState("earnings")

  useEffect(() => {
    if (userId) {
      presenter.loadEarnings(userId)
      presenter.loadPaymentHistory(userId)
      presenter.loadPayoutHistory(userId)
      presenter.getAvailableBalance(userId)
    }
  }, [userId])

  const handleRequestPayout = async () => {
    if (!payoutAmount || isNaN(payoutAmount) || payoutAmount <= 0) {
      showToast("Please enter a valid amount", "error")
      return
    }

    const result = await presenter.requestPayout(
      userId,
      parseFloat(payoutAmount),
      payoutMethod
    )
    if (result.success) {
      showToast("Payout request submitted successfully", "success")
      setShowPayoutModal(false)
      setPayoutAmount("")
    } else {
      showToast(result.error, "error")
    }
  }

  if (presenter.loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Earnings & Payouts
          </h1>
          <p className="text-purple-700">
            Track your earnings and manage payouts
          </p>
        </div>

        {/* Error Display */}
        {presenter.error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
            {presenter.error}
          </div>
        )}

        {/* Earnings Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">Total Earnings</p>
            <p className="text-3xl font-bold text-purple-600 mb-2">
              {presenter.earnings.displayTotal}
            </p>
            <p className="text-gray-500 text-xs">All-time</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">This Month</p>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {presenter.earnings.displayMonth}
            </p>
            <p className="text-gray-500 text-xs">Current period</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mb-2">
              {presenter.earnings.displayPending}
            </p>
            <p className="text-gray-500 text-xs">From pending bookings</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-2">Withdrawn</p>
            <p className="text-3xl font-bold text-green-600 mb-2">
              {presenter.earnings.displayWithdrawn}
            </p>
            <p className="text-gray-500 text-xs">Already paid out</p>
          </div>
        </div>

        {/* Available Balance and Payout Button */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-200 mb-2">Available Balance</p>
              <p className="text-4xl font-bold">${presenter.availableBalance.toFixed(2)}</p>
            </div>
            {presenter.availableBalance > 0 && (
              <button
                onClick={() => setShowPayoutModal(true)}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-bold"
              >
                Request Payout
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b-2 border-purple-200">
          <button
            onClick={() => setActiveTab("earnings")}
            className={`px-6 py-3 font-semibold border-b-4 -mb-0.5 transition-all ${
              activeTab === "earnings"
                ? "text-purple-600 border-purple-600"
                : "text-purple-500 border-transparent hover:text-purple-700"
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab("payouts")}
            className={`px-6 py-3 font-semibold border-b-4 -mb-0.5 transition-all ${
              activeTab === "payouts"
                ? "text-purple-600 border-purple-600"
                : "text-purple-500 border-transparent hover:text-purple-700"
            }`}
          >
            Payout Requests
          </button>
        </div>

        {/* Payment History Tab */}
        {activeTab === "earnings" && (
          <div>
            {presenter.paymentHistory.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-600 text-lg">No payments yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {presenter.paymentHistory.map((payment, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {payment.displayDate}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {payment.description || "Service Payment"}
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                          {payment.displayAmount}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full font-semibold ${presenter.getPaymentStatusColor(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Payout Requests Tab */}
        {activeTab === "payouts" && (
          <div>
            {presenter.payoutHistory.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-600 text-lg">
                  No payout requests yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {presenter.payoutHistory.map((payout, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">
                            Payout Request
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${presenter.getPayoutStatusColor(
                              payout.status
                            )}`}
                          >
                            {payout.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          Requested: {payout.displayDate}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Method: {payout.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-purple-600">
                          {payout.displayAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Request Payout
            </h3>

            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2">Available Balance</p>
              <p className="text-3xl font-bold text-purple-600">
                ${presenter.availableBalance.toFixed(2)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Enter amount"
                max={presenter.availableBalance}
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPayoutModal(false)
                  setPayoutAmount("")
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestPayout}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Request Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
