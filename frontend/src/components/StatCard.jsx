import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import './StatCard.css'

function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  labelHindi, 
  trend, 
  trendValue,
  color = 'var(--primary)',
  suffix = ''
}) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={20} />
    if (trend === 'down') return <TrendingDown size={20} />
    return <Minus size={20} />
  }
  
  const getTrendClass = () => {
    if (trend === 'up') return 'trend-up'
    if (trend === 'down') return 'trend-down'
    return 'trend-neutral'
  }
  
  return (
    <div className="stat-card-modern" style={{ borderLeftColor: color }}>
      <div className="stat-header">
        {Icon && (
          <div className="stat-icon" style={{ backgroundColor: color + '20', color: color }}>
            <Icon size={24} />
          </div>
        )}
        <div className="stat-info">
          <div className="stat-label-bilingual">
            <span className="hindi-text">{labelHindi}</span>
            <span className="label-separator">•</span>
            <span>{label}</span>
          </div>
        </div>
      </div>
      
      <div className="stat-value-container">
        <div className="stat-value" style={{ color }}>
          {value}
          {suffix && <span className="stat-suffix">{suffix}</span>}
        </div>
        
        {trend && trendValue !== null && trendValue !== undefined && (
          <div className={`stat-trend ${getTrendClass()}`}>
            {getTrendIcon()}
            <span>{Math.abs(trendValue).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard

