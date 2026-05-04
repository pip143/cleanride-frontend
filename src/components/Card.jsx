/**
 * Card component
 * Reusable card for displaying content
 */
export function Card({ children, className = "", ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * ServiceCard component
 * Card for displaying service information
 */
export function ServiceCard({ service, onBook }) {
  return (
    <Card className="service-card">
      <div className="service-icon">🚗</div>
      <h3>{service.name}</h3>
      <p className="service-description">{service.description}</p>
      <div className="service-meta">
        <span className="service-price">${service.price}</span>
        <span className="service-duration">{service.duration} min</span>
      </div>
      <button className="service-book-btn" onClick={() => onBook(service)}>
        Book Now
      </button>
    </Card>
  )
}

/**
 * BookingCard component
 * Card for displaying booking information
 */
export function BookingCard({ booking, onEdit, onCancel, onReview }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#ff9800"
      case "CONFIRMED":
        return "#4caf50"
      case "IN_PROGRESS":
        return "#2196f3"
      case "COMPLETED":
        return "#9c27b0"
      case "CANCELLED":
        return "#f44336"
      default:
        return "#999"
    }
  }

  return (
    <Card className="booking-card">
      <div className="booking-header">
        <h3>{booking.serviceName || "Service"}</h3>
        <span
          className="booking-status"
          style={{ backgroundColor: getStatusColor(booking.status) }}
        >
          {booking.status}
        </span>
      </div>

      <div className="booking-details">
        <p>
          <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {booking.time}
        </p>
        <p>
          <strong>Location:</strong> {booking.location}
        </p>
        <p>
          <strong>Vehicle:</strong> {booking.vehicleName}
        </p>
      </div>

      <div className="booking-actions">
        {booking.status === "PENDING" && (
          <>
            <button className="btn-primary" onClick={() => onEdit(booking)}>
              Edit
            </button>
            <button className="btn-danger" onClick={() => onCancel(booking.id)}>
              Cancel
            </button>
          </>
        )}
        {booking.status === "COMPLETED" && onReview && (
          <button className="btn-primary" onClick={() => onReview(booking)}>
            Leave Review
          </button>
        )}
      </div>
    </Card>
  )
}

/**
 * VehicleCard component
 * Card for displaying vehicle information
 */
export function VehicleCard({ vehicle, onEdit, onDelete }) {
  return (
    <Card className="vehicle-card">
      <div className="vehicle-icon">🚙</div>
      <h3>
        {vehicle.make} {vehicle.model}
      </h3>
      <p className="vehicle-type">{vehicle.vehicleType}</p>

      <div className="vehicle-details">
        <p>
          <strong>Plate:</strong> {vehicle.plateNumber}
        </p>
        <p>
          <strong>Color:</strong> {vehicle.color}
        </p>
      </div>

      <div className="vehicle-actions">
        <button className="btn-primary" onClick={() => onEdit(vehicle)}>
          Edit
        </button>
        <button className="btn-danger" onClick={() => onDelete(vehicle.id)}>
          Delete
        </button>
      </div>
    </Card>
  )
}
