import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CreatePostForm } from './CreatePostForm'

describe('CreatePostForm', () => {
  it('shows required validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    render(<CreatePostForm onSubmit={vi.fn()} isSubmitting={false} submitError={null} />)

    await user.click(screen.getByRole('button', { name: /publicar/i }))

    expect(await screen.findByText('El título es obligatorio')).toBeInTheDocument()
    expect(await screen.findByText('El contenido es obligatorio')).toBeInTheDocument()
  })

  it('does not call onSubmit when the form is invalid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CreatePostForm onSubmit={onSubmit} isSubmitting={false} submitError={null} />)

    await user.click(screen.getByRole('button', { name: /publicar/i }))

    await screen.findByText('El título es obligatorio')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with the correct values when the form is valid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(true)
    render(<CreatePostForm onSubmit={onSubmit} isSubmitting={false} submitError={null} />)

    await user.type(screen.getByPlaceholderText(/escribe el título/i), 'Mi título de prueba')
    await user.type(screen.getByPlaceholderText(/escribe el contenido/i), 'Contenido válido del post de prueba')
    await user.click(screen.getByRole('button', { name: /publicar/i }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Mi título de prueba',
        body: 'Contenido válido del post de prueba',
      }),
    )
  })

  it('resets the fields to empty after a successful submission', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(true)
    render(<CreatePostForm onSubmit={onSubmit} isSubmitting={false} submitError={null} />)

    const titleInput = screen.getByPlaceholderText(/escribe el título/i)
    const bodyInput = screen.getByPlaceholderText(/escribe el contenido/i)

    await user.type(titleInput, 'Título que se borrará')
    await user.type(bodyInput, 'Contenido que se borrará después de enviar')
    await user.click(screen.getByRole('button', { name: /publicar/i }))

    await waitFor(() => {
      expect(titleInput).toHaveValue('')
      expect(bodyInput).toHaveValue('')
    })
  })

  it('displays the submit error when the prop is set', () => {
    render(
      <CreatePostForm
        onSubmit={vi.fn()}
        isSubmitting={false}
        submitError="Error al crear la publicación"
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Error al crear la publicación')
  })
})
