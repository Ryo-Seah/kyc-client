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

// Mock EventSource for tests
class MockEventSource {
  url: string
  onopen: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  readyState: number = 1
  CONNECTING = 0
  OPEN = 1
  CLOSED = 2

  constructor(url: string) {
    this.url = url
    // Simulate immediate connection
    setTimeout(() => {
      if (this.onopen) {
        this.onopen(new Event('open'))
      }
    }, 0)
  }

  close() {
    this.readyState = this.CLOSED
  }
}

Object.defineProperty(globalThis, 'EventSource', {
  value: MockEventSource,
  writable: true
})
