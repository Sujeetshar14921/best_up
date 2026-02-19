import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Smartphone, Zap, BarChart3, Menu, X, GitCompare, Search } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b-2 border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="text-2xl font-bold">
            <span className="text-yellow-500">Best</span>
            <span className="text-orange-600">Up</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {[
            { path: '/', label: 'Home', icon: Zap },
            { path: '/phones', label: 'Explore', icon: Search },
            { path: '/recommend', label: 'Recommendations', icon: BarChart3 },
            { path: '/compare', label: 'Compare', icon: GitCompare }
          ].map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive(path)
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-yellow-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/phones', label: 'Explore' },
                { path: '/recommend', label: 'Recommendations' },
                { path: '/compare', label: 'Compare' }
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-all ${
                    isActive(path)
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                      : 'text-gray-700 hover:bg-yellow-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
