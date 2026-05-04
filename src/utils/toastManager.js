/**
 * Toast notification manager
 * Handles success, error, and info notifications
 */

class ToastManager {
  constructor() {
    this.listeners = new Set()
  }

  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notify(message, type = "info", duration = 3000) {
    const id = Date.now()
    const notification = { id, message, type }

    this.listeners.forEach((callback) => callback(notification))

    if (duration > 0) {
      setTimeout(() => {
        this.listeners.forEach((callback) => callback(null))
      }, duration)
    }

    return id
  }

  success(message, duration = 3000) {
    return this.notify(message, "success", duration)
  }

  error(message, duration = 4000) {
    return this.notify(message, "error", duration)
  }

  info(message, duration = 3000) {
    return this.notify(message, "info", duration)
  }

  warning(message, duration = 3000) {
    return this.notify(message, "warning", duration)
  }
}

export const toastManager = new ToastManager()
