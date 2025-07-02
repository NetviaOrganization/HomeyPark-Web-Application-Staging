import { usePromise } from '@/shared/hooks/usePromise'
import { AxiosError } from 'axios'
import { useState, useEffect } from 'react'
import { Parking } from '../model/parking'
import ParkingService from '../services/parkingService'
import { useAppStore } from '@/app/store/store'

const parkingService = new ParkingService()

export const useMyParkings = () => {
  const { profile, loading } = useAppStore((state) => state.profileData)

  const {
    data,
    loading: loadingData,
    error,
  } = usePromise<Parking[] | null, AxiosError>(() => {
    if (!profile?.id) return null
    return parkingService.getAllByProfileId(profile.id)
  }, [profile?.id, loading])

  const [parkingList, setParkingList] = useState<Parking[]>([])

  useEffect(() => {
    setParkingList(data || [])
  }, [data])

  const handleDeleteParking = async (id: string | number) => {
    await parkingService.deleteParkingById(id)
    setParkingList((prev) => prev.filter((parking) => parking.id !== id))
  }

  return { parkingList, loading: loading || loadingData, error, handleDeleteParking }
}
