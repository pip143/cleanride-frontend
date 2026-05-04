import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../../shared/hooks/useAuth"
import { useToast } from "../../../../shared/hooks/useToast"
import { LoadingSpinner } from "../../../../components/LoadingSpinner"
import ProviderServicesPresenter from "../presenter/useProviderServicesPresenter"

export function ProviderServicesListView() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const { showToast } = useToast()

  const [state, setState] = useState({
    services: [],
    loading: true,
    error: null,
    search: "",
  })

  useEffect(() => {
    if (!userId) {
      setState((prev) => ({ ...prev, error: "User not logged in" }))
      return
    }
    loadServices()
  }, [userId])

  const loadServices = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const result = await ProviderServicesPresenter.loadServices(userId)

    if (result.success) {
      setState((prev) => ({
        ...prev,
        services: result.data,
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

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return

    const result = await ProviderServicesPresenter.deleteService(serviceId)
    if (result.success) {
      showToast("Service deleted successfully", "success")
      loadServices()
    } else {
      showToast(result.error, "error")
    }
  }

  if (state.loading) return <LoadingSpinner />

  const filtered = state.services.filter((s) =>
    s.name.toLowerCase().includes(state.search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 border-b-2 border-purple-800 px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Services</h1>
            <p className="text-purple-100 mt-1">Create and manage your car wash services</p>
          </div>
          <button
            onClick={() => navigate("/provider/services/new")}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition font-medium hover:scale-105"
          >
            + Add Service
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <svg className="absolute left-3 top-3 w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path strokeWidth="2" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search services..."
              value={state.search}
              onChange={(e) =>
                setState((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full pl-10 pr-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Services List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border-2 border-purple-200 p-12 text-center">
            <div className="text-5xl mb-4">🧹</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services yet</h3>
            <p className="text-gray-600 mb-6">Create your first service to get started</p>
            <button
              onClick={() => navigate("/provider/services/new")}
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Create Service
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md border-2 border-purple-100 p-6 hover:shadow-lg hover:border-purple-300 transition"
              >
                <h3 className="font-semibold text-purple-900 mb-2">{service.name}</h3>
                <p className="text-sm text-purple-700 mb-4">{service.description}</p>

                <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-purple-200">
                  <div>
                    <span className="text-2xl font-bold text-purple-600">
                      {service.displayPrice}
                    </span>
                    <p className="text-xs text-purple-600">{service.displayDuration}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/provider/services/${service.id}/edit`, {
                        state: { service },
                      })
                    }
                    className="flex-1 px-3 py-2 border-2 border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 font-medium transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="flex-1 px-3 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium transition text-sm"
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
