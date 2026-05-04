import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../shared/hooks/useAuth"
import axiosInstance from "../services/api"
import { CarIcon } from "../components/Icons"
import "../styles/auth.css"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const loginUser = async (credentials) => {
    const response = await axiosInstance.post("/api/auth/login", credentials)
    return response
  }

  const validate = () => {
    const errs = {}
    if (!username.trim() || username.trim().length < 3)
      errs.username = "Enter a valid username (min 3 characters)"
    if (!password)
      errs.password = "Password is required"
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})

    setLoading(true)
    try {
      const response = await loginUser({ username: username.trim(), password })
      const userId = response.data?.userId
      const userRole = response.data?.role || "CUSTOMER" // Backend should return role

      if (!userId) {
        setServerError(response.data?.message || "Login failed")
      } else {
        // Use auth context login function
        login(String(userId), userRole)
        
        // Navigate based on role
        if (userRole === "PROVIDER") {
          navigate("/provider/dashboard")
        } else {
          navigate("/dashboard")
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error
      if (msg) {
        setServerError(msg)
      } else if (err.response?.status === 401) {
        setServerError("Invalid username or password")
      } else if (err.response?.status >= 400 && err.response?.status < 500) {
        setServerError("Invalid details. Please check your information")
      } else {
        setServerError("Unable to connect to the server. Please try again")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <CarIcon />
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Welcome to CleanRide</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        <div className="auth-tabs">
          <button className="auth-tab active">Login</button>
          <Link to="/register" className="auth-tab-link">
            <button className="auth-tab">Register</button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {serverError && <p className="auth-error">{serverError}</p>}

          <label className="auth-label">Username</label>
          <input
            type="text"
            placeholder="your_username"
            className={`auth-input${fieldErrors.username ? " error" : ""}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {fieldErrors.username && <p className="auth-field-error">{fieldErrors.username}</p>}

          <label className="auth-label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className={`auth-input last${fieldErrors.password ? " error" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <a href="#" className="auth-forgot">Forgot password?</a>
      </div>
    </div>
  )
}