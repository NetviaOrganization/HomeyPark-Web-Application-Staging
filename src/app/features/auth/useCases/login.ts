import AuthService from '@/app/features/auth/services/authService'
import { appStore } from '@/app/store/store'
import { jwtDecode } from 'jwt-decode'
import ProfileService from '../../profile/services/profileService'

const authService = new AuthService()
const profileService = new ProfileService()

export const login = async (email: string, password: string) => {
  const { setState: set } = appStore

  const { token } = await authService.login({ email, password })

  const userId = jwtDecode(token).sub

  console.log('Decoded user ID:', userId)

  if (!userId) {
    throw new Error('User ID not found in token')
  }

  set((state) => {
    state.auth.token = token
    state.auth.userId = userId
    state.auth.email = email
  })

  const profile = await profileService.getProfileByUserId(userId)

  if (!profile) {
    throw new Error('Profile not found for user ID')
  }

  set((state) => {
    state.auth.profileId = profile.id.toString()
    state.profileData.profile = profile
  })
}
