// Authentication service for handling user login/logout
// In a real application, this would connect to your backend API

const API_BASE_URL = 'http://localhost:8000/api'

class AuthService {
  // Mock login function - replace with actual API call
  async login(email, password) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation
      if (email && password.length >= 6) {
        const user = {
          id: Date.now(),
          email: email,
          name: email.split('@')[0],
          district: 'Lucknow', // Mock district
          loginTime: new Date().toISOString()
        }
        
        // Store in localStorage (in production, use secure token storage)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now())
        
        return { success: true, user }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      }
    }
  }

  // Mock registration function - replace with actual API call
  async register(userData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock validation
      if (userData.email && userData.password && userData.name) {
        const user = {
          id: Date.now(),
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          district: userData.district,
          registrationTime: new Date().toISOString()
        }
        
        // Store in localStorage (in production, use secure token storage)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now())
        
        return { success: true, user }
      } else {
        throw new Error('Registration data incomplete')
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      }
    }
  }

  // Logout function
  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
    return { success: true }
  }

  // Get current user
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const user = this.getCurrentUser()
    const token = localStorage.getItem('authToken')
    return !!(user && token)
  }

  // Get auth token
  getAuthToken() {
    return localStorage.getItem('authToken')
  }

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate password strength
  isValidPassword(password) {
    return password && password.length >= 6
  }

  // Validate phone number (Indian format)
  isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  }
}

// Create and export a singleton instance
const authService = new AuthService()
export default authService