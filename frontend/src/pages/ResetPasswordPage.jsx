import React, { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const prefilledToken = useMemo(() => searchParams.get('token') || '', [searchParams])
  const { resetPassword, loading } = useAuth()

  const [form, setForm] = useState({ token: prefilledToken, password: '', confirmPassword: '' })
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setSuccess(false)

    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    const result = await resetPassword({ token: form.token, password: form.password })
    setMessage(result.message)
    setSuccess(result.success)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-sm text-gray-600 mb-6">Use your reset token and set a new password.</p>

        {message && (
          <div className={`mb-4 p-3 rounded-lg border text-sm ${success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="token"
            value={form.token}
            onChange={onChange}
            placeholder="Reset token"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="New password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="Confirm new password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold disabled:opacity-60"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <Link to="/login" className="text-orange-600 hover:text-orange-700">Back to login</Link>
        </div>
      </div>
    </div>
  )
}
