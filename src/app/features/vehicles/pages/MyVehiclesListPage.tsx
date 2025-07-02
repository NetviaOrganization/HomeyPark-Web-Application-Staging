import Title from '@/shared/components/Title'
import BasePage from '@/shared/page/BasePage'
import { useVehicles } from '../hooks/useVehicles'
import VehiclesList from '../components/VehiclesList'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import { Vehicle } from '../model/vehicle'
import { Toast } from 'primereact/toast'
import { useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Controller, useForm } from 'react-hook-form'
import { REQUIRED_INPUT_ERROR } from '@/messages/form'
import { InputText } from 'primereact/inputtext'
import { useAppStore } from '@/app/store/store'

const defaultFormValues = {
  licensePlate: '',
  brand: '',
  model: '',
}

const MyVehiclesListPage = () => {
  const { error, loading, vehicles, deleteVehicle, editVehicle, createVehicle } = useVehicles()
  const [loadingDeleteVehicleId, setLoadingDeleteVehicleId] = useState<string | number | null>(null)
  const toast = useRef<Toast>(null)
  const [editVehicleSelected, setEditVehicleSelected] = useState<Vehicle | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const profile = useAppStore((state) => state.profileData.profile)

  const { control, handleSubmit } = useForm({
    defaultValues: defaultFormValues,
    criteriaMode: 'all',
    mode: 'onBlur',
    values: editVehicleSelected
      ? {
          licensePlate: editVehicleSelected.licensePlate,
          brand: editVehicleSelected.brand,
          model: editVehicleSelected.model,
        }
      : defaultFormValues,
  })

  const handleDelete = (vehicle: Vehicle) => {
    confirmDialog({
      message: '¿Estás seguro de que deseas eliminar este vehículo?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',

      accept: async () => {
        try {
          setLoadingDeleteVehicleId(vehicle.id)
          await deleteVehicle(vehicle.id)

          toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Vehículo eliminado correctamente',
          })
        } catch (error) {
          console.error('Error deleting parking:', error)
        } finally {
          setLoadingDeleteVehicleId(null)
        }
      },
    })
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditVehicleSelected(vehicle)
    confirmDialog({ group: 'editVehicle' })
  }

  const handleCreate = () => {
    setEditVehicleSelected(null)
    confirmDialog({ group: 'createEditVehicle' })
  }

  const onSubmitVehicle = (hide: () => void) => async (data: typeof defaultFormValues) => {
    // if (!editVehicleSelected) return
    if (submitLoading) return

    console.log('data', data)

    try {
      setSubmitLoading(true)
      if (editVehicleSelected) await editVehicle(editVehicleSelected.id, data)
      else if (profile?.id) await createVehicle({ ...data, profileId: profile?.id })

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: `Vehículo ${editVehicleSelected ? 'editado' : 'creado'} correctamente`,
      })
      hide()
    } catch (error) {
      console.error(error)
    } finally {
      // setLoadingDeleteVehicleId(null)
      setEditVehicleSelected(null)
      setSubmitLoading(false)
    }
  }

  return (
    <BasePage>
      <Title>Mis vehículos</Title>
      <div className="mt-4 flex justify-end">
        <Button label="Agregar" icon="pi pi-plus" iconPos="left" onClick={handleCreate} />
      </div>
      <section className="mt-6">
        {loading ? (
          <div></div>
        ) : error ? (
          <div className="text-red-500">Error: {error.message}</div>
        ) : (
          <VehiclesList
            vehicles={vehicles}
            onDelete={handleDelete}
            onEdit={handleEdit}
            loadingVehicleDeleteId={loadingDeleteVehicleId}
          />
        )}
      </section>
      <ConfirmDialog />
      <ConfirmDialog
        group="createEditVehicle"
        content={({ hide }) => (
          <div className="bg-white p-4 rounded-lg">
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(onSubmitVehicle(() => hide(e)))(e)
              }}
            >
              <div className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="brand"
                  rules={{
                    required: { value: true, message: REQUIRED_INPUT_ERROR },
                  }}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1 w-full grow">
                      <label htmlFor="width" className="text-sm font-medium">
                        Marca
                      </label>
                      <InputText
                        id={field.name}
                        className="w-full"
                        invalid={!!fieldState.error}
                        {...field}
                      />
                      {!!fieldState.error && (
                        <small className="text-red-500 leading">{fieldState.error.message}</small>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="licensePlate"
                  rules={{
                    required: { value: true, message: REQUIRED_INPUT_ERROR },
                  }}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1 w-full grow">
                      <label htmlFor="width" className="text-sm font-medium">
                        Placa
                      </label>
                      <InputText
                        id={field.name}
                        className="w-full"
                        invalid={!!fieldState.error}
                        {...field}
                      />
                      {!!fieldState.error && (
                        <small className="text-red-500 leading">{fieldState.error.message}</small>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="model"
                  rules={{
                    required: { value: true, message: REQUIRED_INPUT_ERROR },
                  }}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1 w-full grow">
                      <label htmlFor="width" className="text-sm font-medium">
                        Modelo
                      </label>
                      <InputText
                        id={field.name}
                        className="w-full"
                        invalid={!!fieldState.error}
                        {...field}
                      />
                      {!!fieldState.error && (
                        <small className="text-red-500 leading">{fieldState.error.message}</small>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex align-items-center gap-2 mt-4">
                <Button label="Guardar" type="submit" loading={submitLoading} className="w-full" />
                <Button
                  label="Cancelar"
                  outlined
                  type="button"
                  onClick={(event) => {
                    setEditVehicleSelected(null)
                    hide(event)
                  }}
                  className="w-full"
                />
              </div>
            </form>
          </div>
        )}
      />
      <Toast ref={toast} />
    </BasePage>
  )
}

export default MyVehiclesListPage
