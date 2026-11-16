import type { Post, User } from '@/types/api'

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'https://jsonplaceholder.typicode.com'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options)
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

export const api = {
  users: {
    getAll: () => request<User[]>('/users'),
  },
  posts: {
    getByUser: (userId: number) => request<Post[]>(`/posts?userId=${userId}`),
    create: (data: Omit<Post, 'id'>) =>
      request<Post>('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  },
}
