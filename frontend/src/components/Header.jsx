import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3, Info } from 'lucide-react'
import './Header.css'

function Header() {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link'
  }
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <span className="hindi-text">मन</span>
            </div>
            <div className="logo-text">
              <div className="logo-title hindi-text">मनरेगा जिला प्रदर्शन</div>
              <div className="logo-subtitle">MGNREGA District Performance</div>
            </div>
          </Link>
          
          <nav className="nav">
            <Link to="/" className={isActive('/')}>
              <Home size={20} />
              <span className="hindi-text">होम</span> / Home
            </Link>
            <Link to="/compare" className={isActive('/compare')}>
              <BarChart3 size={20} />
              <span className="hindi-text">तुलना</span> / Compare
            </Link>
            <Link to="/about" className={isActive('/about')}>
              <Info size={20} />
              <span className="hindi-text">जानकारी</span> / About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

