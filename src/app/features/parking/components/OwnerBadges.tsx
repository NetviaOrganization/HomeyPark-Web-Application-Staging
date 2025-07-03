import { FC } from 'react'
import { UserInfo } from '../model/parking'

interface Props {
  userInfo: UserInfo
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
}

interface Badge {
  icon: string
  label: string
  color: string
  bgColor: string
  borderColor: string
}

const OwnerBadges: FC<Props> = ({ userInfo, size = 'medium', showLabel = false }) => {
  const badges: Badge[] = []

  // Badge para email verificado o no verificado
  if (userInfo.verifiedEmail) {
    badges.push({
      icon: 'pi pi-verified',
      label: 'Email Verificado',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    })
    
    // Badge para propietario confiable (solo si tiene email verificado)
    badges.push({
      icon: 'pi pi-shield',
      label: 'Propietario Confiable',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    })
  } else {
    // Badge de advertencia para email no verificado
    badges.push({
      icon: 'pi pi-exclamation-triangle',
      label: 'Email No Verificado',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300'
    })
  }

  // Badge para respuesta rápida (se puede agregar cuando tengamos estadísticas)
  // if (userInfo.fastResponse) {
  //   badges.push({
  //     icon: 'pi pi-clock',
  //     label: 'Respuesta Rápida',
  //     color: 'text-orange-600',
  //     bgColor: 'bg-orange-50',
  //     borderColor: 'border-orange-200'
  //   })
  // }

  if (badges.length === 0) return null

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-2.5 py-1.5',
    large: 'text-base px-3 py-2'
  }

  const iconSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge, index) => (
        <div
          key={index}
          className={`
            inline-flex items-center gap-1 rounded-full border font-medium
            ${badge.color} ${badge.bgColor} ${badge.borderColor}
            ${sizeClasses[size]}
          `}
          title={badge.label}
        >
          <i className={`${badge.icon} ${iconSizeClasses[size]}`} />
          {showLabel && (
            <span>{badge.label}</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default OwnerBadges
