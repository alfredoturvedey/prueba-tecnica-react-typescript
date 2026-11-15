import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import type { User } from '@/types/api'

type UsersState = {
  users: User[]
  isLoading: boolean
  error: string | null
}

export function useUsers() {
  const [state, setState] = useState<UsersState>({
    users: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    setState({ users: [], isLoading: true, error: null })

    api.users
      .getAll()
      .then((users) => {
        if (!cancelled) setState({ users, isLoading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Error desconocido'
          setState({ users: [], isLoading: false, error: message })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
