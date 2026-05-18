import { useEffect, useState } from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { useAuth } from "../../../shared/hooks/useAuth"
import { useToast } from "../../../shared/hooks/useToast"
import reviewsPresenter from "../presenter/useReviewsPresenter"
import { LoadingSpinner } from "../../../components/LoadingSpinner"
import { validateReview } from "../../../core/utils/validation"

/**
 * Review Form View
 * Form to submit a review after service completion
 */
export default function ReviewFormView() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { userId } = useAuth()
  const { showToast } = useToast()

  const bookingId =
    location.state?.bookingId ||
    searchParams.get("bookingId") ||
    sessionStorage.getItem("reviewBookingId")

  const [formData, setFormData] = useState({
    bookingId: bookingId || "",
    rating: 5,
    comment: "",
    userId,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!bookingId) {
      showToast("No booking selected", "error")
      setTimeout(() => navigate("/bookings"), 2000)
    } else {
      sessionStorage.setItem("reviewBookingId", String(bookingId))
      setFormData((prev) => ({
        ...prev,
        bookingId,
        userId,
      }))
    }
  }, [bookingId, navigate, showToast, userId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate using centralized validator
    const validationErrors = validateReview(formData)
    if (validationErrors) {
      const firstError = Object.values(validationErrors)[0] || "Please check your review details"
      showToast(firstError, "error")
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const result = await reviewsPresenter.createReview(formData)

      if (result.success) {
        showToast("Review submitted successfully!", "success")
        sessionStorage.removeItem("reviewBookingId")
        setTimeout(() => {
          navigate("/bookings")
        }, 1500)
      } else {
        showToast(result.error, "error")
        setErrors({ submit: result.error })
      }
    } catch (err) {
      showToast("Failed to submit review", "error")
      setErrors({ submit: "Failed to submit review" })
    } finally {
      setLoading(false)
    }
  }

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-lg shadow-md border-2 border-blue-200 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">No booking selected</h1>
          <p className="text-gray-600 mb-6">
            Please choose a completed booking before leaving a review.
          </p>
          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b-2 border-blue-800 px-6 py-8 text-white">
        <h1 className="text-3xl font-bold">Leave a Review</h1>
        <p className="text-blue-100 mt-1">Share your experience with this service</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md border-2 border-blue-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-800">
                {errors.submit}
              </div>
            )}

            {/* Rating Section */}
            <div>
              <label className="block text-lg font-semibold text-blue-900 mb-4">
                How would you rate your experience?
              </label>
              <div className="space-y-3">
                {[
                  { value: 5, label: "⭐⭐⭐⭐⭐ Excellent" },
                  { value: 4, label: "⭐⭐⭐⭐ Very Good" },
                  { value: 3, label: "⭐⭐⭐ Good" },
                  { value: 2, label: "⭐⭐ Fair" },
                  { value: 1, label: "⭐ Poor" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition ${
                      formData.rating === option.value
                        ? "bg-blue-50 border-blue-400"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={option.value}
                      checked={formData.rating === option.value}
                      onChange={handleChange}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="font-medium text-gray-800">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comment Section */}
            <div>
              <label className="block text-lg font-semibold text-blue-900 mb-2">
                Your Comment
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Tell us what you think about our service... (minimum 10 characters)"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none ${
                  errors.comment ? "border-red-400 bg-red-50" : "border-blue-200"
                }`}
                rows="6"
              />
              <div className="text-sm text-gray-600 mt-2">
                {formData.comment.length}/500 characters
              </div>
              {errors.comment && (
                <span className="text-sm text-red-600 mt-1 block">{errors.comment}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className="flex-1 px-6 py-3 border-2 border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
