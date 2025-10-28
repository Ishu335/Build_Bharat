import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatIndianNumber, formatMonth } from '../utils/formatters'
import './PerformanceChart.css'

function PerformanceChart({ data, type = 'line', dataKey, title, titleHindi, color = 'var(--primary)' }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">
            <span className="hindi-text">{titleHindi}</span> • {title}
          </h3>
        </div>
        <div className="chart-empty">
          <p className="hindi-text">कोई डेटा उपलब्ध नहीं</p>
          <p>No data available</p>
        </div>
      </div>
    )
  }
  
  // Prepare data for charts
  const chartData = data.map(item => ({
    month: formatMonth(item.month),
    value: item[dataKey] || 0,
    fullMonth: item.month
  })).reverse() // Show oldest to newest
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.month}</p>
          <p className="tooltip-value" style={{ color }}>
            {formatIndianNumber(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }
  
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">
          <span className="hindi-text">{titleHindi}</span> • {title}
        </h3>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          {type === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                style={{ fontSize: '0.875rem' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '0.875rem' }}
                tickFormatter={(value) => formatIndianNumber(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={3}
                dot={{ fill: color, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                style={{ fontSize: '0.875rem' }}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '0.875rem' }}
                tickFormatter={(value) => formatIndianNumber(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PerformanceChart

