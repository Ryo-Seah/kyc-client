import { describe, it, expect } from 'vitest'
import * as components from '../../components'

describe('Component exports', () => {
  it('exports all components correctly', () => {
    expect(components.NameInput).toBeDefined()
    expect(components.CategorySelector).toBeDefined()
    expect(components.CustomUrlsManager).toBeDefined()
    expect(components.SubmitButton).toBeDefined()
    expect(components.StatusMessage).toBeDefined()
  })
})
