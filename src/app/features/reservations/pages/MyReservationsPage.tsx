import BasePage from '@/shared/page/BasePage'
import ReservationTabs from '../components/ReservationTabs'
import { useEffect, useState } from 'react'
import ReservationService from '../services/reservationService'
import { useAppStore } from '@/app/store/store'
import { Reservation } from '../model/reservation'
import ReservationSummary from '../components/ReservationSummary'
import { useNavigate } from 'react-router'

const reservationService = new ReservationService()

const MyReservationsPage = () => {
  const guestId = useAppStore((state) => state.auth.profileId)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!guestId) return

    const fetchReservations = async () => {
      try {
        const reservations = await reservationService.getReservationsByGuestId(guestId)
        setReservations(reservations)
      } catch (err) {
        console.error('Error fetching reservations:', err)
      }
    }

    fetchReservations()
  }, [guestId])

  const inProgressReservations = reservations.filter(
    (reservation) => reservation.status === 'InProgress'
  )

  const incomingReservations = reservations.filter(
    (reservation) => reservation.status === 'Approved' || reservation.status === 'Pending'
  )

  const pastReservations = reservations.filter(
    (reservation) => reservation.status === 'Completed' || reservation.status === 'Cancelled'
  )

  const renderReservationSummaries = (reservations: Reservation[]) => {
    if (reservations.length === 0) {
      return <p className="text-center text-gray-500">No hay reservas para mostrar</p>
    }

    return (
      <div className="grid grid-cols-3 gap-4">
        {reservations.map((reservation) => (
          <ReservationSummary
            key={reservation.id}
            reservation={reservation}
            onClickCard={() => {
              navigate(`/reservations/${reservation.id}`)
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <BasePage>
      <ReservationTabs
        tabHeaders={['En progreso', 'Proximo', 'Pasado']}
        tabContents={[
          renderReservationSummaries(inProgressReservations),
          renderReservationSummaries(incomingReservations),
          renderReservationSummaries(pastReservations),
        ]}
      />
    </BasePage>
  )
}

export default MyReservationsPage
