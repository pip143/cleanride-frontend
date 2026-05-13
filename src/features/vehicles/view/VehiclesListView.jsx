import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../shared/hooks/useAuth"
import { useToast } from "../../../shared/hooks/useToast"
import { LoadingSpinner } from "../../../components/LoadingSpinner"
import vehiclesPresenter from "../presenter/useVehiclesPresenter"

export default function VehiclesListView() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const { showToast } = useToast()

  const [state, setState] = useState({
    vehicles: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!userId) {
      setState((prev) => ({ ...prev, error: "User not logged in" }))
      return
    }
    loadVehicles()
  }, [userId])

  const loadVehicles = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const result = await vehiclesPresenter.loadVehicles(userId)
    if (result.success) {
      setState((prev) => ({
        ...prev,
        vehicles: result.data,
        loading: false,
      }))
    } else {
      setState((prev) => ({
        ...prev,
        error: result.error,
        loading: false,
      }))
      showToast(result.error, "error")
    }
  }

  const handleDelete = async (vehicleId) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return

    const result = await vehiclesPresenter.deleteVehicle(vehicleId)
    if (result.success) {
      showToast("Vehicle deleted successfully", "success")
      loadVehicles()
    } else {
      showToast(result.error, "error")
    }
  }

  if (state.loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">My Vehicles</h1>
            <p className="text-blue-700 mt-1">Manage your vehicles</p>
          </div>
          <button
            onClick={() => navigate("/vehicles/new")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition font-medium hover:scale-105"
          >
            + Add Vehicle
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {state.error && (
          <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-4 text-red-800">
            {state.error}
          </div>
        )}

        {state.vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border-2 border-blue-200 p-12 text-center">
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles</h3>
            <p className="text-gray-600 mb-6">Add your first vehicle to book services</p>
            <button
              onClick={() => navigate("/vehicles/new")}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add Vehicle
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-lg shadow-md border-2 border-blue-100 p-6 hover:shadow-lg hover:border-blue-300 transition"
              >
                <h3 className="font-semibold text-blue-900 text-lg">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-sm text-blue-600 font-medium">{vehicle.year}</p>
                <p className="text-sm text-blue-700 mt-2">Plate: {vehicle.licensePlate || vehicle.plateNumber || "N/A"}</p>
                <p className="text-xs text-blue-600 mt-1">{vehicle.color}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/vehicles/${vehicle.id}/edit`, {
                        state: { vehicle },
                      })
                    }
                    className="flex-1 px-3 py-2 border-2 border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="flex-1 px-3 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
