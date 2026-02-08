import React, { useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'
import { Edit2, Trash2, Shield, AlertCircle } from 'lucide-react'

export default function UserManagement() {
  const { users, fetchUsers, updateUserRole, deactivateUser, deleteUser, loading, error } = useAdmin()

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleUpdateRole = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole)
    } catch (err) {
      console.error('Failed to update role:', err)
    }
  }

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await deactivateUser(id)
      } catch (err) {
        console.error('Failed to deactivate:', err)
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id)
      } catch (err) {
        console.error('Failed to delete:', err)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-dark">User Management</h1>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-danger/10 border border-danger rounded-lg text-danger">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark text-white">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((user, idx) => (
              <tr key={user._id} className={`border-t ${idx % 2 ? 'bg-light' : 'bg-white'}`}>
                <td className="px-6 py-3 font-semibold">{user.name}</td>
                <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                    className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                      user.role === 'admin'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.isActive
                        ? 'bg-success/20 text-success'
                        : 'bg-danger/20 text-danger'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeactivate(user._id)}
                      className="p-2 bg-warning text-white rounded-lg hover:bg-orange-600 transition-colors"
                      title="Deactivate"
                    >
                      <Shield size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="p-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!users || users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-primary">{users?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <p className="text-gray-600 text-sm">Active Users</p>
          <p className="text-3xl font-bold text-success">{users?.filter(u => u.isActive).length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <p className="text-gray-600 text-sm">Admin Users</p>
          <p className="text-3xl font-bold text-warning">{users?.filter(u => u.role === 'admin').length || 0}</p>
        </div>
      </div>
    </div>
  )
}
