import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useAuth } from "../../../shared/hooks/useAuth"
import vehiclesPresenter from "../presenter/useVehiclesPresenter"
import { LoadingSpinner } from "../../../components/LoadingSpinner"

/**
 * Vehicle Form View
 */
export default function VehicleFormView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const { userId } = useAuth()

  const rawEditingVehicle = location.state?.vehicle
  const editingVehicle = rawEditingVehicle
    ? {
        ...rawEditingVehicle,
        licensePlate: rawEditingVehicle.licensePlate || rawEditingVehicle.plateNumber || "",
      }
    : null
  const isEditing = !!id && !!editingVehicle

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    vehicleType: "",
    color: "",
    ...(editingVehicle || {})
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) : value
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

    const validation = vehiclesPresenter.validateVehicle(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    try {
      let result

      if (isEditing) {
        result = await vehiclesPresenter.updateVehicle(id, {
          ...formData,
          plateNumber: formData.licensePlate,
        })
      } else {
        result = await vehiclesPresenter.createVehicle({
          ...formData,
          plateNumber: formData.licensePlate,
          userId
        })
      }

      if (result.success) {
        navigate("/vehicles")
      } else {
        setErrors({ submit: result.error })
      }
    } catch (err) {
      setErrors({ submit: "Failed to save vehicle" })
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) return <LoadingSpinner />

  return (
    <div style={styles.container}>
      <h1>{isEditing ? "Edit Vehicle" : "Add Vehicle"}</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        {errors.submit && (
          <div style={styles.error}>{errors.submit}</div>
        )}

        <div style={styles.formGroup}>
          <label>Make</label>
          <input
            type="text"
            name="make"
            value={formData.make}
            onChange={handleChange}
            placeholder="Toyota, Honda, BMW..."
            style={styles.input}
          />
          {errors.make && <span style={styles.fieldError}>{errors.make}</span>}
        </div>

        <div style={styles.formGroup}>
          <label>Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Camry, Civic, 3 Series..."
            style={styles.input}
          />
          {errors.model && <span style={styles.fieldError}>{errors.model}</span>}
        </div>

        <div style={styles.formGroup}>
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="1990"
            max={new Date().getFullYear() + 1}
            style={styles.input}
          />
          {errors.year && <span style={styles.fieldError}>{errors.year}</span>}
        </div>

        <div style={styles.formGroup}>
          <label>License Plate</label>
          <input
            type="text"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            placeholder="ABC-1234"
            style={styles.input}
          />
          {errors.licensePlate && <span style={styles.fieldError}>{errors.licensePlate}</span>}
        </div>

        <div style={styles.formGroup}>
          <label>Vehicle Type</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select type</option>
            {vehiclesPresenter.getVehicleTypeOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.vehicleType && <span style={styles.fieldError}>{errors.vehicleType}</span>}
        </div>

        <div style={styles.formGroup}>
          <label>Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Black, White, Red..."
            style={styles.input}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {isEditing ? "Update Vehicle" : "Add Vehicle"}
          </button>
          <button
            type="button"
            style={styles.cancelBtn}
            onClick={() => navigate("/vehicles")}
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
