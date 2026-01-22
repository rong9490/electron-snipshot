import { render, screen } from '@testing-library/react'
import Card from './Card'

describe('Card', () => {
  const defaultProps = {
    title: 'Total Users',
    value: '1,234',
    change: '+12.5%',
  }

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Card {...defaultProps} />)
      expect(screen.getByText('Total Users')).toBeInTheDocument()
    })

    it('should render title correctly', () => {
      render(<Card {...defaultProps} />)
      expect(screen.getByText('Total Users')).toBeInTheDocument()
    })

    it('should render value correctly', () => {
      render(<Card {...defaultProps} />)
      expect(screen.getByText('1,234')).toBeInTheDocument()
    })

    it('should render change correctly', () => {
      render(<Card {...defaultProps} />)
      expect(screen.getByText('+12.5%')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('should accept string value', () => {
      render(<Card title="Test" value="123" change="+5%" />)
      expect(screen.getByText('123')).toBeInTheDocument()
    })

    it('should accept number value', () => {
      render(<Card title="Test" value={123} change="+5%" />)
      expect(screen.getByText('123')).toBeInTheDocument()
    })

    it('should handle different titles', () => {
      const { rerender } = render(<Card {...defaultProps} />)
      expect(screen.getByText('Total Users')).toBeInTheDocument()

      rerender(<Card {...defaultProps} title="Revenue" />)
      expect(screen.getByText('Revenue')).toBeInTheDocument()
      expect(screen.queryByText('Total Users')).not.toBeInTheDocument()
    })
  })

  describe('Visual Styling', () => {
    it('should apply green color for positive change', () => {
      render(<Card {...defaultProps} change="+12.5%" />)
      const changeElement = screen.getByText('+12.5%')
      expect(changeElement).toHaveClass('text-green-600')
    })

    it('should apply gray color for negative/neutral change', () => {
      render(<Card {...defaultProps} change="-5.2%" />)
      const changeElement = screen.getByText('-5.2%')
      expect(changeElement).toHaveClass('text-gray-500')
    })

    it('should apply gray color for change without + sign', () => {
      render(<Card {...defaultProps} change="0%" />)
      const changeElement = screen.getByText('0%')
      expect(changeElement).toHaveClass('text-gray-500')
    })

    it('should have proper container classes', () => {
      const { container } = render(<Card {...defaultProps} />)
      const cardElement = container.firstChild as HTMLElement
      expect(cardElement).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string values', () => {
      render(<Card title="Test" value="" change="+0%" />)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('should handle zero value', () => {
      render(<Card title="Test" value={0} change="+0%" />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should handle very long titles', () => {
      const longTitle = 'This is a very long card title that might wrap'
      render(<Card title={longTitle} value="100" change="+1%" />)
      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('should handle special characters in change', () => {
      render(<Card {...defaultProps} change="+$1,234.56" />)
      expect(screen.getByText('+$1,234.56')).toBeInTheDocument()
    })
  })
})
