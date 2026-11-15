import { useCallback, useEffect, useState } from 'react'
import { api } from '@/services/api'
import type { Post } from '@/types/api'

type PostsState = {
  posts: Post[]
  isLoading: boolean
  error: string | null
}

type CreatePostData = Pick<Post, 'title' | 'body'>

export function usePosts(userId: number) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<PostsState>({
    posts: [],
    isLoading: true,
    error: null,
  })
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const retry = useCallback(() => setAttempt((a) => a + 1), [])

  useEffect(() => {
    let cancelled = false

    setState({ posts: [], isLoading: true, error: null })

    api.posts
      .getByUser(userId)
      .then((posts) => {
        if (!cancelled) setState({ posts, isLoading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Error desconocido'
          setState({ posts: [], isLoading: false, error: message })
        }
      })

    return () => {
      cancelled = true
    }
  }, [userId, attempt])

  async function createPost(data: CreatePostData): Promise<boolean> {
    setIsCreating(true)
    setCreateError(null)
    try {
      await api.posts.create({ ...data, userId })
      // JSONPlaceholder always returns id 101 — use Date.now() to avoid key conflicts
      const optimisticPost: Post = { id: Date.now(), userId, ...data }
      setState((prev) => ({ ...prev, posts: [optimisticPost, ...prev.posts] }))
      return true
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al crear la publicación'
      setCreateError(message)
      return false
    } finally {
      setIsCreating(false)
    }
  }

  return { ...state, isCreating, createError, createPost, retry }
}
