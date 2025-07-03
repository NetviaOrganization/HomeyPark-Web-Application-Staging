import { Profile } from '@/app/features/profile/model/profile'

class ProfileCache {
  private static instance: ProfileCache
  private cache = new Map<number, Profile>()
  private loadingPromises = new Map<number, Promise<Profile>>()

  static getInstance(): ProfileCache {
    if (!ProfileCache.instance) {
      ProfileCache.instance = new ProfileCache()
    }
    return ProfileCache.instance
  }

  get(userId: number): Profile | null {
    return this.cache.get(userId) || null
  }

  set(userId: number, profile: Profile): void {
    this.cache.set(userId, profile)
  }

  has(userId: number): boolean {
    return this.cache.has(userId)
  }

  getLoadingPromise(userId: number): Promise<Profile> | null {
    return this.loadingPromises.get(userId) || null
  }

  setLoadingPromise(userId: number, promise: Promise<Profile>): void {
    this.loadingPromises.set(userId, promise)
    
    // Limpiar la promesa cuando se resuelva
    promise.finally(() => {
      this.loadingPromises.delete(userId)
    })
  }

  clear(): void {
    this.cache.clear()
    this.loadingPromises.clear()
  }

  // Opcional: limpiar caché después de cierto tiempo
  clearExpired(): void {
    // Esta implementación es básica, se puede mejorar agregando timestamps
    // Por ahora solo limpiamos todo el caché
    this.clear()
  }
}

export default ProfileCache
