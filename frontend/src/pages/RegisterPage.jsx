import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock, UserPlus, Phone, MapPin, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import authService from '../services/authService'
import './AuthPages.css'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const districts = [
    'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha',
    'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur',
    'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bijnor', 'Budaun',
    'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah',
    'Ayodhya', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar',
    'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur',
    'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj',
    'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar',
    'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba',
    'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad',
    'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli',
    'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur',
    'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra',
    'Sultanpur', 'Unnao', 'Varanasi'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const validateForm = () => {
    // Validate email
    if (!authService.isValidEmail(formData.email)) {
      setError('कृपया वैध ईमेल दर्ज करें / Please enter a valid email')
      return false
    }

    // Validate phone
    if (!authService.isValidPhone(formData.phone)) {
      setError('कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें / Please enter a valid 10-digit mobile number')
      return false
    }

    // Validate password
    if (!authService.isValidPassword(formData.password)) {
      setError('पासवर्ड कम से कम 6 अक्षर का होना चाहिए / Password must be at least 6 characters')
      return false
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('पासवर्ड मेल नहीं खाते / Passwords do not match')
      return false
    }

    // Validate required fields
    if (!formData.name.trim()) {
      setError('कृपया नाम दर्ज करें / Please enter your name')
      return false
    }

    if (!formData.district) {
      setError('कृपया जिला चुनें / Please select your district')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await authService.register(formData)
      
      if (result.success) {
        // Trigger a page reload to update the user state in App component
        window.location.href = '/'
      } else {
        setError(result.error || 'रजिस्ट्रेशन में त्रुटि / Registration failed. Please try again.')
      }
    } catch (err) {
      setError('रजिस्ट्रेशन में त्रुटि / Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card register-card animate-scaleIn">
        <div className="auth-header">
          <div className="auth-icon">
            <UserPlus size={32} />
          </div>
          <h1 className="auth-title">
            <span className="hindi-text">रजिस्टर करें</span>
            <span className="english-text">Register</span>
          </h1>
          <p className="auth-subtitle">
            <span className="hindi-text">नया खाता बनाएं</span>
            <span className="english-text">Create your account</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message animate-fadeIn">
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group animate-slideInLeft">
              <label htmlFor="name" className="form-label">
                <User size={18} className="label-icon" />
                <span className="hindi-text">पूरा नाम</span>
                <span className="english-text">Full Name</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="राम कुमार / Ram Kumar"
                  required
                  className={`form-input ${formData.name ? 'has-value' : ''}`}
                  disabled={isLoading}
                />
                {formData.name.trim() && (
                  <CheckCircle size={18} className="input-status success" />
                )}
              </div>
            </div>

            <div className="form-group animate-slideInRight">
              <label htmlFor="phone" className="form-label">
                <Phone size={18} className="label-icon" />
                <span className="hindi-text">मोबाइल नंबर</span>
                <span className="english-text">Mobile Number</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                  className={`form-input ${formData.phone ? 'has-value' : ''}`}
                  disabled={isLoading}
                />
                {formData.phone && authService.isValidPhone(formData.phone) && (
                  <CheckCircle size={18} className="input-status success" />
                )}
                {formData.phone && !authService.isValidPhone(formData.phone) && (
                  <AlertCircle size={18} className="input-status error" />
                )}
              </div>
            </div>
          </div>

          <div className="form-group animate-fadeIn">
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

          <div className="form-group animate-scaleIn">
            <label htmlFor="district" className="form-label">
              <MapPin size={18} className="label-icon" />
              <span className="hindi-text">जिला</span>
              <span className="english-text">District</span>
            </label>
            <div className="input-wrapper">
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className={`form-input ${formData.district ? 'has-value' : ''}`}
                disabled={isLoading}
              >
                <option value="">
                  जिला चुनें / Select District
                </option>
                {districts.map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {formData.district && (
                <CheckCircle size={18} className="input-status success" />
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group animate-slideInLeft">
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

            <div className="form-group animate-slideInRight">
              <label htmlFor="confirmPassword" className="form-label">
                <Shield size={18} className="label-icon" />
                <span className="hindi-text">पासवर्ड दोहराएं</span>
                <span className="english-text">Confirm Password</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className={`form-input ${formData.confirmPassword ? 'has-value' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle animate-bounce-subtle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {formData.confirmPassword && formData.password && (
                  <div className="password-match">
                    {formData.password === formData.confirmPassword ? (
                      <CheckCircle size={16} className="match-icon success" />
                    ) : (
                      <AlertCircle size={16} className="match-icon error" />
                    )}
                  </div>
                )}
              </div>
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
                <span className="hindi-text">खाता बनाया जा रहा है...</span>
                <span className="english-text">Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus size={20} className="btn-icon" />
                <span className="hindi-text">रजिस्टर करें</span>
                <span className="english-text">Register</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-link-text">
            <span className="hindi-text">पहले से खाता है?</span>
            <span className="english-text">Already have an account?</span>
            <Link to="/login" className="auth-link">
              <span className="hindi-text">लॉगिन करें</span>
              <span className="english-text">Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage