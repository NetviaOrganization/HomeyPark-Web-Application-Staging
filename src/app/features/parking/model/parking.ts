export type Parking = {
  id: number
  profileId: number
  width: number
  length: number
  height: number
  price: number
  phone: string
  space: number
  description: string
  location: Location
  schedules: Schedule[]
  userInfo: UserInfo
  averageRating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export type UpdateParkingDto = Omit<Parking, 'id' | 'profileId' | 'userInfo' | 'averageRating' | 'reviewCount' | 'createdAt' | 'updatedAt'>
export type CreateParkingDto = Omit<Parking, 'id' | 'userInfo' | 'averageRating' | 'reviewCount' | 'createdAt' | 'updatedAt'>

interface Location {
  id: number
  parkingId: number
  address: string
  numDirection: string
  street: string
  district: string
  city: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
}

interface Schedule {
  id: number
  parkingId: number
  day: string
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

export interface UserInfo {
  userId: number
  email: string
  verifiedEmail: boolean
}
