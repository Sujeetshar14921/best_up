import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Phones API
export const phonesAPI = {
  // Get all phones with filters
  getPhones: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return api.get(`/phones?${params.toString()}`)
  },

  // Get phone by slug
  getPhoneBySlug: (slug) => api.get(`/phones/${slug}`),

  // Get phone by ID
  getPhoneById: (id) => api.get(`/phones?_id=${id}`),

  // Get recommendations
  recommendPhones: (budget, priority, limit = 5) =>
    api.get(`/phones/recommend?budget=${budget}&priority=${priority}&limit=${limit}`),

  // Compare phones
  comparePhones: (phoneIds) =>
    api.get(`/phones/compare?ids=${phoneIds.join(',')}`),

  // Create phone (admin)
  createPhone: (phoneData) => api.post('/phones', phoneData),

  // Update phone (admin)
  updatePhone: (slug, phoneData) => api.put(`/phones/${slug}`, phoneData),

  // Delete phone (admin)
  deletePhone: (slug) => api.delete(`/phones/${slug}`)
}

export default api
