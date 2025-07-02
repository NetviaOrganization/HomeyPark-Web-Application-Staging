import BaseService from '@/shared/services/BaseService'
import { CreateVehicleDTO, UpdateVehicleDTO, Vehicle } from '../model/vehicle'

export default class VehicleService extends BaseService<Vehicle> {
  constructor() {
    super()
    this.baseUrl = `${this.baseUrl}/vehicles`
  }

  public async getAllByUserId(userId: string | number) {
    try {
      const response = await this.http.get<Vehicle[]>(`${this.baseUrl}/user/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }

  public async deleteById(id: string | number) {
    try {
      const response = await this.http.delete(`${this.baseUrl}/delete/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      throw error
    }
  }

  public async editById(id: string | number, data: UpdateVehicleDTO) {
    try {
      const response = await this.http.put<Vehicle>(`${this.baseUrl}/update/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error editing vehicle:', error)
      throw error
    }
  }

  public async create(data: CreateVehicleDTO) {
    try {
      const response = await this.http.post<Vehicle>(`${this.baseUrl}/create`, data)
      return response.data
    } catch (error) {
      console.error('Error creating vehicle:', error)
      throw error
    }
  }
}
