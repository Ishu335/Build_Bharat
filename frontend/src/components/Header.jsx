import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3, Info, User, LogOut, LogIn, UserPlus } from 'lucide-react'
import './Header.css'

function Header({ user, onLogout }) {
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
          
          <div className="auth-section">
            {user ? (
              <div className="user-menu">
                <div className="nav-link">
                  <User size={20} />
                  <span className="user-name">{user.name || user.email}</span>
                </div>
                <button onClick={onLogout} className="nav-link">
                  <LogOut size={20} />
                  <span className="hindi-text">लॉगआउट</span> / Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className={isActive('/login')}>
                  <LogIn size={20} />
                  <span className="hindi-text">लॉगिन</span> / Login
                </Link>
                <Link to="/register" className={isActive('/register')}>
                  <UserPlus size={20} />
                  <span className="hindi-text">रजिस्टर</span> / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

