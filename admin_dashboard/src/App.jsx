import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider, useAdmin } from './context/AdminContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import BrandManagement from './pages/BrandManagement'
import UserManagement from './pages/UserManagement'
import PhoneManagement from './pages/PhoneManagement'
import BannerManagement from './pages/BannerManagement'
import LoginPage from './pages/LoginPage'

function AdminLayout() {
  const { admin } = useAdmin()
  const hasToken = Boolean(localStorage.getItem('adminToken'))

  if (!admin || !hasToken) {
    return <LoginPage />
  }

  return (
    <div className="flex h-screen bg-light">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="brands" element={<BrandManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="phones" element={<PhoneManagement />} />
            <Route path="banners" element={<BannerManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const routerBasename = window.location.pathname.startsWith('/admin') ? '/admin' : ''

  return (
    <AdminProvider>
      <Router basename={routerBasename}>
        <Routes>
          <Route path="/*" element={<AdminLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AdminProvider>
  )
}
