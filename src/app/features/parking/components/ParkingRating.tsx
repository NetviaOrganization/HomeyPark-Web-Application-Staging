import { FC } from 'react'

interface Props {
  averageRating: number
  reviewCount: number
  size?: 'small' | 'medium' | 'large'
  showCount?: boolean
}

const ParkingRating: FC<Props> = ({ 
  averageRating, 
  reviewCount, 
  size = 'medium',
  showCount = true 
}) => {
  const maxStars = 5
  const rating = Math.max(0, Math.min(maxStars, averageRating)) // Clamp between 0 and 5
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0)

  const sizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  const starSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  // Si no hay reviews, mostrar mensaje apropiado
  if (reviewCount === 0) {
    return (
      <div className={`flex items-center gap-1 text-gray-400 ${sizeClasses[size]}`}>
        <div className="flex">
          {Array.from({ length: maxStars }, (_, i) => (
            <i key={i} className={`pi pi-star ${starSizeClasses[size]}`} />
          ))}
        </div>
        <span>Sin reseñas</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
      <div className="flex text-yellow-400">
        {/* Estrellas llenas */}
        {Array.from({ length: fullStars }, (_, i) => (
          <i key={`full-${i}`} className={`pi pi-star-fill ${starSizeClasses[size]}`} />
        ))}
        
        {/* Media estrella */}
        {hasHalfStar && (
          <i className={`pi pi-star-half-fill ${starSizeClasses[size]}`} />
        )}
        
        {/* Estrellas vacías */}
        {Array.from({ length: emptyStars }, (_, i) => (
          <i key={`empty-${i}`} className={`pi pi-star ${starSizeClasses[size]} text-gray-300`} />
        ))}
      </div>
      
      <span className="font-medium text-gray-700">
        {rating.toFixed(1)}
      </span>
      
      {showCount && (
        <span className="text-gray-500">
          ({reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'})
        </span>
      )}
    </div>
  )
}

export default ParkingRating
