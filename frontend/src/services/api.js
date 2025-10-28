import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const apiService = {
  // Get all districts
  getDistricts: async () => {
    const response = await api.get('/districts')
    return response.data
  },

  // Get specific district
  getDistrict: async (districtCode) => {
    const response = await api.get(`/districts/${districtCode}`)
    return response.data
  },

  // Get district performance data
  getDistrictPerformance: async (districtCode, months = 12) => {
    const response = await api.get(`/districts/${districtCode}/performance`, {
      params: { months }
    })
    return response.data
  },

  // Get latest performance
  getLatestPerformance: async (districtCode) => {
    const response = await api.get(`/districts/${districtCode}/latest`)
    return response.data
  },

  // Get performance summary for all districts
  getPerformanceSummary: async () => {
    const response = await api.get('/performance/summary')
    return response.data
  },

  // Compare districts
  compareDistricts: async (districtCodes, months = 6) => {
    const codes = Array.isArray(districtCodes) ? districtCodes.join(',') : districtCodes
    const response = await api.get('/compare', {
      params: { district_codes: codes, months }
    })
    return response.data
  },

  // Trigger data sync
  triggerSync: async (districtCode, months = 12) => {
    const response = await api.post(`/sync/${districtCode}`, null, {
      params: { months }
    })
    return response.data
  },
}

export default apiService

