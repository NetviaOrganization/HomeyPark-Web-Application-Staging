import BaseService from '@/shared/services/BaseService'
import { Profile } from '../model/profile'
import ProfileCache from './ProfileCache'

class OptimizedProfileService extends BaseService {
  private cache = ProfileCache.getInstance()

  public async getProfileByUserId(userId: string | number): Promise<Profile> {
    const numericUserId = Number(userId)
    
    // 1. Verificar caché primero
    const cachedProfile = this.cache.get(numericUserId)
    if (cachedProfile) {
      return cachedProfile
    }

    // 2. Verificar si ya hay una llamada en progreso para este usuario
    const existingPromise = this.cache.getLoadingPromise(numericUserId)
    if (existingPromise) {
      return existingPromise
    }

    // 3. Hacer la llamada y cachear la promesa
    const promise = this.fetchProfileByUserId(numericUserId)
    this.cache.setLoadingPromise(numericUserId, promise)

    try {
      const profile = await promise
      this.cache.set(numericUserId, profile)
      return profile
    } catch (error) {
      console.error('Error fetching profile by user ID:', error)
      throw error
    }
  }

  private async fetchProfileByUserId(userId: number): Promise<Profile> {
    try {
      // Opción 1: Intentar usar un endpoint específico si existe
      // const response = await this.http.get<Profile>(`${this.baseUrl}/profiles/user/${userId}`)
      
      // Opción 2: Fallback al método actual (menos eficiente)
      const response = await this.http.get<Profile[]>(`${this.baseUrl}/profiles`)
      const users = response.data
      const user = users.find((user) => Number(user.userId) === userId)

      if (!user) throw new Error(`Profile not found for user ID: ${userId}`)
      
      // Aprovechar para cachear todos los perfiles obtenidos
      users.forEach(profile => {
        this.cache.set(profile.userId, profile)
      })

      return user
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  }

  public async getProfileById(id: string | number): Promise<Profile> {
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
      
      // Invalidar caché cuando se actualiza un perfil
      if (response.data && response.data.userId) {
        this.cache.set(response.data.userId, response.data)
      }
      
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  // Método para limpiar caché manualmente
  public clearCache(): void {
    this.cache.clear()
  }
}

export default OptimizedProfileService
