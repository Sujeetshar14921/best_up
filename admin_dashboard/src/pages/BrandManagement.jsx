import React, { useEffect, useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react'

export default function BrandManagement() {
  const { brands, fetchBrands, createBrand, updateBrand, deleteBrand, loading, error } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    logoType: 'url',
    description: '',
    displayOrder: 0,
  })

  useEffect(() => {
    fetchBrands()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'displayOrder' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateBrand(editingId, formData)
        setEditingId(null)
      } else {
        await createBrand(formData)
      }
      setFormData({
        name: '',
        logo: '',
        logoType: 'url',
        description: '',
        displayOrder: 0,
      })
      setShowForm(false)
    } catch (err) {
      console.error('Failed to save brand:', err)
    }
  }

  const handleEdit = (brand) => {
    setFormData(brand)
    setEditingId(brand._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteBrand(id)
      } catch (err) {
        console.error('Failed to delete brand:', err)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark">Brand Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (!showForm) {
              setEditingId(null)
              setFormData({
                name: '',
                logo: '',
                logoType: 'url',
                description: '',
                displayOrder: 0,
              })
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Brand
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-danger/10 border border-danger rounded-lg text-danger">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Brand' : 'Add New Brand'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Brand Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Logo URL</label>
              <input
                type="url"
                name="logo"
                placeholder="https://example.com/logo.png"
                value={formData.logo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formData.logo && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <img src={formData.logo} alt="Logo Preview" className="h-16 object-contain" onError={(e) => {
                    e.target.style.display = 'none'
                  }} />
                </div>
              )}
            </div>

            <textarea
              name="description"
              placeholder="Brand Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows="3"
            />

            <input
              type="number"
              name="displayOrder"
              placeholder="Display Order"
              value={formData.displayOrder}
              onChange={handleInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-success text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Brand'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="px-6 py-2 bg-gray-300 text-dark rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Brands List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands && brands.map(brand => (
          <div key={brand._id} className="bg-white rounded-lg shadow-card p-6 hover:shadow-hover transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-2" onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'
                }} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(brand)}
                  className="p-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(brand._id)}
                  className="p-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-dark mb-2">{brand.name}</h3>
            {brand.description && (
              <p className="text-gray-600 text-sm mb-2">{brand.description}</p>
            )}
            <p className="text-xs text-gray-500">Order: {brand.displayOrder}</p>
          </div>
        ))}
      </div>

      {!brands || brands.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No brands added yet</p>
        </div>
      )}
    </div>
  )
}
