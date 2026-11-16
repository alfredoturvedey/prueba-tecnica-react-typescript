import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { api } from '@/services/api'
import { useAppStore } from '@/store/useAppStore'
import { mockPosts, mockUsers } from '@/test/fixtures'

vi.mock('@/services/api')

// Same tooltip stub as UserDataTable.test.tsx — portals/floating not available in jsdom
vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
  TooltipContent: () => null,
}))

describe('App — integration', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useAppStore.setState({ selectedUserId: null })
  })

  it('renders the user list on initial load', async () => {
    vi.mocked(api.users.getAll).mockResolvedValue(mockUsers)

    render(<App />)

    await waitFor(() => expect(screen.getByText('Leanne Graham')).toBeInTheDocument())
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
  })

  it('navigates to the posts view when the action button is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(api.users.getAll).mockResolvedValue(mockUsers)
    vi.mocked(api.posts.getByUser).mockResolvedValue(mockPosts)

    render(<App />)
    await waitFor(() => screen.getAllByRole('button', { name: /gestionar publicaciones/i }))

    await user.click(screen.getAllByRole('button', { name: /gestionar publicaciones/i })[0])

    await waitFor(() =>
      expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument(),
    )
    expect(screen.getByText(mockPosts[1].title)).toBeInTheDocument()
  })

  it('shows the new post in the list immediately after creation', async () => {
    const user = userEvent.setup()
    vi.mocked(api.users.getAll).mockResolvedValue(mockUsers)
    vi.mocked(api.posts.getByUser).mockResolvedValue([])
    vi.mocked(api.posts.create).mockResolvedValue({
      id: 101,
      userId: 1,
      title: 'Post de integración',
      body: 'Contenido de integración',
    })

    render(<App />)
    await waitFor(() => screen.getAllByRole('button', { name: /gestionar publicaciones/i }))

    await user.click(screen.getAllByRole('button', { name: /gestionar publicaciones/i })[0])
    await waitFor(() => screen.getByPlaceholderText(/escribe el título/i))

    await user.type(screen.getByPlaceholderText(/escribe el título/i), 'Post de integración')
    await user.type(
      screen.getByPlaceholderText(/escribe el contenido/i),
      'Contenido de integración',
    )
    await user.click(screen.getByRole('button', { name: /publicar/i }))

    await waitFor(() =>
      expect(screen.getByText('Post de integración')).toBeInTheDocument(),
    )
    expect(screen.getByText('Nuevo')).toBeInTheDocument()
  })
})
