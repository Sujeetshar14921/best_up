import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2, Edit, Plus, ChevronDown, ChevronUp, X } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function PhoneManagement( ) {
  const [phones, setPhones] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [expandedPhone, setExpandedPhone] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Samsung',
    basePrice: '',
    overview: '',
    releaseDate: '',
    isUpcoming: false,
    launchDate: '',
    pros: [],
    cons: [],
    image: null,
    variants: [{ ram: 8, storage: 128, color: 'Black', price: 0, sku: '', availability: true, stock: 0 }],
    specs: {
      performance: { processor: '', antutuScore: '', ramOptions: [], coolingSystem: '', gpu: '' },
      display: { size: '', resolution: '', refreshRate: '', touchSamplingRate: '', brightness: '' },
      camera: {
        rear: {
          main: { megapixels: '', aperture: '', ois: false },
          ultraWide: { megapixels: '', fov: '' },
          telephoto: { megapixels: '', zoom: '', ois: false },
        },
        front: { megapixels: '', videoCapable4K: false },
      },
      battery: { capacity: '', chargingSpeed: '', wirelessCharging: false },
      os: '',
      storage: [],
      biometrics: [],
      weight: '',
      color: [],
    },
    scores: { gaming: '', camera: '', battery: '', display: '', valueForMoney: '' },
  })

  useEffect(() => {
    fetchPhones()
  }, [])

  const fetchPhones = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/phones/admin`)
      setPhones(response.data.data || [])
    } catch (error) {
      console.error('Error fetching phones:', error)
      alert('Failed to fetch phones')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      brand: 'Samsung',
      basePrice: '',
      overview: '',
      releaseDate: '',
      pros: [],
      cons: [],
      image: null,
      variants: [{ ram: 8, storage: 128, color: 'Black', price: 0, sku: '', availability: true, stock: 0 }],
      specs: {
        performance: { processor: '', antutuScore: '', ramOptions: [], coolingSystem: '', gpu: '' },
        display: { size: '', resolution: '', refreshRate: '', touchSamplingRate: '', brightness: '' },
        camera: {
          rear: {
            main: { megapixels: '', aperture: '', ois: false },
            ultraWide: { megapixels: '', fov: '' },
            telephoto: { megapixels: '', zoom: '', ois: false },
          },
          front: { megapixels: '', videoCapable4K: false },
        },
        battery: { capacity: '', chargingSpeed: '', wirelessCharging: false },
        os: '',
        storage: [],
        biometrics: [],
        weight: '',
        color: [],
      },
      scores: { gaming: '', camera: '', battery: '', display: '', valueForMoney: '' },
    })
    setEditingId(null)
    setImagePreview(null)
    setShowForm(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSpecsChange = (path, value) => {
    const keys = path.split('.')
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      let obj = newData
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {}
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleArrayInput = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(item => item),
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const newVariants = [...prev.variants]
      if (field === 'price' || field === 'ram' || field === 'storage' || field === 'stock') {
        newVariants[index][field] = parseInt(value) || 0
      } else if (field === 'availability') {
        newVariants[index][field] = value === 'true'
      } else {
        newVariants[index][field] = value
      }
      return { ...prev, variants: newVariants }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.basePrice || formData.variants.length === 0) {
      alert('Please fill required fields: Name, Price, and at least one variant')
      return
    }

    for (let i = 0; i < formData.variants.length; i++) {
      const v = formData.variants[i]
      if (!v.price || v.price <= 0) {
        alert(`Variant ${i + 1}: Price must be greater than 0`)
        return
      }
    }

    try {
      setUploadingImage(true)
      console.log('📤 Submitting form...')
      console.log('📤 Form data:', formData)

      const data = new FormData()
      data.append('name', formData.name || '')
      data.append('brand', formData.brand || 'Samsung')
      data.append('basePrice', parseInt(formData.basePrice) || 0)
      data.append('overview', formData.overview || '')
      data.append('releaseDate', formData.releaseDate || '')
      data.append('isUpcoming', formData.isUpcoming || false)
      data.append('launchDate', formData.launchDate || '')
      data.append('pros', JSON.stringify(formData.pros || []))
      data.append('cons', JSON.stringify(formData.cons || []))
      data.append('specs', JSON.stringify(formData.specs || {}))
      data.append('scores', JSON.stringify(formData.scores || {}))
      data.append('variants', JSON.stringify(formData.variants || []))
      if (formData.image) data.append('image', formData.image)

      console.log('📤 FormData entries:')
      for (let [key, value] of data.entries()) {
        console.log(`  ${key}:`, typeof value === 'string' ? value.substring(0, 100) : value)
      }

      if (editingId) {
        await axios.put(`${API_URL}/phones/admin/${editingId}`, data)
        alert('Phone updated successfully!')
      } else {
        await axios.post(`${API_URL}/phones/admin`, data)
        alert('Phone created successfully!')
      }

      fetchPhones()
      resetForm()
    } catch (error) {
      console.error('❌ Error:', error)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message
      alert('Error: ' + errorMsg)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleEdit = (phone) => {
    const defaultSpecs = {
      performance: { processor: '', antutuScore: '', ramOptions: [], coolingSystem: '', gpu: '' },
      display: { size: '', resolution: '', refreshRate: '', touchSamplingRate: '', brightness: '' },
      camera: {
        rear: {
          main: { megapixels: '', aperture: '', ois: false },
          ultraWide: { megapixels: '', fov: '' },
          telephoto: { megapixels: '', zoom: '', ois: false },
        },
        front: { megapixels: '', videoCapable4K: false },
      },
      battery: { capacity: '', chargingSpeed: '', wirelessCharging: false },
      os: '',
      storage: [],
      biometrics: [],
      weight: '',
      color: [],
    }

    setFormData({
      name: phone.name || '',
      brand: phone.brand || 'Samsung',
      basePrice: phone.basePrice || '',
      overview: phone.overview || '',
      releaseDate: phone.releaseDate || '',
      isUpcoming: phone.isUpcoming || false,
      launchDate: phone.launchDate || '',
      pros: phone.pros || [],
      cons: phone.cons || [],
      image: null,
      variants: phone.variants || [{ ram: 8, storage: 128, color: 'Black', price: 0, sku: '', availability: true, stock: 0 }],
      specs: { ...defaultSpecs, ...(phone.specs || {}) },
      scores: {
        gaming: phone.scores?.gaming || '',
        camera: phone.scores?.camera || '',
        battery: phone.scores?.battery || '',
        display: phone.scores?.display || '',
        valueForMoney: phone.scores?.valueForMoney || ''
      }
    })
    if (phone.imageId) {
      setImagePreview(`http://localhost:5000/api/phones/admin/phones/${phone._id}/image`)
    }
    setEditingId(phone._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/phones/admin/${id}`)
        alert('Phone deleted!')
        fetchPhones()
      } catch (error) {
        alert('Delete failed: ' + error.message)
      }
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">📱 Phone Management</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Phone
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Phone Name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="basePrice"
              placeholder="Base Price"
              value={formData.basePrice}
              onChange={handleInputChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="overview"
              placeholder="Overview"
              value={formData.overview}
              onChange={handleInputChange}
              className="col-span-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              className="col-span-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {/* Upcoming Phone Section */}
            <div className="col-span-2 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  name="isUpcoming"
                  checked={formData.isUpcoming}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <span className="font-semibold text-gray-800">Mark as Upcoming Launch</span>
              </label>
              
              {formData.isUpcoming && (
                <input
                  type="date"
                  name="launchDate"
                  placeholder="Expected Launch Date"
                  value={formData.launchDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              )}
            </div>
          </div>

          {/* Specs Sections */}
          <div className="space-y-4 mb-4">
            {/* Performance */}
            <div className="border rounded-lg p-3">
              <h3 className="font-bold mb-2">Performance</h3>
              <input
                type="text"
                placeholder="Processor"
                value={formData.specs?.performance?.processor || ''}
                onChange={(e) => handleSpecsChange('specs.performance.processor', e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="AnTuTu Score"
                value={formData.specs?.performance?.antutuScore || ''}
                onChange={(e) => handleSpecsChange('specs.performance.antutuScore', e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Display */}
            <div className="border rounded-lg p-3">
              <h3 className="font-bold mb-2">Display</h3>
              <input
                type="text"
                placeholder="Size (e.g. 6.1 inches)"
                value={formData.specs?.display?.size || ''}
                onChange={(e) => handleSpecsChange('specs.display.size', e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Resolution"
                value={formData.specs?.display?.resolution || ''}
                onChange={(e) => handleSpecsChange('specs.display.resolution', e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Refresh Rate (Hz)"
                value={formData.specs?.display?.refreshRate || ''}
                onChange={(e) => handleSpecsChange('specs.display.refreshRate', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Camera */}
            <div className="border rounded-lg p-3">
              <h3 className="font-bold mb-2">Camera</h3>
              <h4 className="text-sm font-semibold mb-2">Rear Main</h4>
              <input
                type="number"
                placeholder="MP"
                value={formData.specs?.camera?.rear?.main?.megapixels || ''}
                onChange={(e) => handleSpecsChange('specs.camera.rear.main.megapixels', e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Aperture"
                value={formData.specs?.camera?.rear?.main?.aperture || ''}
                onChange={(e) => handleSpecsChange('specs.camera.rear.main.aperture', e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <h4 className="text-sm font-semibold mb-2">Front Camera</h4>
              <input
                type="number"
                placeholder="MP"
                value={formData.specs?.camera?.front?.megapixels || ''}
                onChange={(e) => handleSpecsChange('specs.camera.front.megapixels', e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.specs?.camera?.front?.videoCapable4K || false}
                  onChange={(e) => handleSpecsChange('specs.camera.front.videoCapable4K', e.target.checked)}
                />
                <span>4K Video Capable</span>
              </label>
            </div>

            {/* Battery */}
            <div className="border rounded-lg p-3">
              <h3 className="font-bold mb-2">Battery</h3>
              <input
                type="number"
                placeholder="Capacity (mAh)"
                value={formData.specs?.battery?.capacity || ''}
                onChange={(e) => handleSpecsChange('specs.battery.capacity', e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Charging Speed"
                value={formData.specs?.battery?.chargingSpeed || ''}
                onChange={(e) => handleSpecsChange('specs.battery.chargingSpeed', e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.specs?.battery?.wirelessCharging || false}
                  onChange={(e) => handleSpecsChange('specs.battery.wirelessCharging', e.target.checked)}
                />
                <span>Wireless Charging</span>
              </label>
            </div>
          </div>

          {/* Variants */}
          <div className="border rounded-lg p-3 mb-4">
            <h3 className="font-bold mb-2">Variants</h3>
            {formData.variants.map((variant, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                <input
                  type="number"
                  placeholder="RAM"
                  value={variant.ram}
                  onChange={(e) => handleVariantChange(idx, 'ram', e.target.value)}
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Storage"
                  value={variant.storage}
                  onChange={(e) => handleVariantChange(idx, 'storage', e.target.value)}
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData(prev => ({
                  ...prev,
                  variants: [...prev.variants, { ram: 8, storage: 128, color: '', price: 0, sku: '', availability: true, stock: 0 }],
                }))
              }
              className="mt-2 px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Add Variant
            </button>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-2"
            />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover" />}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={uploadingImage}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {uploadingImage ? 'Uploading...' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : phones.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No phones yet</div>
      ) : (
        <div>
          {/* Available Phones Section */}
          {phones.filter(p => !p.isUpcoming).length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-blue-500 rounded"></div>
                <h2 className="text-lg font-bold text-blue-600">Available Phones</h2>
                <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {phones.filter(p => !p.isUpcoming).length}
                </span>
              </div>
              <div className="space-y-3">
                {phones.filter(p => !p.isUpcoming).map(phone => (
                  <div key={phone._id} className="bg-white p-4 rounded-lg shadow border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold">{phone.name} ({phone.brand})</h3>
                        </div>
                        <p className="text-sm text-gray-600">₹{phone.basePrice}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(phone)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(phone._id)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => setExpandedPhone(expandedPhone === phone._id ? null : phone._id)}
                          className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          {expandedPhone === phone._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                    {expandedPhone === phone._id && (
                      <div className="mt-4 text-sm text-gray-600 border-t pt-2">
                        <p><strong>Processor:</strong> {phone.specs?.performance?.processor || 'N/A'}</p>
                        <p><strong>Display:</strong> {phone.specs?.display?.size || 'N/A'} - {phone.specs?.display?.resolution || 'N/A'}</p>
                        <p><strong>Battery:</strong> {phone.specs?.battery?.capacity || 'N/A'} mAh</p>
                        <p><strong>Variants:</strong> {phone.variants?.length || 0}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Phones Section */}
          {phones.filter(p => p.isUpcoming).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-purple-500 rounded"></div>
                <h2 className="text-lg font-bold text-purple-600">✨ Upcoming Phones</h2>
                <span className="ml-2 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {phones.filter(p => p.isUpcoming).length}
                </span>
              </div>
              <div className="space-y-3">
                {phones.filter(p => p.isUpcoming).map(phone => (
                  <div key={phone._id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg shadow border-l-4 border-l-purple-500">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-purple-900">{phone.name} ({phone.brand})</h3>
                          <span className="inline-flex items-center gap-1 bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold">
                            Coming Soon
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          ₹{phone.basePrice}
                          {phone.launchDate && ` • Launching: ${new Date(phone.launchDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(phone)}
                          className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(phone._id)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => setExpandedPhone(expandedPhone === phone._id ? null : phone._id)}
                          className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          {expandedPhone === phone._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                    {expandedPhone === phone._id && (
                      <div className="mt-4 text-sm text-gray-600 border-t border-purple-200 pt-2">
                        <p><strong>Processor:</strong> {phone.specs?.performance?.processor || 'N/A'}</p>
                        <p><strong>Display:</strong> {phone.specs?.display?.size || 'N/A'} - {phone.specs?.display?.resolution || 'N/A'}</p>
                        <p><strong>Battery:</strong> {phone.specs?.battery?.capacity || 'N/A'} mAh</p>
                        <p><strong>Variants:</strong> {phone.variants?.length || 0}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

