import { FC, useEffect, useState } from 'react'
import { Reservation } from '../model/reservation'
import { Parking } from '../../parking/model/parking'
import { Nullable } from 'primereact/ts-helpers'
import ParkingService from '../../parking/services/parkingService'
import { Card } from 'primereact/card'
import BadgeStatus from './BadgeStatus'

const parkingService = new ParkingService()

const ReservationSummary: FC<Props> = ({ reservation, onClickCard, actions }) => {
  const [parking, setParking] = useState<Nullable<Parking>>(null)

  useEffect(() => {
    parkingService
      .getById(reservation.parkingId)
      .then((parking) => {
        setParking(parking)
      })
      .catch((err) => {
        console.error('Error fetching parking details:', err)
      })
  }, [reservation.parkingId])

  if (!parking) return null

  const getBadgeType = () => {
    switch (reservation.status) {
      case 'Pending':
        return 'pending'
      case 'InProgress':
        return 'in-progress'
      case 'Approved':
        return 'approved'
      case 'Completed':
        return 'completed'
      case 'Cancelled':
        return 'cancelled'
      default:
        return 'pending'
    }
  }

  return (
    <Card className="shadow-md *:*:p-0 cursor-pointer" onClick={onClickCard}>
      <div className="p-0">
        <div className="flex items-start justify-between">
          <div>
            <h5 className="font-medium">
              {parking.location.address} {parking.location.numDirection}
            </h5>
            <p className="text-sm">#{reservation.id.toString().padStart(9, '0')}</p>
          </div>
          <BadgeStatus type={getBadgeType()} />
        </div>

        <section className="mt-2 bg-slate-100 rounded-lg py-2 px-4 text-sm flex flex-col gap-1">
          <span className="font-medium">Desde {reservation.startTime}</span>
          <span className="font-medium">Hasta {reservation.endTime}</span>
        </section>

        {actions && <section className="mt-4">{actions}</section>}
      </div>
    </Card>
  )
}

interface Props {
  reservation: Reservation
  onClickCard?: () => void
  actions?: React.ReactNode
}

export default ReservationSummary
