import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PhoneProvider } from './context/PhoneContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import PhonesPage from './pages/PhonesPage'
import ComparisonPage from './pages/ComparisonPage'
import DetailsPage from './pages/DetailsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <PhoneProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/phones" element={<PhonesPage />} />
                <Route path="/compare" element={<ComparisonPage />} />
                <Route path="/phone/:slug" element={<DetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </PhoneProvider>
    </AuthProvider>
  )
}

export default App
