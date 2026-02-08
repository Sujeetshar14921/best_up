import React, { useEffect } from 'react'
import { useAdmin } from '../context/AdminContext'
import { BarChart3, Users, Package } from 'lucide-react'

export default function Dashboard() {
  const { brands, users, fetchBrands, fetchUsers } = useAdmin()

  useEffect(() => {
    fetchBrands()
    fetchUsers()
  }, [])

  const stats = [
    {
      title: 'Total Brands',
      value: brands?.length || 0,
      icon: Package,
      color: 'from-primary to-secondary',
    },
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      color: 'from-orange-500 to-pink-500',
    },
    {
      title: 'Admin Users',
      value: users?.filter(u => u.role === 'admin').length || 0,
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to BestUp Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-lg shadow-card p-6 text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-2">{stat.title}</p>
                  <p className="text-4xl font-bold">{stat.value}</p>
                </div>
                <Icon size={40} className="opacity-20" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-xl font-bold text-dark mb-4">Quick Stats</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-gray-600">Active Users</span>
            <span className="font-bold text-lg text-success">
              {users?.filter(u => u.isActive).length || 0}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-gray-600">Total Brands</span>
            <span className="font-bold text-lg text-primary">
              {brands?.length || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Admin Count</span>
            <span className="font-bold text-lg text-warning">
              {users?.filter(u => u.role === 'admin').length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-dark mb-2">Manage Brands</h3>
          <p className="text-gray-600 text-sm mb-4">
            Add, edit, and delete brands with their logos and details.
          </p>
          <a href="/admin/brands" className="text-primary font-semibold hover:underline">
            Go to Brands →
          </a>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-bold text-dark mb-2">Manage Users</h3>
          <p className="text-gray-600 text-sm mb-4">
            Control user roles, activate/deactivate, and remove users.
          </p>
          <a href="/admin/users" className="text-primary font-semibold hover:underline">
            Go to Users →
          </a>
        </div>
      </div>
    </div>
  )
}
