import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Trash2, Edit, Plus, ChevronDown, ChevronUp, X } from 'lucide-react'

export default function PhoneManagement() {
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
    pros: [],
    cons: [],
    image: null,
    variants: [
      {
        ram: 8,
        storage: 128,
        color: 'Black',
        price: 0,
        sku: '',
        availability: true,
        stock: 0,
      }
    ],
    specs: {
      performance: {
        processor: '',
        antutuScore: '',
        ramOptions: [],
        coolingSystem: '',
        gpu: '',
      },
      display: {
        size: '',
        resolution: '',
        refreshRate: '',
        touchSamplingRate: '',
        brightness: '',
      },
      camera: {
        rear: {
          main: { megapixels: '', aperture: '', ois: false },
          ultraWide: { megapixels: '', fov: '' },
          telephoto: { megapixels: '', zoom: '', ois: false },
        },
        front: { megapixels: '', videoCapable4K: false },
      },
      battery: {
        capacity: '',
        chargingSpeed: '',
        wirelessCharging: false,
      },
      os: '',
      storage: [],
      biometrics: [],
      weight: '',
      color: [],
    },
    scores: {
      gaming: '',
      camera: '',
      battery: '',
      display: '',
      valueForMoney: '',
    },
  })

  const brands = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Realme', 'POCO', 'Vivo', 'Oppo', 'Motorola', 'Other']

  useEffect(() => {
    fetchPhones()
  }, [])

  const fetchPhones = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/phones/admin/phones')
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
      variants: [
        {
          ram: 8,
          storage: 128,
          color: 'Black',
          price: 0,
          sku: '',
          availability: true,
          stock: 0,
        }
      ],
      specs: {
        performance: {
          processor: '',
          antutuScore: '',
          ramOptions: [],
          coolingSystem: '',
          gpu: '',
        },
        display: {
          size: '',
          resolution: '',
          refreshRate: '',
          touchSamplingRate: '',
          brightness: '',
        },
        camera: {
          rear: {
            main: { megapixels: '', aperture: '', ois: false },
            ultraWide: { megapixels: '', fov: '' },
            telephoto: { megapixels: '', zoom: '', ois: false },
          },
          front: { megapixels: '', videoCapable4K: false },
        },
        battery: {
          capacity: '',
          chargingSpeed: '',
          wirelessCharging: false,
        },
        os: '',
        storage: [],
        biometrics: [],
        weight: '',
        color: [],
      },
      scores: {
        gaming: '',
        camera: '',
        battery: '',
        display: '',
        valueForMoney: '',
      },
    })
    setEditingId(null)
    setImagePreview(null)
    setShowForm(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSpecsChange = (path, value) => {
    const keys = path.split('.')
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))
      let obj = newData
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleArrayInput = (fieldName, value) => {
    const arr = value.split(',').map(v => v.trim()).filter(v => v)
    setFormData(prev => ({
      ...prev,
      [fieldName]: arr
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVariantChange = (index, field, value) => {
    let processedValue = value
    if (['ram', 'storage', 'price', 'stock'].includes(field)) {
      processedValue = value === '' ? 0 : parseInt(value) || 0
    }
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => 
        i === index ? { ...v, [field]: processedValue } : v
      )
    }))
  }

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        ram: 8,
        storage: 128,
        color: 'Black',
        price: 0,
        sku: '',
        availability: true,
        stock: 0,
      }]
    }))
  }

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.basePrice || formData.variants.length === 0) {
      alert('Please fill required fields: Name, Price, and at least one variant')
      return
    }

    // Validate variants have prices
    for (let i = 0; i < formData.variants.length; i++) {
      const v = formData.variants[i]
      if (!v.price || v.price <= 0) {
        alert(`Variant ${i + 1}: Price must be greater than 0`)
        return
      }
    }

    try {
      setUploadingImage(true)
      console.log('📤 Submitting form with data:', {
        name: formData.name,
        brand: formData.brand,
        basePrice: formData.basePrice,
        variantsCount: formData.variants.length,
        hasImage: !!formData.image
      })
      
      const data = new FormData()
      data.append('name', formData.name)
      data.append('brand', formData.brand)
      data.append('basePrice', parseInt(formData.basePrice) || 0)
      data.append('overview', formData.overview)
      data.append('releaseDate', formData.releaseDate)
      data.append('pros', JSON.stringify(formData.pros))
      data.append('cons', JSON.stringify(formData.cons))
      data.append('specs', JSON.stringify(formData.specs))
      data.append('scores', JSON.stringify(formData.scores))
      data.append('variants', JSON.stringify(formData.variants.map(v => ({
        ram: v.ram || 8,
        storage: v.storage || 128,
        color: v.color || 'Black',
        price: v.price || 0,
        sku: v.sku || '',
        availability: v.availability !== false,
        stock: v.stock || 0
      }))))

      if (formData.image) {
        data.append('image', formData.image)
      }

      console.log('📤 FormData prepared, sending to backend...')
      
      if (editingId) {
        await axios.put(`http://localhost:5000/api/phones/admin/phones/${editingId}`, data)
        alert('Phone updated successfully!')
      } else {
        const response = await axios.post('http://localhost:5000/api/phones/admin/phones', data)
        console.log('✅ Response from backend:', response.data)
        alert('Phone created successfully!')
      }

      fetchPhones()
      resetForm()
    } catch (error) {
      console.error('❌ Error submitting form:', error)
      console.error('❌ Error response:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message
      alert('Error: ' + errorMsg)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleEdit = (phone) => {
    // Ensure all nested specs have default values
    const defaultSpecs = {
      performance: {
        processor: '',
        antutuScore: '',
        ramOptions: [],
        coolingSystem: '',
        gpu: '',
      },
      display: {
        size: '',
        resolution: '',
        refreshRate: '',
        touchSamplingRate: '',
        brightness: '',
      },
      camera: {
        rear: {
          main: { megapixels: '', aperture: '', ois: false },
          ultraWide: { megapixels: '', fov: '' },
          telephoto: { megapixels: '', zoom: '', ois: false },
        },
        front: { megapixels: '', videoCapable4K: false },
      },
      battery: {
        capacity: '',
        chargingSpeed: '',
        wirelessCharging: false,
      },
      os: '',
      storage: [],
      biometrics: [],
      weight: '',
      color: [],
    }

    setFormData({
      ...phone,
      image: null,
      specs: { ...defaultSpecs, ...(phone.specs || {}) }
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
        await axios.delete(`http://localhost:5000/api/phones/admin/phones/${id}`)
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
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{editingId ? 'Edit Phone' : 'Add New Phone'}</h2>
            <button onClick={() => resetForm()} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Galaxy S24 Ultra"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Base Price (₹) *</label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    placeholder="e.g., 100000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Release Date</label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Overview</label>
                <textarea
                  name="overview"
                  value={formData.overview}
                  onChange={handleInputChange}
                  placeholder="Brief description..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📸 Phone Image</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {imagePreview && (
                  <div className="w-32 h-32 border rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Variants Section */}
            <div className="border-b pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">📦 Variants (RAM/Storage/Color)</h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                >
                  + Add Variant
                </button>
              </div>
              <div className="space-y-4">
                {formData.variants.map((variant, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                      <input
                        type="number"
                        placeholder="RAM (GB)"
                        value={variant.ram}
                        onChange={(e) => handleVariantChange(idx, 'ram', parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Storage (GB)"
                        value={variant.storage}
                        onChange={(e) => handleVariantChange(idx, 'storage', parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Color"
                        value={variant.color}
                        onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Price (₹) *"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(idx, 'stock', parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="SKU"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={variant.availability}
                          onChange={(e) => handleVariantChange(idx, 'availability', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-semibold">Available</span>
                      </label>
                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Section */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Processor (e.g., Snapdragon 8 Gen 3)"
                  value={formData.specs?.performance?.processor || ''}
                  onChange={(e) => handleSpecsChange('specs.performance.processor', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="AnTuTu Score (e.g., 2000000)"
                  value={formData.specs?.performance?.antutuScore || ''}
                  onChange={(e) => handleSpecsChange('specs.performance.antutuScore', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="GPU (e.g., Adreno 8)"
                  value={formData.specs?.performance?.gpu || ''}
                  onChange={(e) => handleSpecsChange('specs.performance.gpu', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Cooling (e.g., VC Cooling)"
                  value={formData.specs?.performance?.coolingSystem || ''}
                  onChange={(e) => handleSpecsChange('specs.performance.coolingSystem', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="RAM Options (e.g., 8,12,16)"
                  value={(formData.specs?.performance?.ramOptions || []).join(',')}
                  onChange={(e) => handleSpecsChange('specs.performance.ramOptions', e.target.value.split(',').map(v => parseInt(v)).filter(v => v))}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Display Section */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🖥️ Display</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Screen Size (e.g., 6.7)"
                  value={formData.specs?.display?.size || ''}
                  onChange={(e) => handleSpecsChange('specs.display.size', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Resolution (e.g., 2560x1600)"
                  value={formData.specs?.display?.resolution || ''}
                  onChange={(e) => handleSpecsChange('specs.display.resolution', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Refresh Rate (Hz)"
                  value={formData.specs?.display?.refreshRate || ''}
                  onChange={(e) => handleSpecsChange('specs.display.refreshRate', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Touch Sampling (Hz)"
                  value={formData.specs?.display?.touchSamplingRate || ''}
                  onChange={(e) => handleSpecsChange('specs.display.touchSamplingRate', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Brightness (nits)"
                  value={formData.specs?.display?.brightness || ''}
                  onChange={(e) => handleSpecsChange('specs.display.brightness', e.target.value)}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Camera Section */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📷 Camera</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-3">Rear - Main Camera</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="MP"
                      value={formData.specs?.camera?.rear?.main?.megapixels || ''}
                      onChange={(e) => handleSpecsChange('specs.camera.rear.main.megapixels', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Aperture (f/1.8)"
                      value={formData.specs?.camera?.rear?.main?.aperture || ''}
                      onChange={(e) => handleSpecsChange('specs.camera.rear.main.aperture', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.specs?.camera?.rear?.main?.ois || false}
                        onChange={(e) => handleSpecsChange('specs.camera.rear.main.ois', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold">OIS</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-3">Rear - Ultra Wide</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="MP"
                      value={formData.specs?.camera?.rear?.ultraWide?.megapixels || ''}
                      onChange={(e) => handleSpecsChange('specs.camera.rear.ultraWide.megapixels', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="FOV"
                      value={formData.specs?.camera?.rear?.ultraWide?.fov || ''}
                      onChange={(e) => handleSpecsChange('specs.camera.rear.ultraWide.fov', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-3">Rear - Telephoto</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="MP"
                      value={formData.specs?.camera?.rear?.telephoto?.megapixels || ''}
                      onChange={(e) => handleSpecsChange('specs.camera.rear.telephoto.megapixels', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Zoom (3x)"
                      value={formData.specs?.camera?.rear?.telephoto?.zoom || ''}
                      onChange={(e) => handleSpecsChange('specs.camera.rear.telephoto.zoom', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.specs?.camera?.rear?.telephoto?.ois || false}
                        onChange={(e) => handleSpecsChange('specs.camera.rear.telephoto.ois', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold">OIS</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-3">Front Camera</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="MP"
                      value={formData.specs?.camera?.front?.megapixels || ''}
                      onChange={(e) => handleSpecsChange('specs.camera.front.megapixels', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.specs?.camera?.front?.videoCapable4K || false}
                        onChange={(e) => handleSpecsChange('specs.camera.front.videoCapable4K', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold">4K Video</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Battery Section */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔋 Battery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Capacity (mAh)"
                  value={formData.specs?.battery?.capacity || ''}
                  onChange={(e) => handleSpecsChange('specs.battery.capacity', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Charging Speed (W)"
                  value={formData.specs?.battery?.chargingSpeed || ''}
                  onChange={(e) => handleSpecsChange('specs.battery.chargingSpeed', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.specs?.battery?.wirelessCharging || false}
                    onChange={(e) => handleSpecsChange('specs.battery.wirelessCharging', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">Wireless Charging</span>
                </label>
              </div>
            </div>

            {/* Other Specs */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Other Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="OS (e.g., Android 15)"
                  value={formData.specs?.os || ''}
                  onChange={(e) => handleSpecsChange('specs.os', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Weight (grams)"
                  value={formData.specs?.weight || ''}
                  onChange={(e) => handleSpecsChange('specs.weight', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Storage Options (e.g., 128,256,512)"
                  value={(formData.specs?.storage || []).join(',')}
                  onChange={(e) => handleSpecsChange('specs.storage', e.target.value.split(',').map(v => parseInt(v)).filter(v => v))}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Colors (e.g., Black,Silver,Blue)"
                  value={(formData.specs?.color || []).join(',')}
                  onChange={(e) => handleSpecsChange('specs.color', e.target.value.split(',').map(v => v.trim()).filter(v => v))}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Biometrics (e.g., Fingerprint,Face ID)"
                  value={(formData.specs?.biometrics || []).join(',')}
                  onChange={(e) => handleSpecsChange('specs.biometrics', e.target.value.split(',').map(v => v.trim()).filter(v => v))}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Scores */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⭐ Ratings (0-10)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Gaming"
                  value={formData.scores?.gaming || ''}
                  onChange={(e) => handleSpecsChange('scores.gaming', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Camera"
                  value={formData.scores?.camera || ''}
                  onChange={(e) => handleSpecsChange('scores.camera', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Battery"
                  value={formData.scores?.battery || ''}
                  onChange={(e) => handleSpecsChange('scores.battery', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Display"
                  value={formData.scores?.display || ''}
                  onChange={(e) => handleSpecsChange('scores.display', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="Value"
                  value={formData.scores?.valueForMoney || ''}
                  onChange={(e) => handleSpecsChange('scores.valueForMoney', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">👍 Pros & 👎 Cons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pros (comma separated)</label>
                  <textarea
                    value={formData.pros.join(', ')}
                    onChange={(e) => handleArrayInput('pros', e.target.value)}
                    placeholder="e.g., Great camera, Fast processor, Long battery life"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cons (comma separated)</label>
                  <textarea
                    value={formData.cons.join(', ')}
                    onChange={(e) => handleArrayInput('cons', e.target.value)}
                    placeholder="e.g., No SD card, High price, Average battery life"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploadingImage}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploadingImage && <span className="animate-spin">⏳</span>}
              {editingId ? 'Update Phone' : 'Create Phone'}
            </button>
          </form>
        </div>
      )}

      {/* Phones List */}
      {loading ? (
        <div className="text-center py-12">
          <span className="animate-spin text-2xl">⏳</span>
        </div>
      ) : phones.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No phones added yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {phones.map(phone => (
            <div key={phone._id} className="bg-white rounded-lg shadow border border-gray-200">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => setExpandedPhone(expandedPhone === phone._id ? null : phone._id)}
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{phone.name}</h3>
                  <p className="text-sm text-gray-600">₹{phone.basePrice?.toLocaleString()} | {phone.brand}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(phone)
                    }}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(phone._id)
                    }}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedPhone === phone._id ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              {expandedPhone === phone._id && (
                <div className="border-t bg-gray-50 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {phone.specs?.performance && (
                    <div>
                      <p className="font-bold text-gray-900">⚡ Performance</p>
                      <p className="text-gray-600">Processor: {phone.specs.performance.processor || 'N/A'}</p>
                      <p className="text-gray-600">AnTuTu: {phone.specs.performance.antutuScore?.toLocaleString() || 'N/A'}</p>
                    </div>
                  )}
                  {phone.specs?.display && (
                    <div>
                      <p className="font-bold text-gray-900">🖥️ Display</p>
                      <p className="text-gray-600">Size: {phone.specs.display.size}" | {phone.specs.display.refreshRate}Hz</p>
                      <p className="text-gray-600">Resolution: {phone.specs.display.resolution || 'N/A'}</p>
                    </div>
                  )}
                  {phone.specs?.camera && (
                    <div>
                      <p className="font-bold text-gray-900">📷 Camera</p>
                      <p className="text-gray-600">Main: {phone.specs.camera.rear?.main?.megapixels}MP | Front: {phone.specs.camera.front?.megapixels}MP</p>
                    </div>
                  )}
                  {phone.specs?.battery && (
                    <div>
                      <p className="font-bold text-gray-900">🔋 Battery</p>
                      <p className="text-gray-600">{phone.specs.battery.capacity?.toLocaleString()}mAh | {phone.specs.battery.chargingSpeed}W</p>
                    </div>
                  )}
                  {phone.scores && (
                    <div className="col-span-1 md:col-span-2">
                      <p className="font-bold text-gray-900">⭐ Scores</p>
                      <p className="text-gray-600">Gaming: {phone.scores.gaming} | Camera: {phone.scores.camera} | Battery: {phone.scores.battery} | Display: {phone.scores.display} | Value: {phone.scores.valueForMoney}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
