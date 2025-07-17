import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Simple URL mock for axios
Object.defineProperty(globalThis, 'URL', {
  value: class URL {
    href: string
    origin = 'http://localhost'
    protocol = 'http:'
    host = 'localhost'
    pathname: string

    constructor(url: string, base?: string) {
      this.href = typeof base === 'string' ? base + url : url
      this.pathname = url
    }

    static createObjectURL = vi.fn(() => 'mocked-url')
    static revokeObjectURL = vi.fn()
  }
})
