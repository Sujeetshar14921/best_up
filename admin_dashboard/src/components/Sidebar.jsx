import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Users, Smartphone, LogOut, Menu, X, Image } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useState } from 'react'

export default function Sidebar() {
  const { logoutAdmin } = useAdmin()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/brands', label: 'Brands', icon: Package },
    { path: '/admin/phones', label: 'Phones', icon: Smartphone },
    { path: '/admin/banners', label: 'Banners', icon: Image },
    { path: '/admin/users', label: 'Users', icon: Users },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-primary text-white rounded-lg"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 w-64 h-screen bg-dark text-white transform md:transform-none transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } z-40`}
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            BestUp Admin
          </h1>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(path)
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={() => {
              logoutAdmin()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 md:hidden z-30"
        />
      )}
    </>
  )
}
