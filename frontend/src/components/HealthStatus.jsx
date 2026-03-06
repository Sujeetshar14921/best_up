import React, { useEffect, useState } from 'react'
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const HealthStatus = ({ showDetails = false }) => {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastCheck, setLastCheck] = useState(null)

  const fetchHealth = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API}/health/status`)
      setHealth(response.data.data)
      setLastCheck(new Date())
      setError(null)
    } catch (err) {
      console.error('Health check error:', err)
      setError('Failed to fetch health status')
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600'
      case 'degraded':
        return 'text-yellow-600'
      case 'critical':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200'
      case 'degraded':
        return 'bg-yellow-50 border-yellow-200'
      case 'critical':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (loading && !health) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  if (error && !health) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
        <span className="text-red-700 text-sm font-medium">{error}</span>
      </div>
    )
  }

  if (!health) {
    return null
  }

  const isHealthy = health.status === 'healthy'
  const uptime = health.uptime
  const memory = health.memory
  const responseTime = health.avgResponseTime

  const formatUptime = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className={`border rounded-lg p-4 md:p-6 ${getStatusBg(health.status)}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className={getStatusColor(health.status)} size={24} />
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              API Status
              {isHealthy ? (
                <CheckCircle className="text-green-600" size={18} />
              ) : (
                <AlertCircle className={getStatusColor(health.status)} size={18} />
              )}
            </h3>
            <p className={`text-sm font-semibold capitalize ${getStatusColor(health.status)}`}>
              {health.status}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Last checked</p>
          <p className="text-xs font-semibold text-gray-700">
            {lastCheck ? lastCheck.toLocaleTimeString() : 'Just now'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Uptime */}
        <div className="bg-white/50 rounded p-3">
          <p className="text-xs text-gray-600 mb-1">Uptime</p>
          <p className="font-bold text-gray-900 text-lg">{formatUptime(uptime)}</p>
        </div>

        {/* Response Time */}
        <div className="bg-white/50 rounded p-3">
          <p className="text-xs text-gray-600 mb-1">Avg Response</p>
          <p className="font-bold text-gray-900 text-lg">{responseTime.toFixed(0)}ms</p>
        </div>

        {/* Memory */}
        <div className="bg-white/50 rounded p-3">
          <p className="text-xs text-gray-600 mb-1">Memory Usage</p>
          <p className="font-bold text-gray-900 text-lg">{(memory / 1024 / 1024).toFixed(1)}MB</p>
        </div>
      </div>

      {/* Details Section */}
      {(showDetails || isHealthy) && health.components && (
        <div className="mt-4 pt-4 border-t border-current/20">
          <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
            Component Status
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(health.components).map(([name, status]) => (
              <div key={name} className="flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    status === 'operational'
                      ? 'bg-green-600'
                      : status === 'degraded'
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                  }`}
                ></div>
                <span className="capitalize font-medium text-gray-700">{name}:</span>
                <span className="text-gray-600 capitalize">{status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh hint */}
      <div className="mt-4 text-center">
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 transition"
        >
          {loading ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {/* Status message */}
      {!isHealthy && (
        <div className="mt-3 p-3 bg-white/50 rounded border-l-4 border-current">
          <p className={`text-sm font-medium ${getStatusColor(health.status)}`}>
            {health.status === 'degraded'
              ? 'The API is experiencing some slower response times'
              : 'The API is currently experiencing issues'}
          </p>
        </div>
      )}
    </div>
  )
}

export default HealthStatus
