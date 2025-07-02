import { FC } from 'react'

const BadgeStatus: FC<Props> = ({ type }) => {
  const getBadgeLabel = () => {
    switch (type) {
      case 'pending':
        return 'Pendiente'
      case 'completed':
        return 'Completada'
      case 'cancelled':
        return 'Cancelada'
      case 'in-progress':
        return 'En progreso'
      case 'approved':
        return 'Aprobada'
      default:
        return ''
    }
  }

  const getBadgeColor = () => {
    switch (type) {
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'completed':
        return 'bg-green-500 text-white'
      case 'cancelled':
        return 'bg-red-500 text-white'
      case 'in-progress':
        return 'bg-blue-500 text-white'
      case 'approved':
        return 'bg-purple-500 text-white'
      default:
        return ''
    }
  }

  return <div className={`${getBadgeColor()} px-2 py-1 rounded-md`}>{getBadgeLabel()}</div>
}

interface Props {
  type: 'pending' | 'completed' | 'cancelled' | 'in-progress' | 'approved'
}

export default BadgeStatus
