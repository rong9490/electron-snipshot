import React from 'react'

interface CardProps {
  title: string
  value: string | number
  change: string
}

export default function Card({ title, value, change }: CardProps) {
  const isPositive = change.startsWith('+')

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div
        className={`text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-gray-500'
        }`}
      >
        {change}
      </div>
    </div>
  )
}
