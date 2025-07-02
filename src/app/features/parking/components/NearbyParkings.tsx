import { usePromise } from '@/shared/hooks/usePromise'
import ParkingService from '../services/parkingService'
import { FC } from 'react'
import ParkingSummary from './ParkingSummary'
import { Parking } from '../model/parking'

const parkingService = new ParkingService()

const NearbyParkings: FC<Props> = ({ lat, lng, onClick }) => {
  const { data, loading, error } = usePromise(() => parkingService.getNearbyByLocation(lat, lng))

  if (loading || error || !data?.length) return null

  return (
    <>
      <div className="absolute z-10 bg-white rounded-lg shadow-lg left-4 right-4 bottom-4 p-6 grid grid-cols-4 gap-4">
        {data.slice(0, 4).map((parking) => (
          <ParkingSummary key={parking.id} parking={parking} onClick={() => onClick?.(parking)} />
        ))}
      </div>
    </>
  )
}

interface Props {
  lat: number
  lng: number
  onClick?: (parking: Parking) => void
}

export default NearbyParkings
