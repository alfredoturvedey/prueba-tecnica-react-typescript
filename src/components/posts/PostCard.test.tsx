import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PostCard } from './PostCard'

describe('PostCard', () => {
  it('renders the post title and body', () => {
    render(<PostCard post={{ id: 1, userId: 1, title: 'Mi título', body: 'Mi contenido' }} />)

    expect(screen.getByText('Mi título')).toBeInTheDocument()
    expect(screen.getByText('Mi contenido')).toBeInTheDocument()
  })

  it('does not show the "Nuevo" badge for API posts (id ≤ 100 000)', () => {
    render(<PostCard post={{ id: 100, userId: 1, title: 'Post API', body: 'Cuerpo' }} />)

    expect(screen.queryByText('Nuevo')).not.toBeInTheDocument()
  })

  it('shows the "Nuevo" badge for optimistic posts (id > 100 000)', () => {
    render(<PostCard post={{ id: Date.now(), userId: 1, title: 'Post local', body: 'Cuerpo' }} />)

    expect(screen.getByText('Nuevo')).toBeInTheDocument()
  })
})
