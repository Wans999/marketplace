import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/api'

// GET `path` whenever it changes. Returns { data, error, loading, retry }.
export function useApi(path) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })
  const key = `${path}#${attempt}`

  useEffect(() => {
    const controller = new AbortController()
    apiGet(path, { signal: controller.signal })
      .then((data) => setResult({ key, data, error: null }))
      .catch((error) => {
        // An aborted request belongs to a path the user already left; its result is irrelevant.
        if (error.name !== 'AbortError') setResult({ key, data: null, error })
      })
    return () => controller.abort()
  }, [path, key])

  // Loading until the stored result belongs to the current path and attempt.
  const loading = result.key !== key
  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
    retry: () => setAttempt((n) => n + 1),
  }
}
