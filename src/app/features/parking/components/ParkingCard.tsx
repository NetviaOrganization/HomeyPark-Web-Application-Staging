import { FC, useState } from 'react'
import { Parking } from '../model/parking'
import { env } from '@/env'
import { Button } from 'primereact/button'
import { isPromise } from '@/shared/utils/promise'

const ParkingCard: FC<Props> = ({ parking, onEdit, onDelete }) => {
  const { address, numDirection, latitude, longitude, city, street } = parking.location

  const [loadingDelete, setLoadingDelete] = useState(false)

  const handleDelete = () => {
    if (!onDelete) return

    const voidOrPromise = onDelete()

    if (!isPromise(voidOrPromise)) return

    setLoadingDelete(true)
    voidOrPromise.catch(console.error).finally(() => {
      setLoadingDelete(false)
    })
  }

  return (
    <article className="border border-slate-100 rounded-lg overflow-hidden flex flex-col">
      <div className="w-full flex">
        <img
          className="w-full aspect-[16/9]"
          src={`https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${latitude},${longitude}&key=${env.google.apiKey}`}
          alt={`${address} ${numDirection}`}
        />
      </div>

      <div className="p-6 flex flex-col h-full">
        <p className="font-bold text-sm">
          {address} {numDirection}
        </p>
        <p className="text-sm font-medium">
          {street}, {city}
        </p>

        {/* <p className=''></p> */}
        <div className="mt-2 text-sm line-clamp-2">{parking.description}</div>

        <div className="flex gap-2 mt-auto pt-4">
          <Button
            onClick={handleDelete}
            className="w-full"
            loading={loadingDelete}
            label="Borrar"
            severity="danger"
            size="small"
            icon="pi pi-trash"
          />
          <Button
            onClick={onEdit}
            className="w-full"
            label="Editar"
            size="small"
            icon="pi pi-pencil"
          />
        </div>
      </div>
    </article>
  )
}

interface Props {
  parking: Parking
  onEdit?: () => void
  onDelete?: () => Promise<void> | void
}
export default ParkingCard
