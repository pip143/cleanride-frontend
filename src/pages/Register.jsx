import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axiosInstance from "../services/api"
import { useAuth } from "../shared/hooks/useAuth"
import { CarIcon, UserIcon } from "../components/Icons"
import "../styles/auth.css"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("customer")
  const navigate = useNavigate()
  const { login } = useAuth()

  const registerUser = async (credentials) => {
    const response = await axiosInstance.post("/api/auth/register", credentials)
    return response
  }

  const validate = () => {
    const errs = {}
    const nameField = role === "provider" ? "carwashName" : "name"
    const nameValue = role === "provider" ? name : name
    
    if (!nameValue.trim() || nameValue.trim().length < 2)
      errs[nameField] = role === "provider" ? "Carwash name must be at least 2 characters" : "Name must be at least 2 characters"
    if (!username.trim() || username.trim().length < 3)
      errs.username = "Username must be at least 3 characters"
    if (!email.trim() || !EMAIL_RE.test(email))
      errs.email = "Enter a valid email address"
    if (!password || password.length < 8)
      errs.password = "Password must be at least 8 characters"
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
      const payload = role === "provider" 
        ? { carwashName: name.trim(), username: username.trim(), email: email.trim(), password, role }
        : { name: name.trim(), username: username.trim(), email: email.trim(), password, role }
      
      const response = await registerUser(payload)
      const userId = response.data?.userId

      if (!userId) {
        setServerError(response.data?.message || "Registration failed")
      } else {
        const userRole = response.data?.role || "CUSTOMER"
        login(String(userId), userRole)
        navigate(userRole === "PROVIDER" ? "/provider/dashboard" : "/dashboard")
      }
    } catch (err) {
      const msg = err.response?.data?.error
      if (msg) {
        setServerError(msg)
      } else if (err.response?.status === 409) {
        setServerError("Username or email already exists")
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
          <Link to="/" className="auth-tab-link">
            <button className="auth-tab">Login</button>
          </Link>
          <button className="auth-tab active">Register</button>
        </div>

        <p className="auth-role-label">I am a</p>
        <div className="auth-role-buttons">
          {["customer", "provider"].map((r) => (
            <button
              key={r}
              className={`auth-role-btn${role === r ? " active" : ""}`}
              onClick={() => setRole(r)}
            >
              <UserIcon />
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {serverError && <p className="auth-error">{serverError}</p>}

          <label className="auth-label">{role === "provider" ? "Carwash Name" : "Full Name"}</label>
          <input
            type="text"
            placeholder={role === "provider" ? "My Carwash" : "John Doe"}
            className={`auth-input${fieldErrors.name || fieldErrors.carwashName ? " error" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {(fieldErrors.name || fieldErrors.carwashName) && <p className="auth-field-error">{fieldErrors.name || fieldErrors.carwashName}</p>}

          <label className="auth-label">Username</label>
          <input
            type="text"
            placeholder="johndoe123"
            className={`auth-input${fieldErrors.username ? " error" : ""}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {fieldErrors.username && <p className="auth-field-error">{fieldErrors.username}</p>}

          <label className="auth-label">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            className={`auth-input${fieldErrors.email ? " error" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}

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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  )
}
