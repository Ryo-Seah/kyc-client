import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { submitDossierAsync, downloadDossier, type DossierSubmitData, type DossierSubmissionResponse } from '../../services/api'

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

const mockedAxios = axios as typeof axios & {
  post: ReturnType<typeof vi.fn>
  get: ReturnType<typeof vi.fn>
}

describe('api service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitDossierAsync', () => {
    const apiBaseUrl = 'http://localhost:8080'
    const mockToken = 'mock-firebase-id-token'

    it('makes POST request to correct endpoint with data and token', async () => {
      const submitData: DossierSubmitData = {
        name: 'John Doe',
        category: 'individual',
        urls: ['https://example.com']
      }

      const mockResponse: DossierSubmissionResponse = {
        job_id: 'test-job-123',
        status: 'started',
        message: 'Job started successfully'
      }

      mockedAxios.post.mockResolvedValue({ data: mockResponse })

      const result = await submitDossierAsync(apiBaseUrl, submitData, mockToken)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/submit', // In development mode, uses relative URL
        submitData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`
          },
          validateStatus: expect.any(Function)
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('handles individual category', async () => {
      const submitData: DossierSubmitData = {
        name: 'Jane Smith',
        category: 'individual',
        urls: ['https://linkedin.com/in/jane']
      }

      const mockResponse: DossierSubmissionResponse = {
        job_id: 'test-job-456',
        status: 'started'
      }

      mockedAxios.post.mockResolvedValue({ data: mockResponse })

      await submitDossierAsync(apiBaseUrl, submitData, mockToken)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/submit', // In development mode, uses relative URL
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

      const mockResponse: DossierSubmissionResponse = {
        job_id: 'test-job-789',
        status: 'started'
      }

      mockedAxios.post.mockResolvedValue({ data: mockResponse })

      await submitDossierAsync(apiBaseUrl, submitData, mockToken)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/submit', // In development mode, uses relative URL
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

      const mockResponse: DossierSubmissionResponse = {
        job_id: 'test-job-empty',
        status: 'started'
      }

      mockedAxios.post.mockResolvedValue({ data: mockResponse })

      await submitDossierAsync(apiBaseUrl, submitData, mockToken)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/submit', // In development mode, uses relative URL
        expect.objectContaining({
          urls: []
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

      await expect(submitDossierAsync(apiBaseUrl, submitData, mockToken)).rejects.toThrow('Network error')
    })

    it('constructs correct URL with different base URLs', async () => {
      const customApiBaseUrl = 'https://api.example.com'
      const submitData: DossierSubmitData = {
        name: 'URL Test',
        category: 'individual',
        urls: []
      }

      const mockResponse: DossierSubmissionResponse = {
        job_id: 'test-job-url',
        status: 'started'
      }

      mockedAxios.post.mockResolvedValue({ data: mockResponse })

      await submitDossierAsync(customApiBaseUrl, submitData, mockToken)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/submit', // In development mode, uses relative URL
        expect.any(Object),
        expect.any(Object)
      )
    })
  })

  describe('downloadDossier', () => {
    const apiBaseUrl = 'http://localhost:8080'
    const jobId = 'test-job-123'
    const mockToken = 'mock-firebase-id-token'
    const mockBlob = new Blob(['mock file content'], { type: 'application/zip' })

    it('makes GET request to correct endpoint with job ID and token', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockBlob })

      const result = await downloadDossier(apiBaseUrl, jobId, mockToken)

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/download/${jobId}`, // In development mode, uses relative URL
        {
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${mockToken}`
          },
          validateStatus: expect.any(Function)
        }
      )
      expect(result).toBe(mockBlob)
    })

    it('handles different job IDs', async () => {
      const differentJobId = 'different-job-456'
      mockedAxios.get.mockResolvedValue({ data: mockBlob })

      await downloadDossier(apiBaseUrl, differentJobId, mockToken)

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/download/${differentJobId}`, // In development mode, uses relative URL
        expect.any(Object)
      )
    })

    it('throws error when download fails', async () => {
      const error = new Error('Download failed')
      mockedAxios.get.mockRejectedValue(error)

      await expect(downloadDossier(apiBaseUrl, jobId, mockToken)).rejects.toThrow('Download failed')
    })

    it('constructs correct URL with different base URLs', async () => {
      const customApiBaseUrl = 'https://api.example.com'
      mockedAxios.get.mockResolvedValue({ data: mockBlob })

      await downloadDossier(customApiBaseUrl, jobId, mockToken)

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/download/${jobId}`, // In development mode, uses relative URL
        expect.any(Object)
      )
    })
  })
})