export interface Vehicle {
  id: string
  licensePlate: string
  model: string
  brand: string
  profileId: number
}

export type UpdateVehicleDTO = Omit<Vehicle, 'id' | 'profileId'>

export type CreateVehicleDTO = Omit<Vehicle, 'id'>
