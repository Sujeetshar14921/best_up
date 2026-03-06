import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios'

const AdminContext = createContext()

const setAxiosAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [brands, setBrands] = useState([])
  const [users, setUsers] = useState([])
  const [phones, setPhones] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const postWithFallback = useCallback(async (primaryPath, fallbackPath, payload) => {
    try {
      return await axios.post(`${API}${primaryPath}`, payload)
    } catch (err) {
      if (err?.response?.status === 404 && fallbackPath) {
        return axios.post(`${API}${fallbackPath}`, payload)
      }
      throw err
    }
  }, [API])

  // Restore admin from localStorage on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin')
    const storedToken = localStorage.getItem('adminToken')

    if (storedAdmin && storedToken) {
      try {
        setAdmin(JSON.parse(storedAdmin))
        setAxiosAuthToken(storedToken)
      } catch (err) {
        console.error('Failed to restore admin session:', err)
        localStorage.removeItem('admin')
        localStorage.removeItem('adminToken')
        setAxiosAuthToken(null)
      }
    } else if (storedAdmin && !storedToken) {
      // Prevent stale UI session without auth token.
      localStorage.removeItem('admin')
      setAdmin(null)
      setAxiosAuthToken(null)
    }
  }, [])

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (err) => {
        if (err?.response?.status === 401) {
          setAdmin(null)
          localStorage.removeItem('admin')
          localStorage.removeItem('adminToken')
          setAxiosAuthToken(null)
          setError('Session expired. Please login again.')
        }
        return Promise.reject(err)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptorId)
    }
  }, [])

  // Admin Auth
  const loginAdmin = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await postWithFallback('/users/login', '/auth/login', { email, password })
      const token = response.data.token || response.data.data?.token || response.data.user?.token || null
      const user = response.data.data || response.data.user || null

      if (user && user.role === 'admin') {
        if (!token) {
          setError('Login response missing token. Please contact backend support.')
          return false
        }

        setAdmin(user)
        localStorage.setItem('admin', JSON.stringify(user))
        localStorage.setItem('adminToken', token)
        setAxiosAuthToken(token)
        return true
      } else {
        setError('Not an admin account')
        return false
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Login failed'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [postWithFallback])

  const logoutAdmin = useCallback(() => {
    setAdmin(null)
    localStorage.removeItem('admin')
    localStorage.removeItem('adminToken')
    setAxiosAuthToken(null)
  }, [])

  // Brand Management
  const fetchBrands = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API}/brands`)
      setBrands(response.data.data || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch brands')
    } finally {
      setLoading(false)
    }
  }, [])

  const createBrand = useCallback(async (brandData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${API}/brands`, brandData)
      setBrands([...brands, response.data.data])
      return response.data.data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create brand')
      throw err
    } finally {
      setLoading(false)
    }
  }, [brands])

  const updateBrand = useCallback(async (id, brandData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.put(`${API}/brands/${id}`, brandData)
      setBrands(brands.map(b => b._id === id ? response.data.data : b))
      return response.data.data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update brand')
      throw err
    } finally {
      setLoading(false)
    }
  }, [brands])

  const deleteBrand = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      await axios.delete(`${API}/brands/${id}`)
      setBrands(brands.filter(b => b._id !== id))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete brand')
      throw err
    } finally {
      setLoading(false)
    }
  }, [brands])

  // User Management
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API}/users`)
      setUsers(response.data.data || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUserRole = useCallback(async (id, role) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.put(`${API}/users/${id}/role`, { role })
      setUsers(users.map(u => u._id === id ? response.data.data : u))
      return response.data.data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user')
      throw err
    } finally {
      setLoading(false)
    }
  }, [users])

  const deactivateUser = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.put(`${API}/users/${id}/deactivate`, {})
      setUsers(users.map(u => u._id === id ? response.data.data : u))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to deactivate user')
      throw err
    } finally {
      setLoading(false)
    }
  }, [users])

  const activateUser = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.put(`${API}/users/${id}/activate`, {})
      setUsers(users.map(u => u._id === id ? response.data.data : u))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to activate user')
      throw err
    } finally {
      setLoading(false)
    }
  }, [users])

  const deleteUser = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      await axios.delete(`${API}/users/${id}`)
      setUsers(users.filter(u => u._id !== id))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user')
      throw err
    } finally {
      setLoading(false)
    }
  }, [users])

  const value = {
    admin,
    brands,
    users,
    phones,
    loading,
    error,
    loginAdmin,
    logoutAdmin,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    fetchUsers,
    updateUserRole,
    deactivateUser,
    activateUser,
    deleteUser,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
