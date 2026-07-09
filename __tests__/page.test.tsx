import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import StadiumSyncApp from '../app/page'

// Mocking the matchMedia since it's not available in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('StadiumSyncApp', () => {
  it('renders without crashing', () => {
    render(<StadiumSyncApp />)
    const navItems = ['Home', 'Matches', 'Stadiums', 'Translate', 'Concierge', 'Explore']
    navItems.forEach(item => {
      // It should render the bottom navigation texts
      expect(screen.getAllByText(item).length).toBeGreaterThan(0)
    })
  })
})
