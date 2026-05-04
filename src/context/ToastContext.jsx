import { useState, useCallback } from 'react'
import { ToastContext } from './Toast.context'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    const toast = { id, message, type }
    
    setToasts((prev) => [...prev, toast])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = {
    toasts,
    showToast,
    removeToast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}
