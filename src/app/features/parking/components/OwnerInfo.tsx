import { FC } from 'react'
import { UserInfo } from '../model/parking'
import { useOwnerProfile } from '../hooks/useOwnerProfile'
import OwnerBadges from './OwnerBadges'

interface Props {
  userInfo: UserInfo
  size?: 'small' | 'medium' | 'large'
  showBadges?: boolean
  showName?: boolean
  layout?: 'horizontal' | 'vertical'
}

const OwnerInfo: FC<Props> = ({ 
  userInfo, 
  size = 'medium', 
  showBadges = true,
  showName = true,
  layout = 'horizontal'
}) => {
  const { profile, loading } = useOwnerProfile(userInfo.userId)

  if (layout === 'vertical') {
    return (
      <div className="flex flex-col gap-2">
        {showName && (
          <div className="flex flex-col">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            ) : profile ? (
              <>
                <span className={`font-semibold ${getSizeTextClass(size)}`}>
                  {profile.firstName} {profile.lastName}
                </span>
                <span className={`text-gray-500 ${getSizeSubtextClass(size)}`}>
                  Propietario
                </span>
              </>
            ) : (
              <span className={`text-gray-500 ${getSizeTextClass(size)}`}>
                Propietario verificado
              </span>
            )}
          </div>
        )}
        {showBadges && (
          <OwnerBadges userInfo={userInfo} size={size} />
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {showName && (
        <div className="flex flex-col">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ) : profile ? (
            <span className={`font-semibold ${getSizeTextClass(size)}`}>
              {profile.firstName} {profile.lastName}
            </span>
          ) : (
            <span className={`text-gray-500 ${getSizeTextClass(size)}`}>
              Propietario verificado
            </span>
          )}
        </div>
      )}
      {showBadges && (
        <OwnerBadges userInfo={userInfo} size={size} />
      )}
    </div>
  )
}

const getSizeTextClass = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small': return 'text-xs'
    case 'medium': return 'text-sm'
    case 'large': return 'text-base'
  }
}

const getSizeSubtextClass = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small': return 'text-xs'
    case 'medium': return 'text-xs'
    case 'large': return 'text-sm'
  }
}

export default OwnerInfo
