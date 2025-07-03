import { FC } from 'react'
import { Review } from '../model/review'
import { formatDate } from '@/shared/utils/date'

interface Props {
  reviews: Review[]
  loading?: boolean
}

const ReviewsList: FC<Props> = ({ reviews, loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <i className="pi pi-comment text-4xl mb-4 block" />
        <p>No hay reseñas disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  )
}

interface ReviewItemProps {
  review: Review
}

const ReviewItem: FC<ReviewItemProps> = ({ review }) => {
  const getUserInitials = (review: Review) => {
    if (review.userInfo?.firstName && review.userInfo?.lastName) {
      return `${review.userInfo.firstName[0]}${review.userInfo.lastName[0]}`.toUpperCase()
    }
    return `U${review.userId.toString().slice(-1)}`
  }

  const getUserName = (review: Review) => {
    if (review.userInfo?.firstName && review.userInfo?.lastName) {
      return `${review.userInfo.firstName} ${review.userInfo.lastName}`
    }
    return `Usuario ${review.userId}`
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-start gap-4">
        {/* Avatar del usuario */}
        <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
          {getUserInitials(review)}
        </div>

        <div className="flex-1">
          {/* Header con nombre y fecha */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-800">
                {getUserName(review)}
              </h4>
              <p className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </p>
            </div>

            {/* Calificación */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <i 
                  key={i} 
                  className={`pi ${i < review.rating ? 'pi-star-fill text-yellow-400' : 'pi-star text-gray-300'} text-sm`} 
                />
              ))}
              <span className="ml-1 text-sm font-medium text-gray-600">
                {review.rating}.0
              </span>
            </div>
          </div>

          {/* Comentario */}
          {review.comment && (
            <p className="text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewsList
