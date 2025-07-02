import { FC } from 'react'
import { Vehicle } from '../model/vehicle'
import VehicleCard from './VehicleCard'

const VehiclesList: FC<Props> = ({ vehicles, onEdit, onDelete, loadingVehicleDeleteId }) => {
  const isEmpty = vehicles.length === 0

  if (isEmpty) {
    return <div>No tienes vehículos registrados</div>
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onDelete={() => onDelete?.(vehicle)}
          onEdit={() => onEdit?.(vehicle)}
          loadingDelete={loadingVehicleDeleteId === vehicle.id}
        />
      ))}
    </div>
  )
}

interface Props {
  vehicles: Vehicle[]
  onDelete?: (vehicle: Vehicle) => void
  onEdit?: (vehicle: Vehicle) => void
  loadingVehicleDeleteId?: string | number | null
}

export default VehiclesList
