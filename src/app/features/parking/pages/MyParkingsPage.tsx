import Title from '@/shared/components/Title'
import BasePage from '@/shared/page/BasePage'
import ParkingCard from '../components/ParkingCard'
import { useNavigate } from 'react-router'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import EmptyParkingList from '../components/EmptyParkingList'
import ErrorParkingListBoundary from '../components/ErrorParkingListBoundary'
import LoadingIcon from '@/assets/icons/LoadingIcon'
import { useMyParkings } from '../hooks/useMyParkings'
import { useRef } from 'react'

const MyParkingsPage = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)
  const { parkingList, loading, error, handleDeleteParking } = useMyParkings()

  const handleDelete = (id: string | number) => {
    return new Promise<void>((resolve, reject) => {
      confirmDialog({
        message: '¿Estás seguro de que deseas eliminar este estacionamiento?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await handleDeleteParking(id)
            resolve()

            toast.current?.show({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Estacionamiento eliminado correctamente',
            })
          } catch (error) {
            console.error('Error deleting parking:', error)
            reject(error)
          }
        },
        reject: () => {
          resolve()
        },
      })
    })
  }

  return (
    <BasePage>
      <Title>Mis estacionamientos guardados</Title>

      <div className="flex justify-end">
        <Button label="Agregar" size="small" icon="pi pi-plus" onClick={() => navigate('create')} />
      </div>

      <div className="mt-6 h-full">
        {loading ? (
          <div className="flex items-center justify-center h-full w-full">
            <LoadingIcon className="text-[#10b981] animate-spin " width={120} height={120} />
          </div>
        ) : error ? (
          <ErrorParkingListBoundary
            error={error.message}
            errorCode={error.response?.status ?? ''}
          />
        ) : parkingList.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {parkingList.map((parking) => (
              <ParkingCard
                key={parking.id}
                parking={parking}
                onEdit={() => navigate(`edit/${parking.id}`)}
                onDelete={() => handleDelete(parking.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyParkingList />
        )}
      </div>

      <ConfirmDialog />
      <Toast ref={toast} />
    </BasePage>
  )
}

export default MyParkingsPage
