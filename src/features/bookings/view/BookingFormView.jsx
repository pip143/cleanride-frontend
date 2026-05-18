import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useAuth } from "../../../shared/hooks/useAuth"
import bookingsPresenter from "../presenter/useBookingsPresenter"
import servicesModel from "../../services/model/ServicesModel"
import vehiclesModel from "../../vehicles/model/VehiclesModel"
import { LoadingSpinner } from "../../../components/LoadingSpinner"

export default function BookingFormView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const { userId } = useAuth()
  const query = new URLSearchParams(location.search)

  const editingBooking = location.state?.booking
  const selectedService = location.state?.selectedService
  const serviceIdFromUrl = query.get("serviceId") || ""
  const isEditing = !!id && !!editingBooking

  const [vehicles, setVehicles] = useState([])
  const [services, setServices] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    vehicleId: editingBooking?.vehicle?.id || editingBooking?.vehicleId || "",
    serviceId: selectedService?.id || editingBooking?.service?.id || editingBooking?.serviceId || serviceIdFromUrl,
    bookingDate: editingBooking?.bookingDate || editingBooking?.scheduledDate || "",
    timeSlot: editingBooking?.bookingTime || editingBooking?.scheduledTime || editingBooking?.timeSlot || "",
    notes: editingBooking?.notes || "",
    paymentStatus: editingBooking?.paymentStatus || "UNPAID",
    paymentMethod: editingBooking?.paymentStatus === "PAID" ? "CASH" : "PAY_LATER",
  })

  useEffect(() => {
    if (!userId) return

    async function loadOptions() {
      setLoadingOptions(true)
      setErrors({})
      try {
        const [vehiclesData, servicesData] = await Promise.all([
          vehiclesModel.getVehicles(userId),
          servicesModel.getServices(),
        ])
        setVehicles(vehiclesData || [])
        setServices(servicesData || [])
      } catch {
        setErrors({ submit: "Unable to load vehicles and services. Please try again." })
      } finally {
        setLoadingOptions(false)
      }
    }

    loadOptions()
  }, [userId])

  const selectedServiceData = useMemo(() => {
    const serviceId = String(formData.serviceId || "")
    if (!serviceId) return null
    return services.find((service) => String(service.id) === serviceId) || selectedService || null
  }, [services, selectedService, formData.serviceId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = bookingsPresenter.validateBooking(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setSaving(true)
    try {
      const paymentStatus = formData.paymentMethod === "CASH" ? "PAID" : "UNPAID"
      const payload = {
        ...formData,
        userId,
        vehicleId: Number(formData.vehicleId),
        serviceId: Number(formData.serviceId),
        bookingTime: formData.timeSlot,
        paymentStatus,
      }

      const result = isEditing
        ? await bookingsPresenter.updateBooking(id, payload)
        : await bookingsPresenter.createBooking(payload)

      if (result.success) {
        navigate("/bookings")
      } else {
        setErrors({ submit: result.error })
      }
    } catch {
      setErrors({ submit: "Failed to save booking" })
    } finally {
      setSaving(false)
    }
  }

  if (loadingOptions || saving) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-950">{isEditing ? "Edit Booking" : "Create Booking"}</h1>
          <p className="text-blue-700 mt-1">Choose your vehicle, confirm the service, and schedule your visit.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-2 border-blue-100 rounded-xl shadow-sm p-6 space-y-5">
          {errors.submit && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700">{errors.submit}</div>}

          {vehicles.length === 0 && (
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-yellow-800 flex items-center justify-between gap-4">
              <span>You need to add a vehicle before creating a booking.</span>
              <button type="button" onClick={() => navigate("/vehicles/new")} className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium">Add Vehicle</button>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-blue-950 mb-2">Vehicle</label>
            <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} className="w-full rounded-lg border-2 border-blue-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => {
                const plate = vehicle.licensePlate || vehicle.plateNumber || "No plate"
                return (
                  <option key={vehicle.id} value={vehicle.id}>
                    {[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ")} - {plate}
                  </option>
                )
              })}
            </select>
            {errors.vehicleId && <p className="text-sm text-red-600 mt-1">{errors.vehicleId}</p>}
          </div>

          {selectedServiceData ? (
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-700">Selected service</p>
                  <h2 className="text-xl font-bold text-blue-950">{selectedServiceData.name}</h2>
                  <p className="text-blue-700 mt-1">{selectedServiceData.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-700">${Number(selectedServiceData.price || 0).toFixed(2)}</p>
                  <button type="button" onClick={() => setFormData((prev) => ({ ...prev, serviceId: "" }))} className="text-sm text-blue-700 underline mt-2">Change</button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-blue-950 mb-2">Service</label>
              <select name="serviceId" value={formData.serviceId} onChange={handleChange} className="w-full rounded-lg border-2 border-blue-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.name} - ${Number(service.price || 0).toFixed(2)}</option>
                ))}
              </select>
              {errors.serviceId && <p className="text-sm text-red-600 mt-1">{errors.serviceId}</p>}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-blue-950 mb-2">Booking Date</label>
              <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} min={new Date().toISOString().split("T")[0]} className="w-full rounded-lg border-2 border-blue-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.bookingDate && <p className="text-sm text-red-600 mt-1">{errors.bookingDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-950 mb-2">Time</label>
              <input type="time" name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full rounded-lg border-2 border-blue-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.timeSlot && <p className="text-sm text-red-600 mt-1">{errors.timeSlot}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-950 mb-2">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full min-h-28 rounded-lg border-2 border-blue-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Any special requests..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-950 mb-2">Payment</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full rounded-lg border-2 border-blue-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="PAY_LATER">Pay later / unpaid</option>
              <option value="CASH">Cash paid</option>
            </select>
            <p className="text-sm text-blue-700 mt-2">
              Choose Cash paid when the customer already paid in cash. This will mark the booking as PAID for both customer and provider.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={vehicles.length === 0} className="flex-1 rounded-lg bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {isEditing ? "Update Booking" : "Create Booking"}
            </button>
            <button type="button" onClick={() => navigate("/bookings")} className="flex-1 rounded-lg bg-gray-200 px-5 py-3 text-gray-900 font-semibold hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
