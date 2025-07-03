import { useState, useEffect } from 'react'
import { ReviewsResponse } from '../model/review'
import ReviewService from '../services/ReviewService'

const reviewService = new ReviewService()

export function useReviews(parkingId: number) {
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!parkingId) return

    let cancelled = false

    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await reviewService.getReviewsByParkingId(parkingId)
        
        if (!cancelled) {
          setReviewsData(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error)
          setReviewsData(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchReviews()

    return () => {
      cancelled = true
    }
  }, [parkingId])

  const refetch = async () => {
    if (!parkingId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await reviewService.getReviewsByParkingId(parkingId)
      setReviewsData(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { 
    reviewsData, 
    loading, 
    error, 
    refetch,
    reviews: reviewsData?.reviews || [],
    averageRating: reviewsData?.averageRating || 0,
    totalReviews: reviewsData?.totalReviews || 0,
    ratingDistribution: reviewsData?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  }
}
