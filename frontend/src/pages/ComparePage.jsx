import { useState, useEffect } from 'react'
import { BarChart3, Plus, X } from 'lucide-react'
import apiService from '../services/api'
import { formatIndianNumber, formatCurrency } from '../utils/formatters'
import './ComparePage.css'

function ComparePage() {
  const [districts, setDistricts] = useState([])
  const [selectedDistricts, setSelectedDistricts] = useState([])
  const [comparisonData, setComparisonData] = useState({})
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    loadDistricts()
  }, [])
  
  useEffect(() => {
    if (selectedDistricts.length >= 2) {
      loadComparisonData()
    }
  }, [selectedDistricts])
  
  const loadDistricts = async () => {
    try {
      const data = await apiService.getDistricts()
      setDistricts(data)
    } catch (err) {
      console.error('Error loading districts:', err)
    }
  }
  
  const loadComparisonData = async () => {
    try {
      setLoading(true)
      const data = await apiService.compareDistricts(selectedDistricts, 6)
      setComparisonData(data)
    } catch (err) {
      console.error('Error loading comparison data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const addDistrict = (code) => {
    if (code && !selectedDistricts.includes(code) && selectedDistricts.length < 4) {
      setSelectedDistricts([...selectedDistricts, code])
    }
  }
  
  const removeDistrict = (code) => {
    setSelectedDistricts(selectedDistricts.filter(d => d !== code))
    const newData = { ...comparisonData }
    delete newData[code]
    setComparisonData(newData)
  }
  
  const getDistrictName = (code) => {
    const district = districts.find(d => d.district_code === code)
    return district ? district.district_name : code
  }
  
  const getLatestData = (code) => {
    const data = comparisonData[code]
    return data && data.length > 0 ? data[0] : null
  }
  
  const metrics = [
    { key: 'total_households_issued_jobcards', label: 'Households', labelHi: 'परिवार', formatter: formatIndianNumber },
    { key: 'person_days_generated', label: 'Person Days', labelHi: 'व्यक्ति दिवस', formatter: formatIndianNumber },
    { key: 'total_expenditure', label: 'Expenditure', labelHi: 'व्यय', formatter: formatCurrency },
    { key: 'total_works_completed', label: 'Works Completed', labelHi: 'पूर्ण कार्य', formatter: formatIndianNumber },
    { key: 'work_completion_rate', label: 'Completion Rate (%)', labelHi: 'पूर्णता दर', formatter: (val) => val.toFixed(1) + '%' },
  ]
  
  return (
    <div className="compare-page">
      <div className="container">
        <div className="page-header-compare">
          <h1 className="page-title">
            <BarChart3 size={32} />
            <div>
              <span className="hindi-text">जिलों की तुलना करें</span>
              <br />
              <span className="page-subtitle">Compare Districts</span>
            </div>
          </h1>
          <p className="page-description">
            <span className="hindi-text">एक साथ 4 जिलों तक की तुलना करें</span>
            <br />
            Compare up to 4 districts side by side
          </p>
        </div>
        
        {/* District Selector */}
        <div className="district-selector-compare">
          <label className="selector-label">
            <Plus size={20} />
            <span className="hindi-text">जिला जोड़ें</span> Add District
          </label>
          <select 
            onChange={(e) => addDistrict(e.target.value)}
            value=""
            disabled={selectedDistricts.length >= 4}
            className="select-compare"
          >
            <option value="">-- Select a district to compare --</option>
            {districts
              .filter(d => !selectedDistricts.includes(d.district_code))
              .map(district => (
                <option key={district.id} value={district.district_code}>
                  {district.district_name}
                </option>
              ))
            }
          </select>
          {selectedDistricts.length >= 4 && (
            <p className="helper-text">Maximum 4 districts can be compared</p>
          )}
        </div>
        
        {/* Selected Districts */}
        {selectedDistricts.length > 0 && (
          <div className="selected-districts">
            {selectedDistricts.map(code => (
              <div key={code} className="selected-district-chip">
                <span>{getDistrictName(code)}</span>
                <button 
                  className="remove-btn"
                  onClick={() => removeDistrict(code)}
                  aria-label="Remove district"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Comparison Table */}
        {selectedDistricts.length >= 2 && (
          <div className="comparison-section">
            <h2 className="section-title">
              <span className="hindi-text">तुलना</span> Comparison
            </h2>
            
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p className="hindi-text">लोड हो रहा है...</p>
              </div>
            ) : (
              <div className="comparison-table-wrapper">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th className="metric-header">
                        <span className="hindi-text">मेट्रिक</span> Metric
                      </th>
                      {selectedDistricts.map(code => (
                        <th key={code} className="district-header">
                          {getDistrictName(code)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map(metric => {
                      const values = selectedDistricts.map(code => {
                        const data = getLatestData(code)
                        return data ? data[metric.key] : 0
                      })
                      const maxValue = Math.max(...values)
                      
                      return (
                        <tr key={metric.key}>
                          <td className="metric-cell">
                            <div className="hindi-text">{metric.labelHi}</div>
                            <div className="metric-label-en">{metric.label}</div>
                          </td>
                          {selectedDistricts.map((code, idx) => {
                            const data = getLatestData(code)
                            const value = data ? data[metric.key] : 0
                            const isMax = value === maxValue && maxValue > 0
                            
                            return (
                              <td key={code} className={`value-cell ${isMax ? 'max-value' : ''}`}>
                                {data ? metric.formatter(value) : '-'}
                                {isMax && <span className="badge badge-success">Highest</span>}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {selectedDistricts.length < 2 && (
          <div className="empty-state">
            <BarChart3 size={64} color="var(--text-secondary)" />
            <p className="hindi-text">कम से कम 2 जिलों का चयन करें</p>
            <p>Select at least 2 districts to compare</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComparePage

