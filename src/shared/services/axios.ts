import axios from 'axios'
import { env } from '@/env'

const api = axios.create({
  baseURL: env.api.baseUrl,
  withCredentials: true, // if using cookies or session
})

// REQUEST interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
