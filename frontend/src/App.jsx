import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import DistrictDetailPage from './pages/DistrictDetailPage'
import ComparePage from './pages/ComparePage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import authService from './services/authService'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

    const handleStorageChange = () => {
      const updatedUser = authService.getCurrentUser()
      setUser(updatedUser)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <Router>
      <div className="app">
        <Header user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/district/:districtCode" element={<DistrictDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <p className="footer-text">
              <span className="hindi-text">मनरेगा जिला प्रदर्शन</span> | MGNREGA District Performance
            </p>
            <p className="footer-subtext">
              Data source: data.gov.in | Made for rural India 🇮🇳
            </p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App

