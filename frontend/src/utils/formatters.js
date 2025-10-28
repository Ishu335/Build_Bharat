// Format large numbers in Indian numbering system
export const formatIndianNumber = (num) => {
  if (!num && num !== 0) return '-'
  
  const absNum = Math.abs(num)
  
  if (absNum >= 10000000) {
    return (num / 10000000).toFixed(2) + ' Cr'
  } else if (absNum >= 100000) {
    return (num / 100000).toFixed(2) + ' L'
  } else if (absNum >= 1000) {
    return (num / 1000).toFixed(2) + ' K'
  }
  
  return num.toLocaleString('en-IN')
}

// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '-'
  return '₹' + formatIndianNumber(amount)
}

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '-'
  return value.toFixed(decimals) + '%'
}

// Format month from YYYY-MM to readable format
export const formatMonth = (monthStr) => {
  if (!monthStr) return '-'
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  const monthsHindi = [
    'जन', 'फर', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुल', 'अग', 'सित', 'अक्ट', 'नव', 'दिस'
  ]
  
  const [year, month] = monthStr.split('-')
  const monthIndex = parseInt(month) - 1
  
  return `${months[monthIndex]} ${year}`
}

// Get trend indicator
export const getTrend = (current, previous) => {
  if (!current || !previous) return 'neutral'
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return 'neutral'
}

// Calculate percentage change
export const getPercentageChange = (current, previous) => {
  if (!current || !previous || previous === 0) return null
  return ((current - previous) / previous) * 100
}

// Get performance rating
export const getPerformanceRating = (percentage) => {
  if (!percentage) return 'unknown'
  if (percentage >= 80) return 'excellent'
  if (percentage >= 60) return 'good'
  if (percentage >= 40) return 'average'
  return 'poor'
}

// Get rating color
export const getRatingColor = (rating) => {
  const colors = {
    excellent: '#28A745',
    good: '#17A2B8',
    average: '#FFC107',
    poor: '#DC3545',
    unknown: '#6C757D'
  }
  return colors[rating] || colors.unknown
}

// Bilingual labels
export const bilingualLabels = {
  households: { en: 'Households', hi: 'परिवार' },
  personDays: { en: 'Person Days', hi: 'व्यक्ति दिवस' },
  works: { en: 'Works', hi: 'कार्य' },
  expenditure: { en: 'Expenditure', hi: 'व्यय' },
  completion: { en: 'Completion Rate', hi: 'पूर्णता दर' },
  district: { en: 'District', hi: 'जिला' },
  month: { en: 'Month', hi: 'माह' },
  select: { en: 'Select', hi: 'चुनें' },
  loading: { en: 'Loading...', hi: 'लोड हो रहा है...' },
  noData: { en: 'No data available', hi: 'कोई डेटा उपलब्ध नहीं' },
  error: { en: 'Error loading data', hi: 'डेटा लोड करने में त्रुटि' },
}

