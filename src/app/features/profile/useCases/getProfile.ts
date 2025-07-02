import { appStore } from '@/app/store/store'
import ProfileService from '../services/profileService'

const profileService = new ProfileService()

export const getProfile = async () => {
  const { setState: set, getState: get } = appStore

  try {
    set((state) => {
      state.profileData.loading = true
    })

    const profileId = get().auth.profileId

    if (!profileId) return

    const profile = await profileService.getProfileById(profileId)

    set((state) => {
      state.profileData.profile = profile
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  } finally {
    set((state) => {
      state.profileData.loading = false
    })
  }
}
