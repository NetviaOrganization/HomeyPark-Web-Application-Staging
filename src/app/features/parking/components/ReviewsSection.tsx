import { Button } from 'primereact/button'
import { useReviews } from '../hooks/useReviews'
import ReviewsList from './ReviewsList'
import { FormEvent, useEffect, useState } from 'react'
import { InputTextarea } from 'primereact/inputtextarea'
import { Rating } from 'primereact/rating'
import { Review } from '../model/review'
import { useAuthState } from '@/shared/hooks/useAuth'
import { useAppStore } from '@/app/store/store'
import ParkingService from '../services/parkingService'

interface Props {
  parkingId: number
}

const parkingService = new ParkingService()

const ReviewsSection = ({ parkingId }: Props) => {
  const { reviews, loading, error, averageRating, totalReviews, ratingDistribution } =
    useReviews(parkingId)

  const profile = useAppStore((state) => state.profileData.profile)
  const { email } = useAuthState()

  const [showForm, setShowForm] = useState(false)
  const [commentValue, setCommentValue] = useState('')
  const [ratingValue, setRatingValue] = useState(0)
  const [uiReviews, setUiReviews] = useState(reviews)
  const { profileId } = useAuthState()

  useEffect(() => {
    setUiReviews(reviews)
  }, [reviews])

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Reseñas</h3>
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
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Reseñas</h3>
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
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Reseñas</h3>
        <div className="text-center py-8 text-gray-500">
          <i className="pi pi-comment text-4xl mb-4 block" />
          <p>Aún no hay reseñas para este garaje</p>
          <p className="text-sm text-gray-400 mt-2">¡Sé el primero en dejar una!</p>
        </div>
      </div>
    )
  }

  const handleToggleForm = () => setShowForm((prev) => !prev)

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault()

    if (commentValue.trim() === '' || ratingValue <= 0) {
      return
    }

    try {
      await parkingService.publishReview(ratingValue, commentValue, parkingId, +profileId!)

      const review: Review = {
        id: Date.now(), // Simulación de ID único
        parkingId,
        userId: +profileId!,
        comment: commentValue,
        rating: ratingValue,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userInfo: {
          firstName: profile?.firstName || 'Anónimo',
          lastName: profile?.lastName || '',
          email: email!,
          userId: +profileId!,
        },
      }
      setUiReviews((prev) => [...prev, review])
      setCommentValue('')
      setRatingValue(0)
      setShowForm(false)
    } catch (err) {
      console.error('Error al publicar la reseña:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Resumen de calificaciones */}
      {/* Lista de reseñas */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800">Comentarios de usuarios</h4>
          <Button
            label={showForm ? 'Cerrar' : 'Comentar'}
            severity={showForm ? 'danger' : 'success'}
            onClick={handleToggleForm}
          />
        </div>

        {showForm && (
          <form className="mb-4" onSubmit={handleSubmitReview}>
            <div className="flex items-center gap-4 justify-between mb-2">
              <p>Califique y deje su comentario</p>
              <Rating
                value={ratingValue}
                onChange={(e) => setRatingValue(e.value!)}
                cancel={false}
              />
            </div>
            <InputTextarea
              className="w-full mb-2"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              autoResize
              rows={3}
            />
            <div className="flex justify-end">
              <Button label="Guardar" />
            </div>
          </form>
        )}
        <ReviewsList reviews={uiReviews} />
      </div>
    </div>
  )
}

export default ReviewsSection
