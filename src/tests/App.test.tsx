import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'


// Mock the API service
vi.mock('../services/api', () => ({
  submitDossierRequest: vi.fn()
}))

// Get the mocked function
import { submitDossierRequest } from '../services/api'
const mockedSubmitDossierRequest = vi.mocked(submitDossierRequest)

// Mock file download utilities
vi.mock('../utils/fileUtils', () => ({
  downloadFile: vi.fn(),
  createFilename: vi.fn((name: string, category: string) => `${name}_${category}_dossier.docx`)
}))

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all main components', () => {
    render(<App />)
    
    expect(screen.getByText('KYC Dossier Generator')).toBeInTheDocument()
    expect(screen.getByLabelText('Enter Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByText('Custom URLs')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate & download dossier/i })).toBeInTheDocument()
  })

  it('submit button is disabled when name is empty', () => {
    render(<App />)
    
    const submitButton = screen.getByRole('button', { name: /generate & download dossier/i })
    expect(submitButton).toBeDisabled()
  })

  it('submit button is enabled when name is provided', () => {
    render(<App />)
    
    const nameInput = screen.getByLabelText('Enter Name')
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    const submitButton = screen.getByRole('button', { name: /generate & download dossier/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('can add and remove custom URLs', () => {
    render(<App />)
    
    // Add a URL
    const addButton = screen.getByRole('button', { name: '+' })
    fireEvent.click(addButton)
    
    expect(screen.getByLabelText('Custom URL 1')).toBeInTheDocument()
    
    // Remove the URL
    const removeButton = screen.getByRole('button', { name: '×' })
    fireEvent.click(removeButton)
    
    expect(screen.queryByLabelText('Custom URL 1')).not.toBeInTheDocument()
  })

  it('submits form with correct data', async () => {
    const mockBlob = new Blob(['mock content'])
    mockedSubmitDossierRequest.mockResolvedValue(mockBlob)
    
    render(<App />)
    
    // Fill in form
    const nameInput = screen.getByLabelText('Enter Name')
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    // Change category
    const categorySelect = screen.getByLabelText('Category')
    fireEvent.mouseDown(categorySelect)
    fireEvent.click(screen.getByText('Organisation'))
    
    // Add custom URL
    const addButton = screen.getByRole('button', { name: '+' })
    fireEvent.click(addButton)
    const urlInput = screen.getByLabelText('Custom URL 1')
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } })
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /generate & download dossier/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockedSubmitDossierRequest).toHaveBeenCalledWith(
        expect.any(String),
        {
          name: 'John Doe',
          category: 'organisation',
          urls: ['https://example.com']
        }
      )
    })
  })

  it('shows loading state during submission', async () => {
    // Mock a delay in the API call
    mockedSubmitDossierRequest.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(new Blob()), 100))
    )
    
    render(<App />)
    
    // Fill in name
    const nameInput = screen.getByLabelText('Enter Name')
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /generate & download dossier/i })
    fireEvent.click(submitButton)
    
    // Check loading state
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.queryByText(/generate & download dossier/i)).not.toBeInTheDocument()
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })

  it('displays success message after successful submission', async () => {
    const mockBlob = new Blob(['mock content'])
    mockedSubmitDossierRequest.mockResolvedValue(mockBlob)
    
    render(<App />)
    
    // Fill in form and submit
    const nameInput = screen.getByLabelText('Enter Name')
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } })
    
    const submitButton = screen.getByRole('button', { name: /generate & download dossier/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/dossier for jane smith \(individual\) downloaded successfully!/i)).toBeInTheDocument()
    })
  })

  it('displays error message when submission fails', async () => {
    mockedSubmitDossierRequest.mockRejectedValue(new Error('Network error'))
    
    render(<App />)
    
    // Fill in form and submit
    const nameInput = screen.getByLabelText('Enter Name')
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    
    const submitButton = screen.getByRole('button', { name: /generate & download dossier/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/client error: network error/i)).toBeInTheDocument()
    })
  })

  it('filters out empty URLs before submission', async () => {
    const mockBlob = new Blob(['mock content'])
    mockedSubmitDossierRequest.mockResolvedValue(mockBlob)
    
    render(<App />)
    
    // Fill in name
    const nameInput = screen.getByLabelText('Enter Name')
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    
    // Add multiple URLs, some empty
    const addButton = screen.getByRole('button', { name: '+' })
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    
    // Fill only some URLs
    const urlInput1 = screen.getByLabelText('Custom URL 1')
    fireEvent.change(urlInput1, { target: { value: 'https://example.com' } })
    
    const urlInput2 = screen.getByLabelText('Custom URL 2')
    fireEvent.change(urlInput2, { target: { value: '' } }) // Empty
    
    const urlInput3 = screen.getByLabelText('Custom URL 3')
    fireEvent.change(urlInput3, { target: { value: 'https://test.com' } })
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /generate & download dossier/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockedSubmitDossierRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          urls: ['https://example.com', 'https://test.com'] // Only non-empty URLs
        })
      )
    })
  })

  it('disables all inputs during loading', async () => {
    mockedSubmitDossierRequest.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(new Blob()), 100))
    )
    
    render(<App />)
    
    // Fill in name
    const nameInput = screen.getByLabelText('Enter Name')
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    
    // Add a URL
    const addButton = screen.getByRole('button', { name: '+' })
    fireEvent.click(addButton)
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /generate & download dossier/i })
    fireEvent.click(submitButton)
    
    // Check that inputs are disabled
    expect(nameInput).toBeDisabled()
    expect(screen.getByLabelText('Category')).toHaveAttribute('aria-disabled', 'true'); // Check aria-disabled
    expect(addButton).toBeDisabled()
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })
})
