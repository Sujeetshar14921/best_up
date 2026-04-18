import { Star } from 'lucide-react'
import React from 'react'

export const formatCurrency = (value) => {
  if (!value && value !== 0) return 'N/A'
  return `INR ${Number(value).toLocaleString('en-IN')}`
}

export const scoreText = (score) => {
  if (score >= 4.5) return 'Excellent'
  if (score >= 4) return 'Very Good'
  if (score >= 3.2) return 'Good'
  return 'Average'
}

export const getUseCases = (scores = {}) => {
  const mapping = [
    { key: 'gaming', label: 'Gaming', icon: 'Performance first' },
    { key: 'camera', label: 'Photography', icon: 'Camera lovers' },
    { key: 'battery', label: 'Heavy daily use', icon: 'Long battery life' },
    { key: 'display', label: 'Media and streaming', icon: 'Display quality' },
    { key: 'valueForMoney', label: 'Budget-smart buyers', icon: 'Best value' },
  ]

  return mapping
    .map((m) => ({ ...m, value: Number(scores[m.key] || 0) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
}

export const renderStars = (value) => {
  const rounded = Math.max(0, Math.min(5, Number(value || 0)))
  return (
    <>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          className={n <= rounded ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}
        />
      ))}
    </>
  )
}
