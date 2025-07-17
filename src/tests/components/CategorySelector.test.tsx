import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CategorySelector } from '../../components/CategorySelector'

describe('CategorySelector', () => {
  it('renders with correct label', () => {
    const mockOnChange = vi.fn()
    render(<CategorySelector value="individual" onChange={mockOnChange} />)
    
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
  })

  it('displays the selected value', () => {
    const mockOnChange = vi.fn()
    render(<CategorySelector value="individual" onChange={mockOnChange} />)
    
    expect(screen.getByDisplayValue('individual')).toBeInTheDocument()
  })

  it('displays organisation when selected', () => {
    const mockOnChange = vi.fn()
    render(<CategorySelector value="organisation" onChange={mockOnChange} />)
    
    expect(screen.getByDisplayValue('organisation')).toBeInTheDocument()
  })

  it('shows both options when opened', async () => {
    const mockOnChange = vi.fn()
    render(<CategorySelector value="individual" onChange={mockOnChange} />)
    
    const select = screen.getByLabelText('Category')
    fireEvent.mouseDown(select)
    
    expect(screen.getAllByText('Individual')).toHaveLength(2) // One in select, one in menu
    expect(screen.getByText('Organisation')).toBeInTheDocument()
  })

  it('calls onChange when selection changes', () => {
    const mockOnChange = vi.fn()
    render(<CategorySelector value="individual" onChange={mockOnChange} />)
    
    const select = screen.getByLabelText('Category')
    fireEvent.mouseDown(select)
    
    const organisationOption = screen.getByText('Organisation')
    fireEvent.click(organisationOption)
    
    expect(mockOnChange).toHaveBeenCalledWith('organisation')
  })

  it('is disabled when disabled prop is true', () => {
    const mockOnChange = vi.fn()
    render(<CategorySelector value="individual" onChange={mockOnChange} disabled={true} />)
    
    const select = screen.getByLabelText('Category')
    expect(select).toHaveAttribute('aria-disabled', 'true')
  })

  it('is enabled by default', () => {
    const mockOnChange = vi.fn()
    render(<CategorySelector value="individual" onChange={mockOnChange} />)
    
    const formControl = screen.getByLabelText('Category').closest('.MuiFormControl-root')
    expect(formControl).not.toHaveClass('Mui-disabled')
  })

  it('has full width styling', () => {
    const mockOnChange = vi.fn()
    render(<CategorySelector value="individual" onChange={mockOnChange} />)
    
    const formControl = screen.getByLabelText('Category').closest('.MuiFormControl-root')
    expect(formControl).toHaveClass('MuiFormControl-fullWidth')
  })
})
