import Title from '@/shared/components/Title'
import BasePage from '@/shared/page/BasePage'
import { Calendar } from 'primereact/calendar'
import { Card } from 'primereact/card'
import { Nullable } from 'primereact/ts-helpers'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { Parking } from '../../parking/model/parking'
import ReservationService from '../services/reservationService'
import ParkingService from '../../parking/services/parkingService'
import { useVehicles } from '../../vehicles/hooks/useVehicles'
import { Dropdown } from 'primereact/dropdown'
import { Vehicle } from '../../vehicles/model/vehicle'
import { FileUpload } from 'primereact/fileupload'
import { Button } from 'primereact/button'
import { useAuthState } from '@/shared/hooks/useAuth'

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

  const toLocalTimSTring = (date: Date) => {
    const d = date instanceof Date ? date : new Date(date)
    // Pad to two digits
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
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
        totalFare: parking?.price ? hoursRegistered * parking.price : 0,
      }
      console.log('Reservation DTO:', dto)

      const response = await reservationService.createReservation(dto, fileRef.current)

      console.log('Reservation uploaded successfully:', response)
    } catch (err) {
      console.error('Error uploading reservation:', err)
    }
  }

  return (
    <BasePage>
      <Title>Checkout</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mt-8 flex flex-col gap-4">
          <Card
            className="shadow-md"
            header={
              <div className="px-6 py-4 border-b border-gray-200">
                <Title level="h4">Horario</Title>
              </div>
            }
          >
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-semibold">Fecha de reserva</label>
                <Calendar value={date} onChange={(e) => setDate(e.value)} />
              </div>
              <div className="flex gap-3 w-full">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Hora de inicio</label>
                  <Calendar value={startTime} onChange={(e) => setStartTime(e.value)} timeOnly />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Hora de cierre</label>
                  <Calendar
                    value={endTime}
                    onChange={(e) => setEndTime(e.value)}
                    timeOnly
                    minDate={startTime ? new Date(startTime.getTime() + 30 * 60 * 1000) : undefined}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card
            className="shadow-md"
            header={
              <div className="px-6 py-4 border-b border-gray-200">
                <Title level="h4">Vehículo</Title>
              </div>
            }
          >
            <Dropdown
              value={selectedVehicle}
              className="w-full h-12"
              options={vehicles}
              optionLabel="licensePlate"
              onChange={(e) => setSelectedVehicle(e.value)}
              valueTemplate={(option) => (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{option?.licensePlate}</span>
                  <span className="text-sm text-gray-500">
                    {option?.brand} {option?.model}
                  </span>
                </div>
              )}
              itemTemplate={(option) => (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{option.licensePlate}</span>
                  <span className="text-sm text-gray-500">
                    {option.brand} {option.model}
                  </span>
                </div>
              )}
            />
          </Card>

          <Card
            className="shadow-md"
            header={
              <div className="px-6 py-4 border-b border-gray-200">
                <Title level="h4">Comprobante</Title>
              </div>
            }
          >
            <FileUpload
              mode="basic"
              accept="image/*"
              onSelect={(e) => {
                const file: File = e.files[0]
                console.log('File selected:', file)
                fileRef.current = file
              }}
              onClear={() => {
                console.log('File cleared')
                fileRef.current = null
              }}
              // onUpload={onUpload}
            />
          </Card>
        </div>
      </div>

      <div className="flex justify-end items-center mt-6 gap-4">
        <Button label="Cancelar" severity="danger" />
        <Button label="Reservar" onClick={handleReserve} />
      </div>
    </BasePage>
  )
}

export default ReservationParkingPage
