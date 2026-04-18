import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { PhoneProvider } from './context/PhoneContext'
import { AuthProvider } from './context/AuthContext'
import { Header } from './components/Navbar'
import { Footer } from './components/Home'
import { RouteRenderer } from './routes'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <PhoneProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <RouteRenderer />
            </main>
            <Footer />
          </div>
        </Router>
      </PhoneProvider>
    </AuthProvider>
  )
}

export default App
