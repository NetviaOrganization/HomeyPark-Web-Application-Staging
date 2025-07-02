import BaseService from '@/shared/services/BaseService'
import { CreateParkingDto, Parking, UpdateParkingDto } from '../model/parking'

class ParkingService extends BaseService<Parking> {
  constructor() {
    super()
    this.baseUrl = `${this.baseUrl}/parking`
  }

  public override async getById(id: string | number): Promise<Parking> {
    try {
      const response = await this.http.get<Parking>(`${this.baseUrl}/${id}/details`)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }

  public async getNearbyByLocation(lat: number, lng: number) {
    try {
      const response = await this.http.get<Parking[]>(
        `${this.baseUrl}/nearby?lat=${lat}&lng=${lng}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }

  public async getAllByProfileId(profileId: string | number) {
    try {
      const response = await this.http.get<Parking[]>(`${this.baseUrl}/profile/${profileId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }

  public async updateParking(id: number, parking: UpdateParkingDto): Promise<void> {
    try {
      await this.http.put<Parking>(`${this.baseUrl}/${id}`, parking)
      // return response.data
    } catch (error) {
      console.error('Error updating data:', error)
      throw error
    }
  }

  public async createParking(parking: CreateParkingDto): Promise<void> {
    try {
      await this.http.post<Parking>(this.baseUrl, parking)
      // return response.data
    } catch (error) {
      console.error('Error updating data:', error)
      throw error
    }
  }

  public async deleteParkingById(id: string | number): Promise<void> {
    try {
      await this.http.delete(`${this.baseUrl}/delete/${id}`)
    } catch (err) {
      console.error('Error deleting data:', err)
      throw err
    }
  }
}

export default ParkingService
