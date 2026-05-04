import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContextProvider"
import { ToastProvider } from "./context/ToastContext"
import { AppRouter } from "./core/routes"
import { Navigation } from "./components/Navigation"
import { ToastContainer } from "./shared/components/ToastContainer"

/**
 * Main App component
 * Entry point for the application
 * Wraps everything in AuthProvider and ToastProvider with BrowserRouter
 */
function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navigation />
          <AppRouter />
          <ToastContainer />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App