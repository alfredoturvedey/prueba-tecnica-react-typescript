import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/services/api'
import { mockPosts } from '@/test/fixtures'
import { usePosts } from './usePosts'

vi.mock('@/services/api')

const USER_ID = 1

describe('usePosts', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('fetches and returns posts for the given user', async () => {
    vi.mocked(api.posts.getByUser).mockResolvedValue(mockPosts)

    const { result } = renderHook(() => usePosts(USER_ID))

    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.posts).toEqual(mockPosts)
    expect(result.current.error).toBeNull()
  })

  it('createPost prepends the optimistic post to the start of the list', async () => {
    vi.mocked(api.posts.getByUser).mockResolvedValue(mockPosts)
    vi.mocked(api.posts.create).mockResolvedValue({
      id: 101,
      userId: USER_ID,
      title: 'Nuevo post',
      body: 'Contenido del nuevo post',
    })

    const { result } = renderHook(() => usePosts(USER_ID))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.createPost({ title: 'Nuevo post', body: 'Contenido del nuevo post' })
    })

    expect(result.current.posts[0]).toMatchObject({
      title: 'Nuevo post',
      body: 'Contenido del nuevo post',
      userId: USER_ID,
    })
    expect(result.current.posts).toHaveLength(mockPosts.length + 1)
  })

  it('createPost returns false and sets createError without mutating the list when the API fails', async () => {
    vi.mocked(api.posts.getByUser).mockResolvedValue(mockPosts)
    vi.mocked(api.posts.create).mockRejectedValue(new Error('Error de red'))

    const { result } = renderHook(() => usePosts(USER_ID))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    let ok: boolean | undefined
    await act(async () => {
      ok = await result.current.createPost({ title: 'T', body: 'B' })
    })

    expect(ok).toBe(false)
    expect(result.current.createError).toBe('Error de red')
    expect(result.current.posts).toHaveLength(mockPosts.length)
  })

  it('isCreating is false before and after a completed submission', async () => {
    vi.mocked(api.posts.getByUser).mockResolvedValue([])
    vi.mocked(api.posts.create).mockResolvedValue({
      id: 101,
      userId: USER_ID,
      title: 'T',
      body: 'B',
    })

    const { result } = renderHook(() => usePosts(USER_ID))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isCreating).toBe(false)

    await act(async () => {
      await result.current.createPost({ title: 'T', body: 'B' })
    })

    expect(result.current.isCreating).toBe(false)
  })

  it('re-fetches and recovers when retry() is called after an error', async () => {
    vi.mocked(api.posts.getByUser)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockPosts)

    const { result } = renderHook(() => usePosts(USER_ID))
    await waitFor(() => expect(result.current.error).toBe('Network error'))

    act(() => {
      result.current.retry()
    })

    await waitFor(() => expect(result.current.posts).toEqual(mockPosts))
    expect(result.current.error).toBeNull()
  })
})
