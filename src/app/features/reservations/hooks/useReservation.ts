import { useEffect, useState } from 'react'
import { Reservation } from '../model/reservation'
import { Nullable } from 'primereact/ts-helpers'
import { Parking } from '../../parking/model/parking'
import ParkingService from '../../parking/services/parkingService'
import ReservationService from '../services/reservationService'

const parkingService = new ParkingService()
const reservationService = new ReservationService()

const useReservation = (reservationId: number) => {
  const [reservation, setReservation] = useState<Nullable<Reservation>>(null)
  const [parking, setParking] = useState<Nullable<Parking>>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    reservationService
      .getById(reservationId)
      .then((reservation) => {
        setReservation(reservation)
        return parkingService.getById(reservation.parkingId)
      })
      .then((parking) => {
        setParking(parking)
      })
      .catch((err) => {
        console.error('Error fetching parking details:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [reservationId])

  return { reservation, parking, loading }
}

export default useReservation
