import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../../../shared/hooks/useToast"
import { ServicesPresenter } from "../index"
import { ServiceIcon } from "../../../components/Icons"
import { LoadingSpinner } from "../../../components/LoadingSpinner"

export default function ServicesView() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [state, setState] = useState({
    services: [],
    loading: true,
    error: null,
    search: "",
    sort: "name",
    sortOrder: "asc",
  })

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const result = await ServicesPresenter.loadServices()

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

  if (state.loading) return <LoadingSpinner />

  let filtered = ServicesPresenter.filterServices(state.services, state.search)
  filtered = ServicesPresenter.sortServices(filtered, state.sort, state.sortOrder)

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b-2 border-blue-800 px-6 py-8 text-white">
        <h1 className="text-3xl font-bold">Available Services</h1>
        <p className="text-blue-100 mt-1">Choose the perfect service for your vehicle</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Sort */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-3 w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full pl-10 pr-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <select
            value={state.sort}
            onChange={(e) =>
              setState((prev) => ({ ...prev, sort: e.target.value }))
            }
            className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-blue-900 font-medium"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        {/* Services Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-blue-200">
            <p className="text-blue-700">No services found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md border-2 border-blue-100 p-6 hover:shadow-lg hover:border-blue-300 transition"
              >
                <div className="flex justify-center mb-4 p-3 bg-blue-100 rounded-lg w-fit mx-auto hover:bg-blue-200 transition">
                  <ServiceIcon type={service.icon} />
                </div>
                <h3 className="text-center font-semibold text-blue-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-center text-sm text-blue-700 mb-4">
                  {service.formattedDescription}
                </p>
                <div className="flex justify-between items-center pt-4 border-t-2 border-blue-150">
                  <span className="text-lg font-bold text-blue-600">
                    {service.displayPrice}
                  </span>
                  <button
                    onClick={() => {
                      navigate(`/bookings/new?serviceId=${service.id}`, {
                        state: { selectedService: service },
                      })
                      showToast(`Selected ${service.name}`, "info")
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium"
                  >
                    Book Now
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
