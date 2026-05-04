import { useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useAuth } from "../../../shared/hooks/useAuth"
import bookingsPresenter from "../presenter/useBookingsPresenter"
import { LoadingSpinner } from "../../../components/LoadingSpinner"

/**
 * Booking Form View
 * Form to create or edit a booking
 */
export default function BookingFormView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const { userId } = useAuth()

  const editingBooking = location.state?.booking
  const isEditing = !!id && !!editingBooking

  const [formData, setFormData] = useState({
    vehicleId: "",
    serviceId: "",
    bookingDate: "",
    timeSlot: "",
    notes: "",
    ...(editingBooking || {})
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
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
    const validation = bookingsPresenter.validateBooking(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    try {
      let result

      if (isEditing) {
        result = await bookingsPresenter.updateBooking(id, formData)
      } else {
        result = await bookingsPresenter.createBooking({
          ...formData,
          userId
        })
      }

      if (result.success) {
        navigate("/bookings")
      } else {
        setErrors({ submit: result.error })
      }
    } catch {
      setErrors({ submit: "Failed to save booking" })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={styles.container}>
      <h1>{isEditing ? "Edit Booking" : "Create Booking"}</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        {errors.submit && (
          <div style={styles.error}>{errors.submit}</div>
        )}

        <div style={styles.formGroup}>
          <label>Vehicle</label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select a vehicle</option>
            {/* Options will be populated from vehicles list */}
          </select>
          {errors.vehicleId && <span style={styles.fieldError}>{errors.vehicleId}</span>}
        </div>

        <div style={styles.formGroup}>
          <label>Service</label>
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select a service</option>
            {/* Options will be populated from services list */}
          </select>
          {errors.serviceId && <span style={styles.fieldError}>{errors.serviceId}</span>}
        </div>

        <div style={styles.formGroup}>
          <label>Booking Date</label>
          <input
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.bookingDate && <span style={styles.fieldError}>{errors.bookingDate}</span>}
        </div>

        <div style={styles.formGroup}>
          <label>Time Slot</label>
          <input
            type="time"
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.timeSlot && <span style={styles.fieldError}>{errors.timeSlot}</span>}
        </div>

        <div style={styles.formGroup}>
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            style={{ ...styles.input, minHeight: "100px" }}
            placeholder="Any special requests..."
          />
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {isEditing ? "Update Booking" : "Create Booking"}
          </button>
          <button
            type="button"
            style={styles.cancelBtn}
            onClick={() => navigate("/bookings")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px"
  },
  form: {
    display: "grid",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px"
  },
  fieldError: {
    color: "#f44336",
    fontSize: "12px"
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "4px"
  },
  buttonGroup: {
    display: "flex",
    gap: "10px"
  },
  submitBtn: {
    flex: 1,
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  cancelBtn: {
    flex: 1,
    padding: "10px 20px",
    backgroundColor: "#ccc",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
}
