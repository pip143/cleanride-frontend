import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../../../shared/hooks/useAuth"
import { useToast } from "../../../../shared/hooks/useToast"
import { LoadingSpinner } from "../../../../components/LoadingSpinner"
import ProviderServicesPresenter from "../presenter/useProviderServicesPresenter"
import { validateService } from "../../../../core/utils/validation"

export function ProviderServiceFormView() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userId } = useAuth()
  const { showToast } = useToast()

  const service = location.state?.service
  const isEditMode = !!service

  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    price: service?.price || 0,
    duration: service?.duration || 30,
    providerId: userId,
  })

  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      let newValue = value
      if (name === "price" || name === "duration") {
        newValue = value === "" ? 0 : parseFloat(value)
      }
      return {
        ...prev,
        [name]: newValue,
      }
    })

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

    // Validate
    const validation = validateService(formData)
    if (validation) {
      showToast(validation, "error")
      setErrors({ form: validation })
      return
    }

    setSaving(true)

    let result
    if (isEditMode) {
      result = await ProviderServicesPresenter.updateService(service.id, formData)
    } else {
      result = await ProviderServicesPresenter.createService(formData)
    }

    if (result.success) {
      showToast(
        isEditMode ? "Service updated successfully" : "Service created successfully",
        "success"
      )
      navigate("/provider/services")
    } else {
      showToast(result.error, "error")
      setErrors({ form: result.error })
    }

    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 border-b-2 border-purple-800 px-6 py-8 text-white">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Service" : "Create New Service"}
        </h1>
        <p className="text-purple-100 mt-1">
          {isEditMode ? "Update your service details" : "Add a new service to your catalog"}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md border-2 border-purple-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-800">
                {errors.form}
              </div>
            )}

            {/* Service Name */}
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Exterior Wash"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service..."
                rows="4"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              />
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="30"
                  min="15"
                  step="15"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t-2 border-purple-200">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving..."
                  : isEditMode
                    ? "Update Service"
                    : "Create Service"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/provider/services")}
                className="flex-1 px-6 py-3 border-2 border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
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
