export interface SignUpDTO {
  email: string
  firstName: string
  lastName: string
  birthDate: string
  password: string
  roles: string[]
}

export interface SignUpResponse extends Omit<SignUpDTO, 'password'> {
  id: number
}

export interface LoginDTO {
  email: string
  password: string
}

export interface LoginResponse {
  id: number
  email: string
  token: string
}
