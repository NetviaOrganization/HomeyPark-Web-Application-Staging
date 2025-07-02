import EmptyGarageIcon from '@/assets/icons/EmptyGarageIcon'
import { Link } from 'react-router'

const EmptyParkingList = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-green-50 flex items-center justify-center rounded-full p-8">
        <EmptyGarageIcon width={120} height={120} className="text-[#10b981]" />
      </div>
      <div className="text-center mt-4">
        <p className="text-lg font-medium">Ups, no tienes estacionamiento registrados</p>
        <Link to="/my-garages/create" className="text-[#10b981] hover:underline">
          ¿Quieres agregar uno?
        </Link>
      </div>
    </div>
  )
}

export default EmptyParkingList
