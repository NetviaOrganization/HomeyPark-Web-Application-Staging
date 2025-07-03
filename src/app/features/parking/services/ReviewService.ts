import BaseService from '@/shared/services/BaseService'
import { Review, ReviewsResponse, CreateReviewDto } from '../model/review'
import OptimizedProfileService from '@/app/features/profile/services/OptimizedProfileService'

class ReviewService extends BaseService {
  private profileService = new OptimizedProfileService()

  public async getReviewsByParkingId(parkingId: number): Promise<ReviewsResponse> {
    try {
      const response = await this.http.get<Review[]>(`${this.baseUrl}/reviews?parkingId=${parkingId}`)
      const reviews = response.data
      
      // Enriquecer reviews con información del usuario
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          try {
            const profile = await this.profileService.getProfileByUserId(review.userId)
            return {
              ...review,
              userInfo: {
                userId: profile.userId,
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: '' // No exponemos el email por privacidad
              }
            }
          } catch (error) {
            console.warn(`Could not load profile for user ${review.userId}:`, error)
            // Retornar review sin información del usuario si falla
            return review
          }
        })
      )
      
      // Calcular estadísticas de las reseñas
      const totalReviews = enrichedReviews.length
      const averageRating = totalReviews > 0 
        ? enrichedReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0

      // Calcular distribución de calificaciones
      const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      enrichedReviews.forEach(review => {
        const rating = Math.floor(review.rating)
        if (rating >= 1 && rating <= 5) {
          ratingDistribution[rating]++
        }
      })

      return {
        reviews: enrichedReviews,
        averageRating,
        totalReviews,
        ratingDistribution
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
  }

  public async createReview(reviewData: CreateReviewDto): Promise<Review> {
    try {
      const response = await this.http.post<Review>(`${this.baseUrl}/reviews`, reviewData)
      return response.data
    } catch (error) {
      console.error('Error creating review:', error)
      throw error
    }
  }

  public async updateReview(reviewId: number, reviewData: Partial<CreateReviewDto>): Promise<Review> {
    try {
      const response = await this.http.put<Review>(`${this.baseUrl}/reviews/${reviewId}`, reviewData)
      return response.data
    } catch (error) {
      console.error('Error updating review:', error)
      throw error
    }
  }

  public async deleteReview(reviewId: number): Promise<void> {
    try {
      await this.http.delete(`${this.baseUrl}/reviews/${reviewId}`)
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  }
}

export default ReviewService
