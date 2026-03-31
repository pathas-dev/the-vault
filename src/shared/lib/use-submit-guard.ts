import { useState, useCallback } from 'react'

export function useSubmitGuard() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const guard = useCallback(async (fn: () => void | Promise<void>) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await fn()
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting])

  return { isSubmitting, guard }
}
