import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authAPI, setApiAuthToken } from '../services/api'

const AuthContext = createContext()

const USER_KEY = 'bestup_user'
const TOKEN_KEY = 'bestup_token'

const normalizeUser = (data) => {
  if (!data) return null

  // Support multiple API shapes: { user }, { data: user }, { data: { user } }
  if (data.user) return data.user
  if (data.data?.user) return data.data.user
  if (data.data && typeof data.data === 'object') return data.data
  return null
}

const normalizeToken = (data) => {
  if (!data) return null

  // Support token at top level, inside data, or inside user payload.
  return data.token || data.data?.token || data.user?.token || data.data?.user?.token || null
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const persistSession = useCallback((nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    if (nextUser && nextToken) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      localStorage.setItem(TOKEN_KEY, nextToken)
      setApiAuthToken(nextToken)
    } else {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
      setApiAuthToken(null)
    }
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY)
    const storedToken = localStorage.getItem(TOKEN_KEY)

    if (!storedUser || !storedToken) {
      persistSession(null, null)
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      persistSession(parsedUser, storedToken)
    } catch (e) {
      persistSession(null, null)
    }
  }, [persistSession])

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.register({ name, email, password })
      const data = response.data || {}
      let nextUser = normalizeUser(data)
      let nextToken = normalizeToken(data)

      // Legacy /users/register response may not include token.
      // In that case, immediately login with the same credentials.
      if (!nextToken) {
        const loginResponse = await authAPI.login({ email, password })
        const loginData = loginResponse.data || {}
        nextUser = normalizeUser(loginData)
        nextToken = normalizeToken(loginData)
      }

      if (!nextUser || !nextToken) {
        throw new Error('Invalid registration response from server')
      }

      persistSession(nextUser, nextToken)
      return { success: true, message: data.message || 'Registration successful' }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [persistSession])

  const login = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.login({ email, password })
      const data = response.data || {}
      const nextUser = normalizeUser(data)
      const nextToken = normalizeToken(data)

      if (!nextUser || !nextToken) {
        throw new Error('Invalid login response from server')
      }

      persistSession(nextUser, nextToken)
      return { success: true, message: data.message || 'Login successful' }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [persistSession])

  const logout = useCallback(() => {
    setError(null)
    persistSession(null, null)
  }, [persistSession])

  const forgotPassword = useCallback(async (email) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.forgotPassword({ email })
      return {
        success: true,
        message: response.data?.message || 'Reset instructions sent',
        resetToken: response.data?.resetToken || null
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Forgot password failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async ({ token: resetToken, password }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.resetPassword({ token: resetToken, password })
      return { success: true, message: response.data?.message || 'Password reset successful' }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Reset password failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshMe = useCallback(async () => {
    if (!token) return
    try {
      const response = await authAPI.getMe()
      const currentUser = response.data?.user
      if (currentUser) {
        persistSession(currentUser, token)
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        persistSession(null, null)
      }
    }
  }, [persistSession, token])

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loading,
    error,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    refreshMe
  }), [user, token, loading, error, register, login, logout, forgotPassword, resetPassword, refreshMe])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
