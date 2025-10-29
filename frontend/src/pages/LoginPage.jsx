import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Lock, LogIn, Mail, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import authService from '../services/authService'
import './AuthPages.css'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate email format
    if (!authService.isValidEmail(formData.email)) {
      setError('कृपया वैध ईमेल दर्ज करें / Please enter a valid email')
      setIsLoading(false)
      return
    }

    // Validate password
    if (!authService.isValidPassword(formData.password)) {
      setError('पासवर्ड कम से कम 6 अक्षर का होना चाहिए / Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const result = await authService.login(formData.email, formData.password)
      
      if (result.success) {
        // Trigger a page reload to update the user state in App component
        window.location.href = '/'
      } else {
        setError(result.error || 'लॉगिन में त्रुटि / Login failed. Please try again.')
      }
    } catch (err) {
      setError('लॉगिन में त्रुटि / Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card animate-scaleIn">
        <div className="auth-header">
          <div className="auth-icon">
            <LogIn size={32} />
          </div>
          <h1 className="auth-title">
            <span className="hindi-text">लॉगिन करें</span>
            <span className="english-text">Login</span>
          </h1>
          <p className="auth-subtitle">
            <span className="hindi-text">अपने खाते में प्रवेश करें</span>
            <span className="english-text">Access your account</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message animate-fadeIn">
              {error}
            </div>
          )}

          <div className="form-group animate-slideInLeft">
            <label htmlFor="email" className="form-label">
              <Mail size={18} className="label-icon" />
              <span className="hindi-text">ईमेल पता</span>
              <span className="english-text">Email Address</span>
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className={`form-input ${formData.email ? 'has-value' : ''}`}
                disabled={isLoading}
              />
              {formData.email && authService.isValidEmail(formData.email) && (
                <CheckCircle size={18} className="input-status success" />
              )}
              {formData.email && !authService.isValidEmail(formData.email) && (
                <AlertCircle size={18} className="input-status error" />
              )}
            </div>
          </div>

          <div className="form-group animate-slideInRight">
            <label htmlFor="password" className="form-label">
              <Shield size={18} className="label-icon" />
              <span className="hindi-text">पासवर्ड</span>
              <span className="english-text">Password</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={`form-input ${formData.password ? 'has-value' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle animate-bounce-subtle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {formData.password && (
                <div className="password-strength">
                  <div className={`strength-bar ${formData.password.length >= 6 ? 'strong' : 'weak'}`}></div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn animate-pulse-on-hover"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span className="hindi-text">लॉगिन हो रहा है...</span>
                <span className="english-text">Logging in...</span>
              </>
            ) : (
              <>
                <LogIn size={20} className="btn-icon" />
                <span className="hindi-text">लॉगिन करें</span>
                <span className="english-text">Login</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-link-text">
            <span className="hindi-text">खाता नहीं है?</span>
            <span className="english-text">Don't have an account?</span>
            <Link to="/register" className="auth-link">
              <span className="hindi-text">रजिस्टर करें</span>
              <span className="english-text">Register</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage