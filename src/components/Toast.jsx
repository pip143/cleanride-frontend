import { useState, useEffect } from "react"
import { toastManager } from "../utils/toastManager"

/**
 * Toast notification component
 * Displays notifications using the toastManager
 */
export function Toast() {
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((notif) => {
      setNotification(notif)
    })

    return unsubscribe
  }, [])

  if (!notification) return null

  return (
    <div className={`toast toast-${notification.type}`}>
      {notification.type === "success" && <span>✓</span>}
      {notification.type === "error" && <span>✗</span>}
      {notification.type === "info" && <span>ℹ</span>}
      {notification.type === "warning" && <span>⚠</span>}
      <span>{notification.message}</span>
    </div>
  )
}
