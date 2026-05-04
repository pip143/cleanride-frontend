

/**
 * LoadingSpinner component
 * Displays a loading spinner for async operations
 */
export function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  )
}

/**
 * ErrorDisplay component
 * Displays error messages
 */
export function ErrorDisplay({ error, onDismiss }) {
  if (!error) return null

  return (
    <div className="error-display">
      <div className="error-content">
        <p className="error-message">{error}</p>
        {onDismiss && (
          <button className="error-dismiss" onClick={onDismiss}>
            Dismiss
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * EmptyState component
 * Displays when there's no data
 */
export function EmptyState({ title, message, action, actionLabel }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📭</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <button onClick={action}>{actionLabel || "Take Action"}</button>}
    </div>
  )
}
