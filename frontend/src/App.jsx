import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PhoneProvider } from './context/PhoneContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import PhonesPage from './pages/PhonesPage'
import RecommendPage from './pages/RecommendPage'
import ComparisonPage from './pages/ComparisonPage'
import DetailsPage from './pages/DetailsPage'
import './index.css'

function App() {
  return (
    <PhoneProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/phones" element={<PhonesPage />} />
              <Route path="/recommend" element={<RecommendPage />} />
              <Route path="/compare" element={<ComparisonPage />} />
              <Route path="/phone/:slug" element={<DetailsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PhoneProvider>
  )
}

export default App
