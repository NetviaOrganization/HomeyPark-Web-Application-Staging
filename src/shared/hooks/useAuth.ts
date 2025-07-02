import { useAppStore } from '@/app/store/store'

export const useAuthState = () => {
  const profileId = useAppStore((state) => state.auth.profileId)
  const token = useAppStore((state) => state.auth.token)
  const email = useAppStore((state) => state.auth.email)

  return { profileId, token, email }
}
