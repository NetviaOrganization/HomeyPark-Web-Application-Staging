import Title from '@/shared/components/Title'
import BasePage from '@/shared/page/BasePage'
import { Calendar } from 'primereact/calendar'
import { Card } from 'primereact/card'
import { Nullable } from 'primereact/ts-helpers'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Parking } from '../../parking/model/parking'
import ReservationService from '../services/reservationService'
import ParkingService from '../../parking/services/parkingService'
import { useVehicles } from '../../vehicles/hooks/useVehicles'
import { Dropdown } from 'primereact/dropdown'
import { Vehicle } from '../../vehicles/model/vehicle'
import { FileUpload } from 'primereact/fileupload'
import { Button } from 'primereact/button'
import { useAuthState } from '@/shared/hooks/useAuth'
import { usePromise } from '@/shared/hooks/usePromise'

const reservationService = new ReservationService()
const parkingService = new ParkingService()

const ReservationParkingPage = () => {
  const parkingId = useParams().parkingId!
  const { profileId } = useAuthState()

  const [parking, setParking] = useState<Nullable<Parking>>(null)
  const fileRef = useRef<Nullable<File>>(null)
  const { vehicles } = useVehicles()
  const [selectedVehicle, setSelectedVehicle] = useState<Nullable<Vehicle>>(null)

  const [date, setDate] = useState<Nullable<Date>>(null)
  const [startTime, setStartTime] = useState<Nullable<Date>>(null)
  const [endTime, setEndTime] = useState<Nullable<Date>>(null)
  const navigate = useNavigate()

  const { data: reservations } = usePromise(
    () =>
      profileId ? reservationService.getReservationsByGuestId(profileId) : Promise.resolve([]),
    [profileId]
  )

  const totalReservations = reservations ? reservations.length : 0

  const applyDiscount = totalReservations % 10 === 0 && totalReservations > 0
  const hoursRegistered =
    startTime && endTime
      ? Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))
      : 0

  const toLocalTimSTring = (date: Date) => {
    const d = date instanceof Date ? date : new Date(date)
    // Pad to two digits
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  const saveToLocalStorage = (reservation: any) => {
    const key = 'recent_reservations'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    const updated = [reservation, ...existing].slice(0, 5)
    localStorage.setItem(key, JSON.stringify(updated))
  }

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const parkingData = await parkingService.getById(parkingId)
        setParking(parkingData)
      } catch (error) {
        console.error('Error fetching parking:', error)
      }
    }

    fetchParking()
  }, [parkingId])

  useEffect(() => {
    if (!parkingId || !vehicles.length) return

    const raw = localStorage.getItem('reservation_prefill')
    if (raw) {
      try {
        const prefill = JSON.parse(raw)

        if (prefill.parkingId?.toString() !== parkingId) return

        if (prefill.date) setDate(new Date(prefill.date))
        if (prefill.startTime) setStartTime(new Date(prefill.startTime))
        if (prefill.endTime) setEndTime(new Date(prefill.endTime))

        if (vehicles && prefill.vehicleId) {
          const found = vehicles.find((v) => v.id === prefill.vehicleId)
          if (found) setSelectedVehicle(found)
        }

        // Limpia solo si todo está ok
        localStorage.removeItem('reservation_prefill')
      } catch (e) {
        console.warn('Error leyendo prefill:', e)
      }
    }
  }, [parkingId, vehicles])

  const handleReserve = async () => {
    if (!fileRef.current || !selectedVehicle || !date || !startTime || !endTime) return

    try {
      const hoursRegistered = Math.ceil(
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
      )

      console.log('Hours registered:', parking?.id)

      const dto = {
        endTime: toLocalTimSTring(endTime),
        startTime: toLocalTimSTring(startTime),
        guestId: +profileId!,
        hostId: +parking!.profileId!,
        hoursRegistered,
        parkingId: parking!.id,
        vehicleId: +selectedVehicle.id,
        reservationDate: date.toISOString().split('T')[0],
        totalFare: parking?.price
          ? hoursRegistered * (parking.price * (applyDiscount ? 0.8 : 1))
          : 0,
      }
      console.log('Reservation DTO:', dto)

      if ((totalReservations % 10) - 1 === 9) {
        await reservationService.activateDiscountForNext(profileId!)
      }

      const response = await reservationService.createReservation(dto, fileRef.current)

      console.log('Reservation uploaded successfully:', response)

      saveToLocalStorage({
        parkingId: parking!.id,
        street: `${parking?.location.address} ${parking?.location.numDirection}`,
        date: date?.toISOString(),
        startTime: startTime?.toISOString(),
        endTime: endTime?.toISOString(),
        vehicleId: selectedVehicle.id,
        total: hoursRegistered * (parking!.price * (applyDiscount ? 0.8 : 1)),
      })
      navigate('/find-your-parking')
    } catch (err) {
      console.error('Error uploading reservation:', err)
    }
  }

  return (
    <BasePage>
      <Title>Checkout</Title>

      {/* Layout: form en dos columnas en md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Columna Izquierda: Horario */}
        <Card className="shadow-md rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <Title level="h4">Horario</Title>
          </div>
          <div className="px-6 py-4 flex flex-col gap-4">
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              placeholder="Fecha de reserva"
              showIcon
              className="w-full"
              dateFormat="yy-mm-dd"
            />

            <div className="flex gap-4">
              <Calendar
                value={startTime}
                onChange={(e) => setStartTime(e.value)}
                timeOnly
                placeholder="Hora inicio"
                showIcon
                className="w-1/2"
              />
              <Calendar
                value={endTime}
                onChange={(e) => setEndTime(e.value)}
                timeOnly
                placeholder="Hora fin"
                showIcon
                className="w-1/2"
                minDate={startTime ? new Date(startTime.getTime() + 30 * 60000) : undefined}
              />
            </div>
          </div>
        </Card>

        {/* Columna Derecha: Vehículo y Comprobante */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-md rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <Title level="h4">Vehículo</Title>
            </div>
            <div className="px-6 py-4">
              <Dropdown
                value={selectedVehicle}
                options={vehicles}
                optionLabel="licensePlate"
                onChange={(e) => setSelectedVehicle(e.value)}
                placeholder="Selecciona un vehículo"
                className="w-full"
                valueTemplate={(opt) =>
                  opt ? (
                    <span className="font-semibold">{opt.licensePlate}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )
                }
                itemTemplate={(opt) => (
                  <div className="flex justify-between">
                    <span>{opt.licensePlate}</span>
                    <small className="text-gray-500">
                      {opt.brand} {opt.model}
                    </small>
                  </div>
                )}
              />
            </div>
          </Card>

          <Card className="shadow-md rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <Title level="h4">Comprobante</Title>
            </div>
            <div className="px-6 py-4">
              <FileUpload
                mode="advanced"
                accept="image/*"
                maxFileSize={1000000}
                chooseLabel="Elegir imagen"
                customUpload
                uploadHandler={() => {}}
                onSelect={(e) => {
                  fileRef.current = e.files[0]
                }}
                onClear={() => {
                  fileRef.current = null
                }}
                emptyTemplate={<p className="m-0 text-gray-500">Arrastra o haz clic para subir</p>}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Precio estimado */}
      {/* Precio estimado */}
      {date && startTime && endTime && parking && (
        <div className="mt-4 px-6 py-4 bg-gray-50 border border-gray-200 rounded-md flex items-baseline gap-2">
          <span className="font-semibold">Precio estimado:</span>
          {/* Precio normal (tachado si hay descuento) */}
          <span className={applyDiscount ? 'line-through text-gray-500' : 'font-semibold'}>
            {(hoursRegistered * parking.price).toFixed(2)} USD
          </span>
          {/* Precio con descuento */}
          {applyDiscount && (
            <span className="font-semibold text-green-600">
              {(hoursRegistered * parking.price * 0.8).toFixed(2)} USD
            </span>
          )}
        </div>
      )}

      <div className="flex justify-end items-center mt-6 gap-4">
        <Button label="Cancelar" severity="danger" onClick={() => navigate(-1)} />
        <Button label="Reservar" onClick={handleReserve} />
      </div>
    </BasePage>
  )
}

export default ReservationParkingPage
