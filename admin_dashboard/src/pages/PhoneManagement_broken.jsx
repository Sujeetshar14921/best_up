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

      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8 max-h-96 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                name="name"
                placeholder="Phone Name"
                value={formData.name}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <input
                type="number"
                name="basePrice"
                placeholder="Base Price"
                value={formData.basePrice}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Overview */}
            <textarea
              name="overview"
              placeholder="Overview"
              value={formData.overview}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Image Upload */}
            <div className="mb-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="px-3 py-2 border border-gray-300 rounded-lg w-full"
              />
              {imagePreview && (
                <div className="mt-2 relative">
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Performance Section */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Processor"
                  value={formData.specs?.performance?.processor || ''}
                  onChange={(e) => handleSpecsChange('specs.performance.processor', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="AnTuTu Score"
                  value={formData.specs?.performance?.antutuScore || ''}
                  onChange={(e) => handleSpecsChange('specs.performance.antutuScore', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="GPU"
                  value={formData.specs?.performance?.gpu || ''}
                  onChange={(e) => handleSpecsChange('specs.performance.gpu', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Cooling System"
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
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🖥️ Display</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Screen Size"
                  value={formData.specs?.display?.size || ''}
                  onChange={(e) => handleSpecsChange('specs.display.size', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Resolution"
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
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📷 Camera</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-3">Rear - Main</p>
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
                      placeholder="Aperture"
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
                      placeholder="Zoom"
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
            <div className="border-b pb-6 mb-6">
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
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Other Specs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="OS"
                  value={formData.specs?.os || ''}
                  onChange={(e) => handleSpecsChange('specs.os', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Weight (g)"
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
            <div className="border-b pb-6 mb-6">
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
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">👍 Pros & 👎 Cons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                  value={formData.pros.join(', ')}
                  onChange={(e) => handleArrayInput('pros', e.target.value)}
                  placeholder="Pros (comma separated)"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={formData.cons.join(', ')}
                  onChange={(e) => handleArrayInput('cons', e.target.value)}
                  placeholder="Cons (comma separated)"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Variants */}
            <div className="border-b pb-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📦 Variants</h3>
              {formData.variants.map((v, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="RAM (GB)"
                      value={v.ram}
                      onChange={(e) => handleVariantChange(idx, 'ram', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Storage (GB)"
                      value={v.storage}
                      onChange={(e) => handleVariantChange(idx, 'storage', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Color"
                      value={v.color}
                      onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={v.price}
                      onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="SKU"
                      value={v.sku}
                      onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={v.stock}
                      onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="text-red-600 text-sm font-semibold hover:text-red-800"
                    >
                      Remove Variant
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addVariant}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Add Variant
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploadingImage}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {uploadingImage ? 'Uploading...' : editingId ? 'Update Phone' : 'Create Phone'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Phones List */}
      <div className="space-y-4">
        {phones.map(phone => (
          <div key={phone._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{phone.name}</h2>
                <p className="text-gray-600">{phone.brand} - ₹{phone.basePrice}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(phone)}
                  className="flex items-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(phone._id)}
                  className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
                  onClick={() => setExpandedPhone(expandedPhone === phone._id ? null : phone._id)}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  {expandedPhone === phone._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {expandedPhone === phone._id && (
              <div className="border-t pt-4 space-y-2">
                {phone.image && <img src={phone.image} alt={phone.name} className="h-48 w-48 object-cover rounded-lg" />}
                {phone.overview && <p><strong>Overview:</strong> {phone.overview}</p>}
                {phone.specs && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-bold">Specs:</p>
                    <p>Processor: {phone.specs?.performance?.processor}</p>
                    <p>Display: {phone.specs?.display?.size}" @ {phone.specs?.display?.refreshRate}Hz</p>
                    <p>Camera: {phone.specs?.camera?.rear?.main?.megapixels}MP rear</p>
                    <p>Battery: {phone.specs?.battery?.capacity}mAh</p>
                  </div>
                )}
                {phone.scores && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-bold">⭐ Scores:</p>
                    <p>Gaming: {phone.scores.gaming} | Camera: {phone.scores.camera} | Battery: {phone.scores.battery} | Display: {phone.scores.display} | Value: {phone.scores.valueForMoney}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
