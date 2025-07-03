import { useState, useEffect } from 'react'
import { Profile } from '@/app/features/profile/model/profile'
import OptimizedProfileService from '@/app/features/profile/services/OptimizedProfileService'

const profileService = new OptimizedProfileService()

export function useOwnerProfile(userId: number) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) return

    let cancelled = false

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const profileData = await profileService.getProfileByUserId(userId)
        
        if (!cancelled) {
          setProfile(profileData)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error)
          setProfile(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      cancelled = true
    }
  }, [userId])

  return { profile, loading, error }
}
