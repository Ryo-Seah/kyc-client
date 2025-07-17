import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CustomUrlsManager } from '../../components/CustomUrlsManager'

describe('CustomUrlsManager', () => {
  const defaultProps = {
    customUrls: [],
    onAdd: vi.fn(),
    onRemove: vi.fn(),
    onUpdate: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the title', () => {
    render(<CustomUrlsManager {...defaultProps} />)
    expect(screen.getByText('Custom URLs')).toBeInTheDocument()
  })

  it('shows add button', () => {
    render(<CustomUrlsManager {...defaultProps} />)
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
  })

  it('shows empty state message when no URLs', () => {
    render(<CustomUrlsManager {...defaultProps} />)
    expect(screen.getByText('Click the + button to add custom URLs for additional research')).toBeInTheDocument()
  })

  it('calls onAdd when add button is clicked', () => {
    const mockOnAdd = vi.fn()
    render(<CustomUrlsManager {...defaultProps} onAdd={mockOnAdd} />)
    
    const addButton = screen.getByRole('button', { name: '+' })
    fireEvent.click(addButton)
    
    expect(mockOnAdd).toHaveBeenCalledTimes(1)
  })

  it('renders URL input fields for existing URLs', () => {
    const urls = ['https://example.com', 'https://test.com']
    render(<CustomUrlsManager {...defaultProps} customUrls={urls} />)
    
    expect(screen.getByLabelText('Custom URL 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Custom URL 2')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://test.com')).toBeInTheDocument()
  })

  it('shows URL counter when URLs exist', () => {
    const urls = ['https://example.com', 'https://test.com']
    render(<CustomUrlsManager {...defaultProps} customUrls={urls} />)
    
    expect(screen.getByText('2/10 URLs added')).toBeInTheDocument()
  })

  it('shows remove buttons for each URL', () => {
    const urls = ['https://example.com', 'https://test.com']
    render(<CustomUrlsManager {...defaultProps} customUrls={urls} />)
    
    const removeButtons = screen.getAllByRole('button', { name: '×' })
    expect(removeButtons).toHaveLength(2)
  })

  it('calls onRemove with correct index when remove button is clicked', () => {
    const mockOnRemove = vi.fn()
    const urls = ['https://example.com', 'https://test.com']
    render(<CustomUrlsManager {...defaultProps} customUrls={urls} onRemove={mockOnRemove} />)
    
    const removeButtons = screen.getAllByRole('button', { name: '×' })
    fireEvent.click(removeButtons[1])
    
    expect(mockOnRemove).toHaveBeenCalledWith(1)
  })

  it('calls onUpdate when URL input changes', () => {
    const mockOnUpdate = vi.fn()
    const urls = ['https://example.com']
    render(<CustomUrlsManager {...defaultProps} customUrls={urls} onUpdate={mockOnUpdate} />)
    
    const input = screen.getByLabelText('Custom URL 1')
    fireEvent.change(input, { target: { value: 'https://newurl.com' } })
    
    expect(mockOnUpdate).toHaveBeenCalledWith(0, 'https://newurl.com')
  })

  it('disables add button when max URLs reached', () => {
    const urls = new Array(10).fill('').map((_, i) => `https://url${i}.com`)
    render(<CustomUrlsManager {...defaultProps} customUrls={urls} />)
    
    const addButton = screen.getByRole('button', { name: '+' })
    expect(addButton).toBeDisabled()
  })

  it('disables add button when disabled prop is true', () => {
    render(<CustomUrlsManager {...defaultProps} disabled={true} />)
    
    const addButton = screen.getByRole('button', { name: '+' })
    expect(addButton).toBeDisabled()
  })

  it('disables all inputs and buttons when disabled', () => {
    const urls = ['https://example.com']
    render(<CustomUrlsManager {...defaultProps} customUrls={urls} disabled={true} />)
    
    const input = screen.getByLabelText('Custom URL 1')
    const addButton = screen.getByRole('button', { name: '+' })
    const removeButton = screen.getByRole('button', { name: '×' })
    
    expect(input).toBeDisabled()
    expect(addButton).toBeDisabled()
    expect(removeButton).toBeDisabled()
  })

  it('uses custom maxUrls when provided', () => {
    const urls = ['https://example.com']
    render(<CustomUrlsManager {...defaultProps} customUrls={urls} maxUrls={5} />)
    
    expect(screen.getByText('1/5 URLs added')).toBeInTheDocument()
  })

  it('respects custom maxUrls for add button disabling', () => {
    const urls = ['https://url1.com', 'https://url2.com']
    render(<CustomUrlsManager {...defaultProps} customUrls={urls} maxUrls={2} />)
    
    const addButton = screen.getByRole('button', { name: '+' })
    expect(addButton).toBeDisabled()
  })
})
