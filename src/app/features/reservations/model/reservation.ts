export interface Reservation {
  id: number
  status: string
  paymentReceiptUrl: string
  paymentReceiptDeleteUrl: string
  hoursRegistered: number
  totalFare: number
  reservationDate: string
  startTime: string
  endTime: string
  guestId: number
  hostId: number
  parkingId: number
  vehicleId: number
  createdAt: string
  updatedAt: string
}

export interface CreateReservationDto {
  hoursRegistered: number
  totalFare: number
  reservationDate: string
  startTime: string
  endTime: string
  guestId: number
  hostId: number
  parkingId: number
  vehicleId: number
}
