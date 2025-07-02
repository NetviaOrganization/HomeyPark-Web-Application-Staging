/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseService from '@/shared/services/BaseService'
import { Profile } from '../model/profile'

class ProfileService extends BaseService {
  public async getProfileByUserId(userId: string | number): Promise<Profile> {
    try {
      const response = await this.http.get<Profile[]>(`${this.baseUrl}/profiles`)
      const users = response.data
      const user = users.find((user) => Number(user.userId) === Number(userId))

      console.log('Fetched profiles:', users)
      console.log('Found user:', user)

      if (!user) throw new Error(`Profile not found for user ID: ${userId}`)
      return user
    } catch (error) {
      console.error('Error fetching profile by user ID:', error)
      throw error
    }
  }
  public async getProfileById(id: string | number): Promise<any> {
    try {
      const response = await this.http.get<Profile>(`${this.baseUrl}/profiles/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  }

  public async updateProfile(data: any): Promise<any> {
    try {
      const response = await this.http.put(`${this.baseUrl}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }
}

export default ProfileService
