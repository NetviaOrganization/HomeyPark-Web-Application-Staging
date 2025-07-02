export type Parking = {
  id: 0
  profileId: number
  width: number
  length: number
  height: number
  price: number
  phone: string
  space: string
  description: string
  location: Location
}

export type UpdateParkingDto = Omit<Parking, 'id' | 'profileId'>
export type CreateParkingDto = Omit<Parking, 'id'>

interface Location {
  address: string
  numDirection: string
  street: string
  district: string
  city: string
  latitude: number
  longitude: number
}
