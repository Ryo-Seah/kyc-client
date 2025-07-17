import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NameInput } from '../../components/NameInput'

describe('NameInput', () => {
  it('renders with correct label', () => {
    const mockOnChange = vi.fn()
    render(<NameInput value="" onChange={mockOnChange} />)
    
    expect(screen.getByLabelText('Enter Name')).toBeInTheDocument()
  })

  it('displays the provided value', () => {
    const mockOnChange = vi.fn()
    const testValue = 'John Doe'
    render(<NameInput value={testValue} onChange={mockOnChange} />)
    
    const input = screen.getByDisplayValue(testValue)
    expect(input).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const mockOnChange = vi.fn()
    render(<NameInput value="" onChange={mockOnChange} />)
    
    const input = screen.getByLabelText('Enter Name')
    fireEvent.change(input, { target: { value: 'Jane Smith' } })
    
    expect(mockOnChange).toHaveBeenCalledWith('Jane Smith')
  })

  it('is disabled when disabled prop is true', () => {
    const mockOnChange = vi.fn()
    render(<NameInput value="" onChange={mockOnChange} disabled={true} />)
    
    const input = screen.getByLabelText('Enter Name')
    expect(input).toBeDisabled()
  })

  it('is enabled by default', () => {
    const mockOnChange = vi.fn()
    render(<NameInput value="" onChange={mockOnChange} />)
    
    const input = screen.getByLabelText('Enter Name')
    expect(input).not.toBeDisabled()
  })

  it('has full width styling', () => {
    const mockOnChange = vi.fn()
    render(<NameInput value="" onChange={mockOnChange} />)
    
    const textField = screen.getByLabelText('Enter Name').closest('.MuiFormControl-root')
    expect(textField).toHaveClass('MuiFormControl-fullWidth')
  })
})
