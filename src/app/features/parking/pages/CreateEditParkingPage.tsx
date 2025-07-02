import BasePage from '@/shared/page/BasePage'
import { Map, Marker, useApiIsLoaded, useMap } from '@vis.gl/react-google-maps'

import { useNavigate, useParams } from 'react-router'
import { Parking, UpdateParkingDto } from '../model/parking'
import ParkingService from '../services/parkingService'
import { usePromise } from '@/shared/hooks/usePromise'
import { Controller, useForm } from 'react-hook-form'
import Title from '@/shared/components/Title'
import { Divider } from 'primereact/divider'
import { InputNumber } from 'primereact/inputnumber'
import { REQUIRED_INPUT_ERROR } from '@/messages/form'
import AutocompleteAddress from '@/shared/components/AutocompleteAddress'
import { Button } from 'primereact/button'
import { useEffect, useState } from 'react'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputMask } from 'primereact/inputmask'
import { useAppStore } from '@/app/store/store'

const parkingService = new ParkingService()

const DEFAULT_LOCATION = {
  latitude: -12.092446,
  longitude: -77.0167209,
}

const defaultValues = {
  address: '',
  number: '',
  street: '',
  city: '',
  district: '',
  width: 0,
  length: 0,
  height: 0,
  space: 0,
  description: '',
  phone: '',
  price: 0,
  latitude: DEFAULT_LOCATION.latitude,
  longitude: DEFAULT_LOCATION.longitude,
}

const mapAddressToForm = (parking: Parking): typeof defaultValues => {
  const { space, length, width, height, description, phone, price } = parking
  const { address, numDirection, district, street, city, latitude, longitude } = parking.location

  return {
    address,
    number: numDirection,
    street,
    city,
    district,
    height,
    width,
    length,
    space: +space,
    description,
    phone,
    price,
    latitude: +latitude,
    longitude: +longitude,
  }
}

const CreateEditParkingPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const profile = useAppStore((state) => state.profileData.profile)
  const isLoaded = useApiIsLoaded()
  const map = useMap('create-edit-park-map')
  const [sendLoading, setSendLoading] = useState(false)

  const isEditMode = !!id

  const { data: initialParking, loading } = usePromise(() =>
    isEditMode ? parkingService.getById(id!) : null
  )
  const [loadForm, setLoadForm] = useState(true)

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues,
    criteriaMode: 'all',
    mode: 'onBlur',
    values: initialParking ? mapAddressToForm(initialParking) : undefined,
  })

  const latitude = watch('latitude', DEFAULT_LOCATION.latitude)
  const longitude = watch('longitude', DEFAULT_LOCATION.longitude)

  const onSubmit = async (data: typeof defaultValues) => {
    setSendLoading(true)
    try {
      const payload: UpdateParkingDto = {
        location: {
          address: data.address,
          numDirection: data.number,
          district: data.district,
          street: data.street,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
        },
        space: data.space.toString(),
        height: data.height,
        width: data.width,
        length: data.length,
        price: data.price,
        phone: data.phone.replace(/\s/g, ''), // Remove spaces
        description: data.description,
      }

      if (isEditMode) await parkingService.updateParking(initialParking!.id, payload)
      else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (payload as any).coordinates
        await parkingService.createParking({ ...payload, profileId: profile!.id! })
      }

      navigate('/my-garages')
    } catch (err) {
      console.error(err)
    } finally {
      setSendLoading(false)
    }
  }

  const handleChangedPlace = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()

      console.log(place.geometry.location)

      map?.panTo({ lat, lng })
      map?.setZoom(15)
      setValue('latitude', lat)
      setValue('longitude', lng)
    }

    if (place.address_components) {
      const number = place.address_components.find((component) =>
        component.types.includes('street_number')
      )

      const address = place.address_components.find((component) =>
        component.types.includes('route')
      )

      const district = place.address_components.find((component) =>
        component.types.includes('sublocality_level_1')
      )

      const street = place.address_components.find((component) =>
        component.types.includes('locality')
      )

      const city = place.address_components.find((component) =>
        component.types.includes('administrative_area_level_2')
      )

      setValue('number', number?.long_name ?? '')
      setValue('address', address?.long_name ?? '')
      setValue('address', address?.long_name ?? '')
      setValue('district', district?.long_name ?? '')
      setValue('street', street?.long_name ?? '')
      setValue('city', city?.long_name ?? '')
    }
  }

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setLoadForm(false)
      }, 100)
    }
  }, [loading])

  return (
    <BasePage>
      <Title>{isEditMode ? 'Edita tu garage' : 'Registra tu garage'}</Title>

      {loadForm ? (
        <p>Cargando...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 h-full flex flex-col">
          <div>
            <Title level="h4">Ubicación</Title>
            <div className="flex flex-col gap-1 mt-2">
              <label htmlFor="address" className="text-sm font-medium">
                Dirección
              </label>
              {!loading && (
                <AutocompleteAddress
                  onChangedPlace={handleChangedPlace}
                  defaultValue={`${initialParking?.location.address ?? ''} ${
                    initialParking?.location.numDirection ?? ''
                  }`.trim()}
                />
              )}
            </div>

            <div className="aspect-[16/6] mt-6">
              {isLoaded && !loading && (
                <Map
                  id="create-edit-park-map"
                  className="w-full h-full rounded-lg overflow-hidden"
                  center={{ lat: latitude, lng: longitude }}
                  defaultZoom={15}
                  gestureHandling="greedy"
                  disableDefaultUI
                >
                  <Marker
                    position={{ lat: latitude, lng: longitude }}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: '#00FF00',
                      fillOpacity: 1,
                      strokeColor: '#008800',
                      strokeWeight: 2,
                      scale: 8,
                    }}
                  />
                </Map>
              )}
            </div>
            <Divider />

            <section className="flex gap-4">
              <div className="w-full">
                <Title level="h4">Dimensiones</Title>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Controller
                    control={control}
                    name="space"
                    rules={{
                      required: { value: true, message: REQUIRED_INPUT_ERROR },
                      min: { value: 1, message: 'Debe ser mayor a 0' },
                    }}
                    render={({ field: { onChange, value, ...field }, fieldState }) => (
                      <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="space" className="text-sm font-medium">
                          Espacios disponibles
                        </label>
                        <InputNumber
                          id={field.name}
                          inputClassName="w-full"
                          onValueChange={(e) => onChange(e.value)}
                          suffix=" unidad(es)"
                          value={value}
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
                    name="width"
                    rules={{
                      required: { value: true, message: REQUIRED_INPUT_ERROR },
                      min: { value: 1, message: 'Debe ser mayor a 0' },
                    }}
                    render={({ field: { onChange, value, ...field }, fieldState }) => (
                      <div className="flex flex-col gap-1 w-full grow">
                        <label htmlFor="width" className="text-sm font-medium">
                          Ancho (m)
                        </label>
                        <InputNumber
                          id={field.name}
                          inputClassName="w-full"
                          onValueChange={(e) => onChange(e.value)}
                          suffix=" m"
                          value={value}
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
                    name="length"
                    rules={{
                      required: { value: true, message: REQUIRED_INPUT_ERROR },
                      min: { value: 1, message: 'Debe ser mayor a 0' },
                    }}
                    render={({ field: { onChange, value, ...field }, fieldState }) => (
                      <div className="flex flex-col gap-1 w-full grow">
                        <label htmlFor="length" className="text-sm font-medium">
                          Largo (m)
                        </label>
                        <InputNumber
                          id={field.name}
                          inputClassName="w-full"
                          onValueChange={(e) => onChange(e.value)}
                          suffix=" m"
                          value={value}
                          invalid={!!fieldState.error}
                          {...field}
                        />{' '}
                        {!!fieldState.error && (
                          <small className="text-red-500 leading">{fieldState.error.message}</small>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name="height"
                    rules={{
                      required: { value: true, message: REQUIRED_INPUT_ERROR },
                      min: { value: 1, message: 'Debe ser mayor a 0' },
                    }}
                    render={({ field: { onChange, value, ...field }, fieldState }) => (
                      <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="height" className="text-sm font-medium">
                          Alto (m)
                        </label>
                        <InputNumber
                          id={field.name}
                          inputClassName="w-full"
                          onValueChange={(e) => onChange(e.value)}
                          suffix=" m"
                          value={value}
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
              </div>
              <div className="w-full">
                <Title level="h4">Acerca del servicio</Title>

                <div className="flex gap-4 mt-2 w-full">
                  <Controller
                    control={control}
                    name="description"
                    rules={{
                      required: { value: true, message: REQUIRED_INPUT_ERROR },
                    }}
                    render={({ field, fieldState }) => (
                      <div className="flex flex-col gap-1 w-80">
                        <label htmlFor={field.name} className="text-sm font-medium">
                          Descripción
                        </label>
                        <InputTextarea
                          {...field}
                          rows={5}
                          className="w-full text-sm"
                          invalid={!!fieldState.error}
                        />
                        {!!fieldState.error && (
                          <small className="text-red-500 leading">{fieldState.error.message}</small>
                        )}
                      </div>
                    )}
                  />
                  <div className="flex flex-col gap-4 grow">
                    <Controller
                      control={control}
                      name="price"
                      rules={{
                        required: { value: true, message: REQUIRED_INPUT_ERROR },
                        min: { value: 1, message: 'Debe ser mayor a 0' },
                      }}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-1 w-full">
                          <label htmlFor={field.name} className="text-sm font-medium">
                            Precio por hora
                          </label>
                          <InputNumber
                            id={field.name}
                            {...field}
                            mode="currency"
                            currency="PEN"
                            locale="es-PE"
                            inputClassName="w-full"
                            invalid={!!fieldState.error}
                            value={field.value}
                            onChange={undefined}
                            onValueChange={(e) => field.onChange(e.value)}
                          />
                          {!!fieldState.error && (
                            <small className="text-red-500 leading">
                              {fieldState.error.message}
                            </small>
                          )}
                        </div>
                      )}
                    />
                    <Controller
                      control={control}
                      name="phone"
                      rules={{
                        required: { value: true, message: REQUIRED_INPUT_ERROR },
                        pattern: {
                          value: /^\d{3} \d{3} \d{3}$/,
                          message: 'Formato inválido',
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-1 w-full">
                          <label htmlFor={field.name} className="text-sm font-medium">
                            Teléfono
                          </label>
                          <InputMask
                            mask="999 999 999"
                            placeholder="999 999 999"
                            id={field.name}
                            className="w-full"
                            invalid={!!fieldState.error}
                            {...field}
                            value={field.value}
                          />
                          {!!fieldState.error && (
                            <small className="text-red-500 leading">
                              {fieldState.error.message}
                            </small>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              label="Cancelar"
              size="small"
              severity="danger"
              onClick={() => navigate('/my-garages')}
            />
            <Button label="Guardar" loading={sendLoading} size="small" />
          </div>
        </form>
      )}
    </BasePage>
  )
}

export default CreateEditParkingPage
