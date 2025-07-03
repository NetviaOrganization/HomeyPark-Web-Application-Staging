import { useReviews } from '../hooks/useReviews'
import ParkingRating from './ParkingRating'
import RatingDistribution from './RatingDistribution'
import ReviewsList from './ReviewsList'

interface Props {
  parkingId: number
}

const ReviewsSection = ({ parkingId }: Props) => {
  const { 
    reviews, 
    loading, 
    error, 
    averageRating, 
    totalReviews, 
    ratingDistribution 
  } = useReviews(parkingId)

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Reseñas
        </h3>
        <div className="flex items-center justify-center py-8">
          <i className="pi pi-spin pi-spinner text-2xl text-gray-400" />
          <span className="ml-2 text-gray-600">Cargando reseñas...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Reseñas
        </h3>
        <div className="text-center py-8 text-gray-500">
          <i className="pi pi-exclamation-triangle text-4xl mb-4 block text-red-400" />
          <p>Error al cargar las reseñas</p>
          <p className="text-sm text-gray-400 mt-2">Inténtalo de nuevo más tarde</p>
        </div>
      </div>
    )
  }

  if (totalReviews === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Reseñas
        </h3>
        <div className="text-center py-8 text-gray-500">
          <i className="pi pi-comment text-4xl mb-4 block" />
          <p>Aún no hay reseñas para este garaje</p>
          <p className="text-sm text-gray-400 mt-2">¡Sé el primero en dejar una!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumen de calificaciones */}
      {/* Lista de reseñas */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Comentarios de usuarios
        </h4>
        <ReviewsList reviews={reviews} />
      </div>
    </div>
  )
}

export default ReviewsSection
