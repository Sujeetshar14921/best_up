import React, { createContext, useContext, useState, useCallback } from 'react'
import { phonesAPI } from '../services/api'

const PhoneContext = createContext()

export const PhoneProvider = ({ children }) => {
  const [phones, setPhones] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPhones = useCallback(async (filters) => {
    setLoading(true)
    setError(null)
    try {
      const response = await phonesAPI.getPhones(filters)
      setPhones(response.data.data || response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch phones')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRecommendations = useCallback(async (budget, priority) => {
    setLoading(true)
    setError(null)
    try {
      const response = await phonesAPI.recommendPhones(budget, priority)
      setRecommendations(response.data.data || response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch recommendations')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchComparison = useCallback(async (phoneIds) => {
    setLoading(true)
    setError(null)
    try {
      const response = await phonesAPI.comparePhones(phoneIds)
      setComparison(response.data.data || response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch comparison')
    } finally {
      setLoading(false)
    }
  }, [])

  const value = {
    phones,
    recommendations,
    comparison,
    loading,
    error,
    fetchPhones,
    fetchRecommendations,
    fetchComparison,
    setError
  }

  return <PhoneContext.Provider value={value}>{children}</PhoneContext.Provider>
}

export const usePhones = () => {
  const context = useContext(PhoneContext)
  if (!context) {
    throw new Error('usePhones must be used within PhoneProvider')
  }
  return context
}
