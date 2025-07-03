import { FC } from 'react'
import { Parking } from '../model/parking'
import OwnerInfo from './OwnerInfo'
import ParkingRating from './ParkingRating'

const ParkingSummary: FC<Props> = ({ parking, onClick }) => {
  return (
    <div className="border rounded-md border-slate-200 p-4 cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-semibold">
          {parking.location.address} {parking.location.numDirection}
        </p>
        <OwnerInfo 
          userInfo={parking.userInfo} 
          size="small" 
          showName={false}
          showBadges={true}
        />
      </div>
      <p className="text-sm mb-2">
        {parking.location.street}, {parking.location.city}
      </p>
      <ParkingRating 
        averageRating={parking.averageRating}
        reviewCount={parking.reviewCount}
        size="small"
        showCount={false}
      />
    </div>
  )
}

interface Props {
  parking: Parking
  onClick?: () => void
}

export default ParkingSummary
