import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Briefcase, IndianRupee, TrendingUp, Calendar, RefreshCw } from 'lucide-react'
import StatCard from '../components/StatCard'
import PerformanceChart from '../components/PerformanceChart'
import apiService from '../services/api'
import { formatIndianNumber, formatCurrency, formatPercentage, getTrend, getPercentageChange } from '../utils/formatters'
import './DistrictDetailPage.css'

function DistrictDetailPage() {
  const { districtCode } = useParams()
  const navigate = useNavigate()
  const [district, setDistrict] = useState(null)
  const [performanceData, setPerformanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [syncing, setSyncing] = useState(false)
  
  useEffect(() => {
    loadDistrictData()
  }, [districtCode])
  
  const loadDistrictData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [districtInfo, performance] = await Promise.all([
        apiService.getDistrict(districtCode),
        apiService.getDistrictPerformance(districtCode, 12)
      ])
      
      setDistrict(districtInfo)
      setPerformanceData(performance)
    } catch (err) {
      console.error('Error loading district data:', err)
      setError('Failed to load district data. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSync = async () => {
    try {
      setSyncing(true)
      await apiService.triggerSync(districtCode, 12)
      setTimeout(() => {
        loadDistrictData()
      }, 2000)
    } catch (err) {
      console.error('Error syncing data:', err)
    } finally {
      setTimeout(() => setSyncing(false), 2000)
    }
  }
  
  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="hindi-text">लोड हो रहा है...</p>
          <p>Loading district data...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadDistrictData}>
            Retry
          </button>
        </div>
      </div>
    )
  }
  
  if (!district || performanceData.length === 0) {
    return (
      <div className="container">
        <div className="alert alert-info">
          <p className="hindi-text">इस जिले के लिए कोई डेटा उपलब्ध नहीं है।</p>
          <p>No data available for this district yet.</p>
          <button className="btn btn-primary" onClick={handleSync} disabled={syncing}>
            {syncing ? 'Syncing...' : 'Fetch Data'}
          </button>
        </div>
      </div>
    )
  }
  
  const latestData = performanceData[0]
  const previousData = performanceData[1]
  
  // Calculate trends
  const householdTrend = previousData ? getTrend(latestData.total_households_issued_jobcards, previousData.total_households_issued_jobcards) : null
  const householdChange = previousData ? getPercentageChange(latestData.total_households_issued_jobcards, previousData.total_households_issued_jobcards) : null
  
  const personDaysTrend = previousData ? getTrend(latestData.person_days_generated, previousData.person_days_generated) : null
  const personDaysChange = previousData ? getPercentageChange(latestData.person_days_generated, previousData.person_days_generated) : null
  
  const expenditureTrend = previousData ? getTrend(latestData.total_expenditure, previousData.total_expenditure) : null
  const expenditureChange = previousData ? getPercentageChange(latestData.total_expenditure, previousData.total_expenditure) : null
  
  const worksTrend = previousData ? getTrend(latestData.total_works_completed, previousData.total_works_completed) : null
  const worksChange = previousData ? getPercentageChange(latestData.total_works_completed, previousData.total_works_completed) : null
  
  return (
    <div className="district-detail-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span className="hindi-text">वापस</span> Back
          </button>
          
          <div className="district-info">
            <h1 className="district-title">{district.district_name}</h1>
            <p className="district-subtitle">
              <span className="hindi-text">{district.state_name}</span> • {district.state_name}
            </p>
            <p className="district-code">District Code: {district.district_code}</p>
          </div>
          
          <button 
            className="btn btn-outline" 
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw size={18} className={syncing ? 'spinning' : ''} />
            <span className="hindi-text">रिफ्रेश</span> Refresh
          </button>
        </div>
        
        {/* Latest Stats */}
        <div className="latest-stats-section">
          <h2 className="section-title">
            <Calendar size={24} />
            <span className="hindi-text">नवीनतम प्रदर्शन</span> • Latest Performance ({latestData.month})
          </h2>
          
          <div className="grid grid-4">
            <StatCard
              icon={Users}
              value={formatIndianNumber(latestData.total_households_issued_jobcards)}
              label="Households with Job Cards"
              labelHindi="जॉब कार्ड वाले परिवार"
              trend={householdTrend}
              trendValue={householdChange}
              color="var(--primary)"
            />
            <StatCard
              icon={Briefcase}
              value={formatIndianNumber(latestData.person_days_generated)}
              label="Person Days Generated"
              labelHindi="व्यक्ति दिवस उत्पन्न"
              trend={personDaysTrend}
              trendValue={personDaysChange}
              color="var(--secondary)"
            />
            <StatCard
              icon={IndianRupee}
              value={formatCurrency(latestData.total_expenditure)}
              label="Expenditure (Lakhs)"
              labelHindi="व्यय (लाख में)"
              trend={expenditureTrend}
              trendValue={expenditureChange}
              color="var(--accent)"
            />
            <StatCard
              icon={TrendingUp}
              value={formatIndianNumber(latestData.total_works_completed)}
              label="Works Completed"
              labelHindi="पूर्ण कार्य"
              trend={worksTrend}
              trendValue={worksChange}
              color="var(--success)"
            />
          </div>
        </div>
        
        {/* Additional Metrics */}
        <div className="additional-metrics">
          <h2 className="section-title">
            <span className="hindi-text">विस्तृत मेट्रिक्स</span> • Detailed Metrics
          </h2>
          
          <div className="grid grid-3">
            <div className="metric-card">
              <div className="metric-label hindi-text">औसत दिन प्रति परिवार</div>
              <div className="metric-label-en">Avg Days per Household</div>
              <div className="metric-value">{latestData.avg_days_per_household.toFixed(1)}</div>
              <div className="metric-subtitle">out of 100 days guaranteed</div>
            </div>
            
            <div className="metric-card">
              <div className="metric-label hindi-text">कार्य पूर्णता दर</div>
              <div className="metric-label-en">Work Completion Rate</div>
              <div className="metric-value">{formatPercentage(latestData.work_completion_rate)}</div>
              <div className="metric-subtitle">
                {formatIndianNumber(latestData.total_works_completed)} of {formatIndianNumber(latestData.total_works_takenup)} works
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-label hindi-text">महिला भागीदारी</div>
              <div className="metric-label-en">Women Participation</div>
              <div className="metric-value">
                {formatPercentage((latestData.women_persondays / latestData.person_days_generated) * 100)}
              </div>
              <div className="metric-subtitle">
                {formatIndianNumber(latestData.women_persondays)} person days
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="charts-section">
          <h2 className="section-title">
            <span className="hindi-text">प्रदर्शन रुझान</span> • Performance Trends
          </h2>
          
          <div className="grid grid-2">
            <PerformanceChart
              data={performanceData}
              dataKey="person_days_generated"
              title="Person Days Generated"
              titleHindi="व्यक्ति दिवस उत्पन्न"
              color="var(--secondary)"
              type="bar"
            />
            
            <PerformanceChart
              data={performanceData}
              dataKey="total_expenditure"
              title="Expenditure (Lakhs)"
              titleHindi="व्यय (लाख में)"
              color="var(--accent)"
              type="line"
            />
            
            <PerformanceChart
              data={performanceData}
              dataKey="total_works_completed"
              title="Works Completed"
              titleHindi="पूर्ण कार्य"
              color="var(--success)"
              type="bar"
            />
            
            <PerformanceChart
              data={performanceData}
              dataKey="work_completion_rate"
              title="Work Completion Rate (%)"
              titleHindi="कार्य पूर्णता दर (%)"
              color="var(--primary)"
              type="line"
            />
          </div>
        </div>
        
        {/* Social Inclusion */}
        <div className="inclusion-section">
          <h2 className="section-title">
            <span className="hindi-text">सामाजिक समावेश</span> • Social Inclusion
          </h2>
          
          <div className="inclusion-stats">
            <div className="inclusion-bar">
              <div className="inclusion-label">
                <span className="hindi-text">महिला</span> Women
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill women"
                  style={{ width: `${(latestData.women_persondays / latestData.person_days_generated) * 100}%` }}
                >
                  {formatPercentage((latestData.women_persondays / latestData.person_days_generated) * 100)}
                </div>
              </div>
              <div className="inclusion-value">{formatIndianNumber(latestData.women_persondays)}</div>
            </div>
            
            <div className="inclusion-bar">
              <div className="inclusion-label">
                <span className="hindi-text">अनुसूचित जाति</span> 
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill sc"
                  style={{ width: `${(latestData.sc_persondays / latestData.person_days_generated) * 100}%` }}
                >
                  {formatPercentage((latestData.sc_persondays / latestData.person_days_generated) * 100)}
                </div>
              </div>
              <div className="inclusion-value">{formatIndianNumber(latestData.sc_persondays)}</div>
            </div>
            
            <div className="inclusion-bar">
              <div className="inclusion-label">
                <span className="hindi-text">अनुसूचित जनजाति</span> ST
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill st"
                  style={{ width: `${(latestData.st_persondays / latestData.person_days_generated) * 100}%` }}
                >
                  {formatPercentage((latestData.st_persondays / latestData.person_days_generated) * 100)}
                </div>
              </div>
              <div className="inclusion-value">{formatIndianNumber(latestData.st_persondays)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DistrictDetailPage

