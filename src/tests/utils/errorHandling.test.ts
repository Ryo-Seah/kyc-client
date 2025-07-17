import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleApiError } from '../../utils/errorHandling'

describe('errorHandling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear console mocks
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('handleApiError', () => {
    const apiBaseUrl = 'http://localhost:8080'

    it('handles timeout errors', async () => {
      const error = { code: 'ECONNABORTED' }
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe('Server timeout: Backend did not respond in time.')
      expect(console.error).toHaveBeenCalledWith('[ERROR] Request timed out.')
    })

    it('handles server response errors with status and statusText', async () => {
      const error = {
        response: {
          status: 404,
          statusText: 'Not Found'
        }
      }
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe('Server error 404: Not Found')
    })

    it('handles server response errors with custom error message', async () => {
      const error = {
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: { error: 'Invalid input provided' }
        }
      }
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe('Server error 400: Invalid input provided')
    })

    it('handles server response errors with Blob data fallback', async () => {
      // Test when Blob parsing fails, it falls back to statusText
      const realBlob = new Blob(['Invalid JSON'], { type: 'application/json' })
      
      const error = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: realBlob
        }
      }
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe('Server error 500: Internal Server Error')
    })

    it('handles server response errors with invalid JSON in Blob', async () => {
      // Create a real Blob with invalid JSON
      const realBlob = new Blob(['Invalid JSON'], { type: 'application/json' })
      
      const error = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: realBlob
        }
      }
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe('Server error 500: Internal Server Error')
    })

    it('handles no response errors', async () => {
      const error = {
        request: { some: 'request object' }
      }
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe(`No response from server. Check if backend is running on ${apiBaseUrl}.`)
      expect(console.error).toHaveBeenCalledWith('[ERROR] No response received from server.')
    })

    it('handles client setup errors', async () => {
      const error = {
        message: 'Network error'
      }
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe('Client error: Network error')
      expect(console.error).toHaveBeenCalledWith('[ERROR] Request setup failed:', 'Network error')
    })

    it('handles unknown errors without message', async () => {
      const error = {}
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe('Client error: Unknown error')
    })

    it('handles response with data containing error field', async () => {
      const error = {
        response: {
          status: 422,
          statusText: 'Unprocessable Entity',
          data: { error: 'Validation failed' }
        }
      }
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe('Server error 422: Validation failed')
    })

    it('handles response without data', async () => {
      const error = {
        response: {
          status: 503,
          statusText: 'Service Unavailable'
        }
      }
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe('Server error 503: Service Unavailable')
    })

    it('handles response with empty data object', async () => {
      const error = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: {}
        }
      }
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe('Server error 401: Unauthorized')
    })

    it('prioritizes error field over message field in response data', async () => {
      const error = {
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: { 
            error: 'Custom error',
            message: 'Custom message'
          }
        }
      }
      
      const result = await handleApiError(error, apiBaseUrl)
      
      expect(result).toBe('Server error 400: Custom error')
    })
  })
})
