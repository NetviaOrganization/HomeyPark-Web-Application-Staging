import { usePromise } from '@/shared/hooks/usePromise'
import ParkingService from '../services/ParkingService'

const parkingService = new ParkingService()

export const useParkingDetail = (id: string | number) => {
  const { data, error, loading } = usePromise(() => parkingService.getById(id))

  return {
    parking: data,
    error,
    loading,
  }
}
