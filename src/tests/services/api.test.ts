import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { submitDossierRequest, type DossierSubmitData } from '../../services/api'

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}))

const mockedAxios = axios as typeof axios & {
  post: ReturnType<typeof vi.fn>
}

describe('api service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitDossierRequest', () => {
    const apiBaseUrl = 'http://localhost:8080'
    const mockBlob = new Blob(['mock file content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

    it('makes POST request to correct endpoint with data', async () => {
      const submitData: DossierSubmitData = {
        name: 'John Doe',
        category: 'individual',
        urls: ['https://example.com']
      }

      mockedAxios.post.mockResolvedValue({ data: mockBlob })

      await submitDossierRequest(apiBaseUrl, submitData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${apiBaseUrl}/submit`,
        submitData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    })

    it('returns blob data from response', async () => {
      const submitData: DossierSubmitData = {
        name: 'Acme Corp',
        category: 'organisation',
        urls: []
      }

      mockedAxios.post.mockResolvedValue({ data: mockBlob })

      const result = await submitDossierRequest(apiBaseUrl, submitData)

      expect(result).toBe(mockBlob)
    })

    it('handles individual category', async () => {
      const submitData: DossierSubmitData = {
        name: 'Jane Smith',
        category: 'individual',
        urls: ['https://linkedin.com/in/jane']
      }

      mockedAxios.post.mockResolvedValue({ data: mockBlob })

      await submitDossierRequest(apiBaseUrl, submitData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          category: 'individual'
        }),
        expect.any(Object)
      )
    })

    it('handles organisation category', async () => {
      const submitData: DossierSubmitData = {
        name: 'Tech Company Inc',
        category: 'organisation',
        urls: ['https://company.com', 'https://about.company.com']
      }

      mockedAxios.post.mockResolvedValue({ data: mockBlob })

      await submitDossierRequest(apiBaseUrl, submitData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          category: 'organisation'
        }),
        expect.any(Object)
      )
    })

    it('handles empty URLs array', async () => {
      const submitData: DossierSubmitData = {
        name: 'Test User',
        category: 'individual',
        urls: []
      }

      mockedAxios.post.mockResolvedValue({ data: mockBlob })

      await submitDossierRequest(apiBaseUrl, submitData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          urls: []
        }),
        expect.any(Object)
      )
    })

    it('handles multiple URLs', async () => {
      const urls = [
        'https://example.com',
        'https://test.com',
        'https://company.org'
      ]
      const submitData: DossierSubmitData = {
        name: 'Multi URL Test',
        category: 'individual',
        urls
      }

      mockedAxios.post.mockResolvedValue({ data: mockBlob })

      await submitDossierRequest(apiBaseUrl, submitData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          urls
        }),
        expect.any(Object)
      )
    })

    it('throws error when axios request fails', async () => {
      const submitData: DossierSubmitData = {
        name: 'Test',
        category: 'individual',
        urls: []
      }
      const error = new Error('Network error')

      mockedAxios.post.mockRejectedValue(error)

      await expect(submitDossierRequest(apiBaseUrl, submitData)).rejects.toThrow('Network error')
    })

    it('uses correct request configuration', async () => {
      const submitData: DossierSubmitData = {
        name: 'Config Test',
        category: 'individual',
        urls: []
      }

      mockedAxios.post.mockResolvedValue({ data: mockBlob })

      await submitDossierRequest(apiBaseUrl, submitData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    })

    it('constructs correct URL with different base URLs', async () => {
      const customApiBaseUrl = 'https://api.example.com'
      const submitData: DossierSubmitData = {
        name: 'URL Test',
        category: 'individual',
        urls: []
      }

      mockedAxios.post.mockResolvedValue({ data: mockBlob })

      await submitDossierRequest(customApiBaseUrl, submitData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${customApiBaseUrl}/submit`,
        expect.any(Object),
        expect.any(Object)
      )
    })
  })
})
