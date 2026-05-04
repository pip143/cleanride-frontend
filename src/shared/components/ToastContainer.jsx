import { useContext } from 'react'
import { ToastContext } from '../../context/Toast.context'
import '../styles/toast-container.css'

export function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext)

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          role="alert"
        >
          <div className="toast-content">
            <span>{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
