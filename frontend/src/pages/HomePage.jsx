import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Briefcase, IndianRupee, TrendingUp, MapPin, ArrowRight } from 'lucide-react'
import DistrictSelector from '../components/DistrictSelector'
import StatCard from '../components/StatCard'
import ImagePlaceholder from '../components/ImagePlaceholder'
import apiService from '../services/api'
import { formatIndianNumber, formatCurrency } from '../utils/formatters'
import './HomePage.css'

function HomePage() {
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalHouseholds: 0,
    totalPersonDays: 0,
    totalExpenditure: 0,
    avgCompletionRate: 0,
  })
  const navigate = useNavigate()
  
  useEffect(() => {
    loadSummary()
  }, [])
  
  const loadSummary = async () => {
    try {
      setLoading(true)
      const data = await apiService.getPerformanceSummary()
      setSummary(data)
      
      // Calculate aggregate stats
      if (data.length > 0) {
        const totalHouseholds = data.reduce((sum, d) => sum + d.total_households, 0)
        const totalPersonDays = data.reduce((sum, d) => sum + d.total_person_days, 0)
        const totalExpenditure = data.reduce((sum, d) => sum + d.total_expenditure, 0)
        const avgCompletionRate = data.reduce((sum, d) => sum + d.avg_work_completion_rate, 0) / data.length
        
        setStats({
          totalHouseholds,
          totalPersonDays,
          totalExpenditure,
          avgCompletionRate,
        })
      }
    } catch (err) {
      console.error('Error loading summary:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleDistrictClick = (districtCode) => {
    navigate(`/district/${districtCode}`)
  }
  
  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="hindi-text">मनरेगा जिला प्रदर्शन</span>
            <br />
            <span className="hero-subtitle">MGNREGA District Performance</span>
          </h1>
          <p className="hero-description">
            <span className="hindi-text">
              अपने जिले का मनरेगा प्रदर्शन समझें। सरल भाषा में, सबके लिए।
            </span>
            <br />
            Understand your district's MGNREGA performance. In simple terms, for everyone.
          </p>
          
          <div className="hero-selector">
            <DistrictSelector />
          </div>
        </div>
        
        {/* State-wide Stats */}
        {!loading && stats.totalPersonDays > 0 && (
          <div className="state-stats-section">
            <h2 className="section-title">
              <span className="hindi-text">उत्तर प्रदेश</span> • Uttar Pradesh Overview
            </h2>
            
            <div className="grid grid-4">
              <StatCard
                icon={Users}
                value={formatIndianNumber(stats.totalHouseholds)}
                label="Total Households"
                labelHindi="कुल परिवार"
                color="var(--primary)"
              />
              <StatCard
                icon={Briefcase}
                value={formatIndianNumber(stats.totalPersonDays)}
                label="Person Days Generated"
                labelHindi="कुल व्यक्ति दिवस"
                color="var(--secondary)"
              />
              <StatCard
                icon={IndianRupee}
                value={formatCurrency(stats.totalExpenditure)}
                label="Total Expenditure"
                labelHindi="कुल व्यय"
                color="var(--accent)"
              />
              <StatCard
                icon={TrendingUp}
                value={stats.avgCompletionRate.toFixed(1)}
                label="Avg Completion Rate"
                labelHindi="औसत पूर्णता"
                suffix="%"
                color="var(--success)"
              />
            </div>
          </div>
        )}
        
        {/* Top Performing Districts */}
        {!loading && summary.length > 0 && (
          <div className="districts-section">
            <h2 className="section-title">
              <span className="hindi-text">जिलों का प्रदर्शन</span> • District Performance
            </h2>
            
            <div className="districts-grid">
              {summary.slice(0, 12).map((district) => (
                <div 
                  key={district.district_code} 
                  className="district-card"
                  onClick={() => handleDistrictClick(district.district_code)}
                >
                  <div className="district-header">
                    <MapPin size={24} color="var(--primary)" />
                    <h3 className="district-name">{district.district_name}</h3>
                  </div>
                  
                  <div className="district-stats">
                    <div className="district-stat">
                      <span className="stat-label hindi-text">व्यक्ति दिवस</span>
                      <span className="stat-value">{formatIndianNumber(district.total_person_days)}</span>
                    </div>
                    <div className="district-stat">
                      <span className="stat-label hindi-text">व्यय</span>
                      <span className="stat-value">{formatCurrency(district.total_expenditure)}</span>
                    </div>
                  </div>
                  
                  <div className="district-footer">
                    <span className="view-details">
                      View Details <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {summary.length > 12 && (
              <div className="text-center" style={{ marginTop: 'var(--spacing-xl)' }}>
                <p className="text-muted">
                  <span className="hindi-text">और {summary.length - 12} जिले</span> • 
                  {summary.length - 12} more districts available
                </p>
              </div>
            )}
          </div>
        )}
        
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="hindi-text">लोड हो रहा है...</p>
            <p>Loading...</p>
          </div>
        )}
        
        {/* Info Section */}
        <div className="info-section">
          <h2 className="section-title">
            <span className="hindi-text">मनरेगा क्या है?</span> • What is MGNREGA?
          </h2>
          <div className="info-grid">
            <div className="info-card">
              <h3 className="hindi-text">गारंटीड रोजगार</h3>
              <h4>Guaranteed Employment</h4>
              <p>
                100 days of guaranteed wage employment per year to rural households
              </p>
            </div>
            <div className="info-card">
              <h3 className="hindi-text">ग्रामीण विकास</h3>
              <h4>Rural Development</h4>
              <p>
                Creates durable assets and strengthens rural infrastructure
              </p>
            </div>
            <div className="info-card">
              <h3 className="hindi-text">सामाजिक सुरक्षा</h3>
              <h4>Social Security</h4>
              <p>
                Provides livelihood security and empowers rural communities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

