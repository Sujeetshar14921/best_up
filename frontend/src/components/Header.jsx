import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Smartphone, Zap, BarChart3, Menu, X, Search, GitCompare } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path
  const isComparePage = location.pathname === '/compare'
  const showSearchBar = !isComparePage

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/phones?search=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b-2 border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="text-2xl font-bold">
            <span className="text-yellow-400">Best</span>
            <span className="text-blue-600">Up</span>
          </div>
        </Link>

        {/* Search Bar */}
        {showSearchBar && (
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by brand, model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </form>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {[
            { path: '/', label: 'Home', icon: Zap },
            { path: '/recommend', label: 'Recommendations', icon: BarChart3 },
            { path: '/compare', label: 'Compare', icon: GitCompare }
          ].map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive(path)
                  ? 'bg-blue-600 text-white shadow-md'
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
            {/* Mobile Search */}
            {showSearchBar && (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search phones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </form>
            )}

            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/recommend', label: 'Recommendations' },
                { path: '/compare', label: 'Compare' }
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-all ${
                    isActive(path)
                      ? 'bg-blue-600 text-white'
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
