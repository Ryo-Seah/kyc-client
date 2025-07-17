import { describe, it, expect, vi, beforeEach } from 'vitest'
import { downloadFile, createFilename } from '../../utils/fileUtils'

describe('fileUtils', () => {
  describe('downloadFile', () => {
    let mockCreateElement: ReturnType<typeof vi.fn>
    let mockAppendChild: ReturnType<typeof vi.fn>
    let mockRemoveChild: ReturnType<typeof vi.fn>
    let mockClick: ReturnType<typeof vi.fn>
    let mockCreateObjectURL: ReturnType<typeof vi.fn>
    let mockRevokeObjectURL: ReturnType<typeof vi.fn>

    beforeEach(() => {
      mockCreateElement = vi.fn()
      mockAppendChild = vi.fn()
      mockRemoveChild = vi.fn()
      mockClick = vi.fn()
      mockCreateObjectURL = vi.fn()
      mockRevokeObjectURL = vi.fn()
      
      // Mock link element
      const mockLink = {
        href: '',
        download: '',
        click: mockClick
      }
      mockCreateElement.mockReturnValue(mockLink)
      mockCreateObjectURL.mockReturnValue('mock-blob-url')
      
      // Setup spies
      vi.spyOn(document, 'createElement').mockImplementation(mockCreateElement)
      vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild)
      vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild)
      vi.spyOn(window.URL, 'createObjectURL').mockImplementation(mockCreateObjectURL)
      vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(mockRevokeObjectURL)
    })

    it('creates blob URL and triggers download', () => {
      const mockBlob = new Blob(['test content'], { type: 'application/pdf' })
      const filename = 'test-file.pdf'

      downloadFile(mockBlob, filename)

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(mockCreateElement).toHaveBeenCalledWith('a')
    })

    it('sets correct href and download attributes', () => {
      const mockBlob = new Blob(['test content'])
      const filename = 'test-file.pdf'
      const mockLink = { href: '', download: '', click: mockClick }
      mockCreateElement.mockReturnValue(mockLink)

      downloadFile(mockBlob, filename)

      expect(mockLink.href).toBe('mock-blob-url')
      expect(mockLink.download).toBe(filename)
    })

    it('appends link to body, clicks it, and removes it', () => {
      const mockBlob = new Blob(['test content'])
      const filename = 'test-file.pdf'
      const mockLink = { href: '', download: '', click: mockClick }
      mockCreateElement.mockReturnValue(mockLink)

      downloadFile(mockBlob, filename)

      expect(mockAppendChild).toHaveBeenCalledWith(mockLink)
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink)
    })

    it('revokes object URL after download', () => {
      const mockBlob = new Blob(['test content'])
      const filename = 'test-file.pdf'

      downloadFile(mockBlob, filename)

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-blob-url')
    })
  })

  describe('createFilename', () => {
    it('creates filename with individual category', () => {
      const result = createFilename('John Doe', 'individual')
      expect(result).toBe('John_Doe_individual_dossier.zip')
    })

    it('creates filename with organisation category', () => {
      const result = createFilename('Acme Corp', 'organisation')
      expect(result).toBe('Acme_Corp_organisation_dossier.zip')
    })

    it('replaces multiple spaces with single underscore', () => {
      const result = createFilename('John   Doe   Smith', 'individual')
      expect(result).toBe('John_Doe_Smith_individual_dossier.zip')
    })

    it('handles single word names', () => {
      const result = createFilename('Apple', 'organisation')
      expect(result).toBe('Apple_organisation_dossier.zip')
    })

    it('handles names with special characters', () => {
      const result = createFilename('John & Jane Doe', 'individual')
      expect(result).toBe('John_&_Jane_Doe_individual_dossier.zip')
    })

    it('handles empty string name', () => {
      const result = createFilename('', 'individual')
      expect(result).toBe('_individual_dossier.zip')
    })

    it('handles names with leading/trailing spaces', () => {
      const result = createFilename('  John Doe  ', 'individual')
      expect(result).toBe('_John_Doe__individual_dossier.zip')
    })

    it('preserves non-space characters', () => {
      const result = createFilename('Company-Name_LLC', 'organisation')
      expect(result).toBe('Company-Name_LLC_organisation_dossier.zip')
    })
  })
})
