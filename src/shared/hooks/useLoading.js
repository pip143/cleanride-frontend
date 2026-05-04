import { useState, useCallback } from "react"

/**
 * Hook to manage loading state
 * Returns: { isLoading, startLoading, stopLoading, withLoading }
 */
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)

  const startLoading = useCallback(() => setIsLoading(true), [])
  const stopLoading = useCallback(() => setIsLoading(false), [])

  /**
   * Wraps an async function to automatically manage loading state
   */
  const withLoading = useCallback(async (asyncFn) => {
    startLoading()
    try {
      return await asyncFn()
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  return { isLoading, startLoading, stopLoading, withLoading }
}
