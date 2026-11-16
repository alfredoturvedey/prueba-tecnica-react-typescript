import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { mockPosts } from '@/test/fixtures'
import { PostList } from './PostList'

describe('PostList', () => {
  it('shows loading skeletons while fetching', () => {
    render(<PostList posts={[]} isLoading={true} error={null} onRetry={vi.fn()} />)

    expect(screen.getByRole('status', { name: /cargando publicaciones/i })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows an error alert with the message when fetch fails', () => {
    render(<PostList posts={[]} isLoading={false} error="Error de red" onRetry={vi.fn()} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Error de red')
  })

  it('calls onRetry when the retry button is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<PostList posts={[]} isLoading={false} error="Error" onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: /reintentar/i }))

    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('shows empty state when there are no posts', () => {
    render(<PostList posts={[]} isLoading={false} error={null} onRetry={vi.fn()} />)

    expect(screen.getByText(/no tiene publicaciones/i)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders a card for each post', () => {
    render(<PostList posts={mockPosts} isLoading={false} error={null} onRetry={vi.fn()} />)

    expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument()
    expect(screen.getByText(mockPosts[1].title)).toBeInTheDocument()
  })
})
