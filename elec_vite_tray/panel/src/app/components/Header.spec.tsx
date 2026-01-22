import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Header />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should render logo with "P" text', () => {
      render(<Header />)
      expect(screen.getByText('P')).toBeInTheDocument()
    })

    it('should render "Panel" title', () => {
      render(<Header />)
      expect(screen.getByText('Panel')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should render navigation links', () => {
      render(<Header />)

      expect(screen.getByText('首页')).toBeInTheDocument()
      expect(screen.getByText('仪表板')).toBeInTheDocument()
      expect(screen.getByText('设置')).toBeInTheDocument()
    })

    it('should have correct href for navigation links', () => {
      render(<Header />)

      const homeLink = screen.getByText('首页')
      const dashboardLink = screen.getByText('仪表板')
      const settingsLink = screen.getByText('设置')

      expect(homeLink.closest('a')).toHaveAttribute('href', '/')
      expect(dashboardLink.closest('a')).toHaveAttribute('href', '/panel/dashboard')
      expect(settingsLink.closest('a')).toHaveAttribute('href', '/panel/settings')
    })
  })

  describe('Structure', () => {
    it('should have proper CSS classes', () => {
      render(<Header />)
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('bg-white', 'shadow-sm')
    })

    it('should render container with proper layout', () => {
      render(<Header />)
      const header = screen.getByRole('banner')

      // Check if container exists
      const container = header.querySelector('.container')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('mx-auto', 'px-4', 'py-4')
    })
  })

  describe('Edge Cases', () => {
    it('should render all elements when no props are provided', () => {
      render(<Header />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
    })
  })
})
