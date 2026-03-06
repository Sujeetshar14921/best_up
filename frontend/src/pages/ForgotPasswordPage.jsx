import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ForgotPasswordPage() {
  const { forgotPassword, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [debugToken, setDebugToken] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setDebugToken('')

    const result = await forgotPassword(email)
    if (result.success) {
      setMessage(result.message)
      if (result.resetToken) {
        setDebugToken(result.resetToken)
      }
    } else {
      setMessage(result.message)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your email to receive reset instructions.</p>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-sm">{message}</div>
        )}

        {debugToken && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs break-all">
            <strong>Dev reset token:</strong> {debugToken}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <Link to="/login" className="text-orange-600 hover:text-orange-700">Back to login</Link>
        </div>
      </div>
    </div>
  )
}
