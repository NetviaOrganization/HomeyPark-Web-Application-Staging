import { AxiosError } from 'axios'
import { useState, useEffect } from 'react'
import type { CreateVehicleDTO, UpdateVehicleDTO, Vehicle } from '../model/vehicle'
import VehicleService from '../services/vehicleService'
import { useAppStore } from '@/app/store/store'
import { useAuthState } from '@/shared/hooks/useAuth'

const vehicleService = new VehicleService()

export const useVehicles = () => {
  const loadingProfile = useAppStore((state) => state.profileData.loading)
  const { profileId } = useAuthState()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AxiosError | null>(null)

  useEffect(() => {
    if (loadingProfile) return

    if (!profileId) {
      setVehicles([])
      setLoading(false)
      return
    }

    const fetchVehicles = async () => {
      try {
        const response = await vehicleService.getAllByUserId(profileId)

        setVehicles(response)
      } catch (err) {
        setError(err as AxiosError)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [profileId, loadingProfile])

  const deleteVehicle = async (vehicleId: string | number) => {
    try {
      await vehicleService.deleteById(vehicleId)
      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== vehicleId))
    } catch (err) {
      setError(err as AxiosError)
    }
  }

  const editVehicle = async (vehicleId: string | number, vehicleData: UpdateVehicleDTO) => {
    try {
      await vehicleService.editById(vehicleId, vehicleData)
      setVehicles((prev) =>
        prev.map((vehicle) => (vehicle.id === vehicleId ? { ...vehicle, ...vehicleData } : vehicle))
      )
    } catch (err) {
      setError(err as AxiosError)
    }
  }

  const createVehicle = async (data: CreateVehicleDTO) => {
    try {
      const vehicle = await vehicleService.create(data)
      setVehicles((prev) => [...prev, vehicle])
    } catch (err) {
      setError(err as AxiosError)
    }
  }

  return { vehicles, loading, error, deleteVehicle, editVehicle, createVehicle }
}
