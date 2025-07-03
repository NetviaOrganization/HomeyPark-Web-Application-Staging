export interface Review {
  id: number
  rating: number
  comment: string
  parkingId: number
  userId: number
  createdAt: string
  updatedAt: string
  userInfo?: {
    userId: number
    firstName: string
    lastName: string
    email: string
  }
}

export interface ReviewsResponse {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    [key: number]: number
  }
}

export interface CreateReviewDto {
  parkingId: number
  rating: number
  comment: string
}
