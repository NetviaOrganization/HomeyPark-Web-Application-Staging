import { DependencyList, useEffect, useRef, useState } from 'react'

export function usePromise<T, E extends Error>(
  promiseFactory: () => Promise<T> | null,
  deps: DependencyList = []
) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  const active = useRef(true)
  const currentPromise = useRef<Promise<T> | null>(null)

  useEffect(() => {
    const promise = promiseFactory()
    if (!promise) return

    active.current = true
    setLoading(true)
    setData(null)
    setError(null)

    currentPromise.current = promise

    promise
      .then((res) => {
        if (active.current && currentPromise.current === promise) {
          setData(res)
        }
      })
      .catch((err) => {
        if (active.current && currentPromise.current === promise) {
          setError(err)
        }
      })
      .finally(() => {
        if (active.current && currentPromise.current === promise) {
          setLoading(false)
        }
      })

    return () => {
      active.current = false
    }
  }, deps)

  return { data, loading, error }
}
