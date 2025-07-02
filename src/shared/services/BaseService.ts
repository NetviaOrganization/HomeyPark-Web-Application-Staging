import { appStore } from '@/app/store/store'
import { env } from '@/env'
import Axios, { type AxiosInstance } from 'axios'

class BaseService<T = unknown> {
  protected baseUrl: string
  protected http: AxiosInstance

  constructor() {
    this.baseUrl = env.api.baseUrl
    this.http = Axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    this.http.interceptors.request.use(
      (config) => {
        const token = appStore.getState().auth.token
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
      },
      (error) => {
        console.error('Request error:', error)
        Promise.reject(error)
      }
    )
  }

  public async getAll(): Promise<T[]> {
    try {
      const response = await this.http.get<T[]>(this.baseUrl)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }

  public async getById(id: string | number): Promise<T> {
    try {
      const response = await this.http.get<T>(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }

  public async deleteParkingById(id: string | number): Promise<void> {
    try {
      await this.http.delete(`${this.baseUrl}/${id}`)
    } catch (err) {
      console.error('Error deleting data:', err)
      throw err
    }
  }
}

export default BaseService
