import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../shared/hooks/useAuth"
import { useToast } from "../../../shared/hooks/useToast"
import { DashboardPresenter } from "../index"
import { ServiceIcon } from "../../../components/Icons"
import { LoadingSpinner } from "../../../components/LoadingSpinner"

export default function DashboardView() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const { showToast } = useToast()
  
  const [state, setState] = useState({
    services: [],
    stats: {},
    greeting: "Welcome back!",
    loading: true,
    error: null,
    search: "",
  })

  const loadData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const result = await DashboardPresenter.loadDashboardData(userId)
    
    if (result.success) {
      setState((prev) => ({
        ...prev,
        services: result.data.services,
        stats: result.data.stats,
        greeting: result.data.userGreeting,
        loading: false,
      }))
    } else {
      setState((prev) => ({
        ...prev,
        error: result.error,
        loading: false,
      }))
      showToast(result.error, 'error')
    }
  }

  useEffect(() => {
    if (!userId) return
    loadData()
  }, [userId])

  if (state.loading) return <LoadingSpinner />

  const filteredServices = state.services.filter((s) =>
    s.name.toLowerCase().includes(state.search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b-2 border-blue-800 px-6 py-8 text-white">
        <h2 className="text-3xl font-bold mb-2">{state.greeting}</h2>
        <p className="text-blue-100">Book your car wash service</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatBox stat={state.stats.totalBookings || 0} label="Total Bookings" />
          <StatBox stat={state.stats.vehiclesCount || 0} label="Vehicles" />
          <StatBox stat={state.stats.completedServices || 0} label="Completed" />
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <svg className="absolute left-3 top-3 w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search services..."
              value={state.search}
              onChange={(e) => setState((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div>
          <h3 className="text-2xl font-bold text-blue-900 mb-6">Available Services</h3>
          {filteredServices.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-blue-200">
              <p className="text-blue-700">No services found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service}
                  onBook={() => {
                    navigate("/bookings/new", { state: { selectedService: service } })
                    showToast(`Selected ${service.name}`, 'info')
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatBox({ stat, label }) {
  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md hover:shadow-lg hover:border-blue-400 transition">
      <div className="text-3xl font-bold text-blue-600">{stat}</div>
      <div className="text-sm text-blue-700 mt-2 font-medium">{label}</div>
    </div>
  )
}

function ServiceCard({ service, onBook }) {
  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-blue-100 p-6 hover:shadow-lg hover:border-blue-300 transition-all">
      <div className="flex justify-center mb-4 p-4 bg-blue-100 rounded-lg w-fit mx-auto hover:bg-blue-200 transition">
        <ServiceIcon type={service.icon} />
      </div>
      <h4 className="font-semibold text-blue-900 text-center mb-2">{service.name}</h4>
      <p className="text-sm text-blue-700 text-center mb-4">{service.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-blue-600">{service.displayPrice}</span>
        <button
          onClick={onBook}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Book
        </button>
      </div>
    </div>
  )
}
