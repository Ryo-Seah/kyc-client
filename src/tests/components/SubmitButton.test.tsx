import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SubmitButton } from '../../components/SubmitButton'

describe('SubmitButton', () => {
  it('renders with correct text when not loading', () => {
    const mockOnClick = vi.fn()
    render(<SubmitButton loading={false} disabled={false} onClick={mockOnClick} />)
    
    expect(screen.getByText('Generate & Download Dossier')).toBeInTheDocument()
  })

  it('shows loading spinner when loading', () => {
    const mockOnClick = vi.fn()
    render(<SubmitButton loading={true} disabled={false} onClick={mockOnClick} />)
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.queryByText('Generate & Download Dossier')).not.toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn()
    render(<SubmitButton loading={false} disabled={false} onClick={mockOnClick} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    const mockOnClick = vi.fn()
    render(<SubmitButton loading={false} disabled={true} onClick={mockOnClick} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('does not call onClick when disabled', () => {
    const mockOnClick = vi.fn()
    render(<SubmitButton loading={false} disabled={true} onClick={mockOnClick} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('has correct styling classes', () => {
    const mockOnClick = vi.fn()
    render(<SubmitButton loading={false} disabled={false} onClick={mockOnClick} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('MuiButton-contained')
    expect(button).toHaveClass('MuiButton-containedPrimary')
    expect(button).toHaveClass('MuiButton-fullWidth')
  })

  it('maintains disabled state when loading', () => {
    const mockOnClick = vi.fn()
    render(<SubmitButton loading={true} disabled={true} onClick={mockOnClick} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('shows loading spinner with correct size', () => {
    const mockOnClick = vi.fn()
    render(<SubmitButton loading={true} disabled={false} onClick={mockOnClick} />)
    
    const spinner = screen.getByRole('progressbar')
    expect(spinner).toHaveAttribute('style', expect.stringContaining('width: 24px'))
  })
})
