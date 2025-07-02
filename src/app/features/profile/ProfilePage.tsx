import Title from '@/shared/components/Title'
import BasePage from '@/shared/page/BasePage'
import ProfileIcon from './icons/ProfileIcon'
import LoadingIcon from '@/assets/icons/LoadingIcon'
import { Link } from 'react-router'
import { useMyParkings } from '../parking/hooks/useMyParkings'
import { useAppStore } from '@/app/store/store'
import { useAuthState } from '@/shared/hooks/useAuth'

const ProfilePage = () => {
  // const { profile, loading, authUser } = useAuth()
  const { profile, loading } = useAppStore((state) => state.profileData)
  const { email } = useAuthState()
  const { parkingList } = useMyParkings()

  return (
    <BasePage>
      <Title>Mi perfil</Title>

      <section className="mt-8 h-full">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center shrink-0">
            <LoadingIcon className="text-[#10b981] animate-spin" width={120} height={120} />
          </div>
        ) : profile ? (
          <div className="flex items-center gap-8 border border-solid border-[#e5e7eb] rounded-lg py-4 px-8">
            <div className="flex bg-gray-100 aspect-square shrink-0 w-32 h-32 rounded-full overflow-hidden relative">
              <ProfileIcon className="h-full w-full" />
            </div>
            <div className="flex gap-2 justify-between w-full">
              <div>
                <p className="text-xl font-bold">{email}</p>
                <p className="text-xl">
                  {profile.firstName} {profile.lastName}
                </p>
                <Link to="/profile/edit" className="text-base text-[#10b981] hover:underline">
                  Editar perfil
                </Link>
              </div>
              <div className="border-0 border-l border-solid border-[#e5e7eb] pl-6">
                <p className="font-semibold">Estacionamientos registrados</p>
                {parkingList.length && <p>{parkingList.length}</p>}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </BasePage>
  )
}

export default ProfilePage
