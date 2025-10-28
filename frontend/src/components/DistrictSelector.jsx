import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ChevronRight } from 'lucide-react'
import apiService from '../services/api'
import './DistrictSelector.css'

function DistrictSelector({ onSelect, selectedCode }) {
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    loadDistricts()
  }, [])
  
  const loadDistricts = async () => {
    try {
      setLoading(true)
      const data = await apiService.getDistricts()
      setDistricts(data)
      setError(null)
    } catch (err) {
      console.error('Error loading districts:', err)
      setError('Failed to load districts')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSelect = (e) => {
    const code = e.target.value
    if (code) {
      if (onSelect) {
        onSelect(code)
      } else {
        navigate(`/district/${code}`)
      }
    }
  }
  
  if (loading) {
    return (
      <div className="district-selector">
        <label className="selector-label">
          <MapPin size={20} />
          <span className="hindi-text">अपना जिला चुनें</span> • Select Your District
        </label>
        <select disabled>
          <option>Loading districts...</option>
        </select>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="district-selector">
        <div className="alert alert-error">{error}</div>
      </div>
    )
  }
  
  return (
    <div className="district-selector">
      <label className="selector-label">
        <MapPin size={24} />
        <span className="label-text">
          <span className="hindi-text">अपना जिला चुनें</span> • Select Your District
        </span>
      </label>
      <div className="select-wrapper">
        <select 
          value={selectedCode || ''} 
          onChange={handleSelect}
          className="district-select"
        >
          <option value="">-- चुनें / Select a district --</option>
          {districts.map((district) => (
            <option key={district.id} value={district.district_code}>
              {district.district_name} ({district.district_code})
            </option>
          ))}
        </select>
        <ChevronRight className="select-arrow" size={24} />
      </div>
    </div>
  )
}

export default DistrictSelector

