import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function BannerManagement() {
  const [banners, setBanners] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFile: null,
    imageUrl: '',
    imagePreview: '',
    linkUrl: '',
    position: 'horizontal',
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/banners`)
      setBanners(response.data.data || [])
      setError('')
    } catch (err) {
      setError('Failed to fetch banners')
      console.error('Error fetching banners:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        title: banner.title,
        description: banner.description,
        imageFile: null,
        imageUrl: banner.imageUrl,
        imagePreview: banner.imageUrl,
        linkUrl: banner.linkUrl,
        position: banner.position,
        isActive: banner.isActive
      })
    } else {
      setEditingBanner(null)
      setFormData({
        title: '',
        description: '',
        imageFile: null,
        imageUrl: '',
        imagePreview: '',
        linkUrl: '',
        position: 'horizontal',
        isActive: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingBanner(null)
    setFormData({
      title: '',
      description: '',
      imageFile: null,
      imageUrl: '',
      imagePreview: '',
      linkUrl: '',
      position: 'horizontal',
      isActive: true
    })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    console.log('1. File selected:', file?.name, file?.size)
    
    if (!file) {
      console.log('No file selected')
      return
    }

    const reader = new FileReader()
    
    reader.onload = (event) => {
      const result = event.target.result
      console.log('2. FileReader loaded, result length:', result.length)
      console.log('3. Setting state with preview')
      
      setFormData(prev => {
        const newState = {
          ...prev,
          imageFile: file,
          imagePreview: result,
          imageUrl: ''
        }
        console.log('4. New form state:', { preview: newState.imagePreview.substring(0, 50) + '...' })
        return newState
      })
    }
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error)
    }
    
    console.log('Reading file as DataURL...')
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('linkUrl', formData.linkUrl)
      submitData.append('position', formData.position)
      submitData.append('isActive', formData.isActive)
      
      if (formData.imageFile) {
        submitData.append('image', formData.imageFile)
      } else if (formData.imageUrl) {
        submitData.append('imageUrl', formData.imageUrl)
      }

      if (editingBanner) {
        await axios.put(`${API_URL}/banners/${editingBanner._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await axios.post(`${API_URL}/banners`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      fetchBanners()
      handleCloseModal()
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save banner')
      console.error('Error saving banner:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return

    try {
      setLoading(true)
      await axios.delete(`${API_URL}/banners/${bannerId}`)
      fetchBanners()
      setError('')
    } catch (err) {
      setError('Failed to delete banner')
      console.error('Error deleting banner:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map(banner => (
          <div
            key={banner._id}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 h-80"
          >
            {/* Background Image */}
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E'
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">No Image</div>
            )}

            {/* Overlay with Text */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100">
              {/* Top Section - Title & Description */}
              <div>
                <h3 className="text-white font-bold text-xl line-clamp-2 mb-2">{banner.title}</h3>
                {banner.description && (
                  <p className="text-white/90 text-sm line-clamp-2">{banner.description}</p>
                )}
              </div>

              {/* Bottom Section - Meta & Actions */}
              <div className="space-y-3">
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span className={`px-2 py-1 rounded ${banner.position === 'horizontal' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                    {banner.position}
                  </span>
                  <span className={`px-2 py-1 rounded ${banner.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(banner)}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-sm transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Always Visible Title at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 group-hover:hidden">
              <h3 className="text-white font-bold text-sm line-clamp-1">{banner.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBanner ? 'Edit Banner' : 'Add Banner'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Banner title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Banner description"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Image *
                </label>
                <label className="flex items-center justify-center px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                    <Upload size={18} />
                    <span className="text-sm font-medium">Choose Image</span>
                  </div>
                  <input
                    key={editingBanner ? editingBanner._id : 'new'}
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Debug: Show preview status */}
                <div style={{color: 'gray', fontSize: '12px', marginTop: '4px'}}>
                  Preview status: {formData.imagePreview ? 'YES - Should show' : 'NO - Not set'}
                </div>

                {/* Image Preview */}
                {formData.imagePreview && (
                  <div style={{marginTop: '16px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#f9f9f9', padding: '8px', position: 'relative'}}>
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      style={{width: '100%', height: '192px', objectFit: 'cover', borderRadius: '4px'}}
                    />
                    {formData.imageFile && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            imageFile: null,
                            imagePreview: '',
                            imageUrl: ''
                          }))
                        }
                        style={{position: 'absolute', top: '12px', right: '12px', background: '#ef4444', color: 'white', padding: '6px', borderRadius: '4px', border: 'none', cursor: 'pointer'}}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link URL
                </label>
                <input
                  type="url"
                  name="linkUrl"
                  value={formData.linkUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-semibold text-gray-700">
                  Active
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {loading ? 'Saving...' : 'Save Banner'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
