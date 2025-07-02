import { FC } from 'react'
import { Vehicle } from '../model/vehicle'
import { Button } from 'primereact/button'

const VehicleCard: FC<Props> = ({ vehicle, onDelete, onEdit, loadingDelete }) => {
  const { brand, model, licensePlate } = vehicle

  const handleDelete = () => {
    if (loadingDelete) return

    onDelete?.()
  }

  return (
    <article className="border border-slate-100 rounded-lg overflow-hidden flex flex-col p-4">
      <p className="text-lg font-bold">
        {brand} {model}
      </p>
      <p className="text-sm">{licensePlate}</p>
      <div className="flex gap-2 mt-auto pt-4">
        <Button
          onClick={handleDelete}
          className="w-full"
          label="Borrar"
          severity="danger"
          size="small"
          icon="pi pi-trash"
          loading={loadingDelete}
        />
        <Button
          onClick={onEdit}
          className="w-full"
          label="Editar"
          size="small"
          icon="pi pi-pencil"
        />
      </div>
    </article>
  )
}

interface Props {
  vehicle: Vehicle
  onDelete?: () => void
  onEdit?: () => void
  loadingDelete?: boolean
}

export default VehicleCard
