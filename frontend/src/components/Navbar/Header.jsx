import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Zap, Menu, X, GitCompare } from 'lucide-react'
import SearchSuggestions from './SearchSuggestions'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-lg border-b border-white/20" style={{WebkitBackdropFilter: 'blur(10px)'}}>
      <div className="min-w-5xl  px-4 py-4 flex justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-0 flex-shrink-0 pl-10">
          <div className="text-2xl font-bold ">
            <span className="text-yellow-500">Best</span>
            <span className="text-orange-600">Up</span>
          </div>
        </Link>

        <div className="hidden lg:flex flex-1 max-w-sm">
          <SearchSuggestions />
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {[
            { path: '/', label: 'Home', icon: Zap },
            { path: '/compare', label: 'Compare', icon: GitCompare }
          ].map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive(path)
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-white/30 backdrop-blur-sm'
              }`}
              style={!isActive(path) ? {WebkitBackdropFilter: 'blur(5px)'} : {}}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <span className="px-3 py-2 text-sm text-gray-700">Hi, {user?.name?.split(' ')[0]}</span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-white/30 backdrop-blur-sm transition-all"
                style={{WebkitBackdropFilter: 'blur(5px)'}}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-white/30 backdrop-blur-sm transition-all" style={{WebkitBackdropFilter: 'blur(5px)'}}>
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all"
          style={{WebkitBackdropFilter: 'blur(5px)'}}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white/60 backdrop-blur-lg border-t border-white/20" style={{WebkitBackdropFilter: 'blur(10px)'}}>
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col gap-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-white/30 backdrop-blur-sm transition-all" style={{WebkitBackdropFilter: 'blur(5px)'}}>
                Home
              </Link>
              <Link to="/compare" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-white/30 backdrop-blur-sm transition-all" style={{WebkitBackdropFilter: 'blur(5px)'}}>
                Compare
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="block px-4 py-2 rounded-lg text-left text-gray-700 hover:bg-white/30 backdrop-blur-sm transition-all"
                  style={{WebkitBackdropFilter: 'blur(5px)'}}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-white/30 backdrop-blur-sm transition-all" style={{WebkitBackdropFilter: 'blur(5px)'}}>
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md transition-all">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
