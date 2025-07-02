export interface Profile {
  id: number
  name: string
  lastName: string
  address: string
  userId: number
}

export interface CreateProfileDTO {
  name: string
  lastName: string
  address: string
  userId: number
}
