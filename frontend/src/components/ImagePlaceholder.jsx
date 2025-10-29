import './ImagePlaceholder.css'

function ImagePlaceholder({ type = 'rural', alt = 'MGNREGA', className = '' }) {
  const images = {
    rural: '/rural-india.svg',
    employment: '/employment.svg',
    infrastructure: '/infrastructure.svg',
    empowerment: '/empowerment.svg',
    chart: '/chart-icon.svg',
    worker: '/worker.svg',
    flag: '/india-flag.svg'
  }
  
  return (
    <div className={`image-placeholder ${className}`}>
      <img 
        src={images[type] || images.rural} 
        alt={alt}
        loading="lazy"
        className="placeholder-image"
      />
    </div>
  )
}

export default ImagePlaceholder


