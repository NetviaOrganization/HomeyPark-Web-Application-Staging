import { useParams } from 'react-router'
import useReservation from '../hooks/useReservation'
import BasePage from '@/shared/page/BasePage'
import Title from '@/shared/components/Title'
import StreetView from '@/shared/components/StreetView'
import { Card } from 'primereact/card'
import { formatDate } from '@/shared/utils/date'
import { formatCurrency } from '@/shared/utils/money'

const ReservationDetailPage = () => {
  const { id } = useParams<'id'>()

  const { parking, reservation, loading } = useReservation(+id!)

  if (loading) {
    return <BasePage>Loading...</BasePage>
  }

  if (!reservation || !parking) {
    return <BasePage>Error: Reserva o aparcamiento no encontrado</BasePage>
  }

  console.log('Parking:', parking)
  console.log('Reservation:', reservation)

  return (
    <BasePage>
      <Title>Detalles de reserva</Title>

      <div className="relative mt-8 rounded-lg overflow-hidden">
        <StreetView
          className="w-full h-80"
          lat={+parking.location.latitude}
          lng={+parking.location.longitude}
          disableDefaultUI
          zoomControl={null}
          clickToGo={false}
        />
        <div className="bg-gradient-to-t from-black/60 to-black/10 absolute top-0 left-0 bottom-0 right-0 z-10 flex flex-col justify-end pointer-events-none">
          <div className="text-white p-6 *:pointer-events-auto w-fit">
            <h1 className="text-3xl font-semibold">
              {parking.location.address} {parking.location.numDirection}
            </h1>
            <p>
              <span>{parking.location.street}</span>, <span>{parking.location.city}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Card className="shadow-md w-full *:*:p-0">
          <Title level="h4">Horario</Title>
          <div className="mt-2">
            <p className="text-sm font-bold">Creado</p>
            <p className="text-sm">{formatDate(reservation.createdAt)}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold">
              Horario de reserva ({formatDate(reservation.reservationDate)})
            </p>
            <p className="text-sm">Desde: {reservation.startTime}</p>
            <p className="text-sm">Hasta: {reservation.endTime}</p>
          </div>
        </Card>
        <Card className="shadow-md w-full *:*:p-0">
          <Title level="h4">Información adicional</Title>
          <div className="mt-2">
            <p className="text-sm font-bold">Tarifa total</p>
            <p className="text-sm">{formatCurrency(reservation.totalFare)}</p>
          </div>
          <div className="mt-2">
            <div className="max-h-40 overflow-hidden flex">
              <img
                src={reservation.paymentReceiptUrl}
                className="object-contain w-full h-full max-h-[inherit]"
                alt=""
              />
            </div>
          </div>
        </Card>
      </div>
    </BasePage>
  )
}

export default ReservationDetailPage
