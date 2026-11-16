import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { mockUsers } from '@/test/fixtures'
import { UserDataTable } from './UserDataTable'

// @base-ui/react/tooltip uses portals and floating positioning not available
// in jsdom — replace with lightweight stubs that keep the trigger accessible.
vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
  TooltipContent: () => null,
}))

function renderTable(overrides: Partial<React.ComponentProps<typeof UserDataTable>> = {}) {
  const props = {
    data: mockUsers,
    isLoading: false,
    error: null,
    onSelectUser: vi.fn(),
    onRetry: vi.fn(),
    ...overrides,
  }
  render(<UserDataTable {...props} />)
  return props
}

describe('UserDataTable', () => {
  it('renders all users in the table', () => {
    renderTable()

    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
  })

  it('filters rows by name when typing in the search input', async () => {
    const user = userEvent.setup()
    renderTable()

    await user.type(screen.getByRole('searchbox'), 'Leanne')

    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.queryByText('Ervin Howell')).not.toBeInTheDocument()
  })

  it('shows the loading skeleton while fetching', () => {
    renderTable({ data: [], isLoading: true })

    expect(screen.getByRole('status', { name: /cargando usuarios/i })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows an error alert with a retry button when fetch fails', () => {
    const onRetry = vi.fn()
    renderTable({ data: [], error: 'Error de red', onRetry })

    expect(screen.getByRole('alert')).toHaveTextContent('Error de red')
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument()
  })

  it('calls onSelectUser with the correct id when the action button is clicked', async () => {
    const user = userEvent.setup()
    const onSelectUser = vi.fn()
    renderTable({ onSelectUser })

    const buttons = screen.getAllByRole('button', { name: /gestionar publicaciones/i })
    await user.click(buttons[0])

    expect(onSelectUser).toHaveBeenCalledWith(1)
  })
})
