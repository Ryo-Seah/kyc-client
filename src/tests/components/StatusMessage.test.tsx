import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusMessage } from '../../components/StatusMessage'

describe('StatusMessage', () => {
  it('renders nothing when message is empty', () => {
    const { container } = render(<StatusMessage message="" isError={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the message text', () => {
    const message = 'Test message'
    render(<StatusMessage message={message} isError={false} />)
    
    expect(screen.getByText(message)).toBeInTheDocument()
  })

  it('renders success message with green color', () => {
    const message = 'Success!'
    render(<StatusMessage message={message} isError={false} />)
    
    const element = screen.getByText(message)
    expect(element).toHaveStyle({ color: 'rgb(0, 128, 0)' })
  })

  it('renders error message with red color', () => {
    const message = 'Error occurred'
    render(<StatusMessage message={message} isError={true} />)
    
    const element = screen.getByText(message)
    expect(element).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('has correct margin styling', () => {
    const message = 'Test message'
    render(<StatusMessage message={message} isError={false} />)
    
    const element = screen.getByText(message)
    expect(element).toHaveStyle({ marginTop: '20px' })
  })

  it('renders long messages correctly', () => {
    const longMessage = 'This is a very long message that should still be rendered correctly without any issues'
    render(<StatusMessage message={longMessage} isError={false} />)
    
    expect(screen.getByText(longMessage)).toBeInTheDocument()
  })

  it('handles special characters in message', () => {
    const messageWithSpecialChars = 'Error: File not found (404) - Please try again!'
    render(<StatusMessage message={messageWithSpecialChars} isError={true} />)
    
    expect(screen.getByText(messageWithSpecialChars)).toBeInTheDocument()
  })
})
