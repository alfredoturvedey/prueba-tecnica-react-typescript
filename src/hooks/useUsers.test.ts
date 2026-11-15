import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/services/api'
import { mockUsers } from '@/test/fixtures'
import { useUsers } from './useUsers'

vi.mock('@/services/api')

describe('useUsers', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('starts in loading state before the fetch resolves', () => {
    vi.mocked(api.users.getAll).mockResolvedValue(mockUsers)

    const { result } = renderHook(() => useUsers())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.users).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('returns users and clears loading on successful fetch', async () => {
    vi.mocked(api.users.getAll).mockResolvedValue(mockUsers)

    const { result } = renderHook(() => useUsers())

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.users).toEqual(mockUsers)
    expect(result.current.error).toBeNull()
  })

  it('returns the error message and empty users when the fetch fails', async () => {
    vi.mocked(api.users.getAll).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useUsers())

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBe('Network error')
    expect(result.current.users).toEqual([])
  })

  it('re-fetches and recovers when retry() is called after an error', async () => {
    vi.mocked(api.users.getAll)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockUsers)

    const { result } = renderHook(() => useUsers())
    await waitFor(() => expect(result.current.error).toBe('Network error'))

    act(() => { result.current.retry() })

    await waitFor(() => expect(result.current.users).toEqual(mockUsers))
    expect(result.current.error).toBeNull()
  })
})
