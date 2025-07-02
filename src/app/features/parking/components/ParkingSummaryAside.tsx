import { FC, useEffect, useRef, useState } from 'react'
import { Parking } from '../model/parking'
import { Nullable } from 'primereact/ts-helpers'
import { Button } from 'primereact/button'
import StreetView from '@/shared/components/StreetView'
import { formatCurrency } from '@/shared/utils/money'
import Portal from '@/shared/components/Portal'
import { useAppStore } from '@/app/store/store'

const ParkingSummaryAside: FC<Props> = ({ parking, onClose, onClickDetail, onClickReserve }) => {
  const [uiParking, setUiParking] = useState<Nullable<Parking>>(parking)
  const [visible, setVisible] = useState(!!parking)
  const timeoutRef = useRef<number>(null)
  const profileId = useAppStore((state) => state.auth.profileId)
  const isOwner = Number(profileId) === uiParking?.profileId

  useEffect(() => {
    setVisible(!!parking)
    if (parking) {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      setUiParking(parking)
    } else {
      timeoutRef.current = window.setTimeout(() => {
        setUiParking(null)
      }, 300)
    }
  }, [parking])

  // if (!uiParking) return null

  return (
    <Portal>
      <aside
        className={`absolute z-20 top-0 right-0 bottom-0 flex flex-col bg-white transition-all duration-300 ease-in-out shadow-2xl max-w-96 w-full ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
        // visible={!!parking}
        // onHide={() => onClose?.()}
      >
        {uiParking && (
          <>
            <div className="relative">
              <StreetView
                className="w-full h-64"
                disableDefaultUI
                lat={+uiParking.location.latitude}
                lng={+uiParking.location.longitude}
                clickToGo={false}
              />
              <Button
                className="absolute top-2 right-2 z-30 bg-white w-8 h-8 p-0"
                size="small"
                icon="pi pi-times"
                text
                rounded
                aria-label="Close"
                severity="secondary"
                onClick={onClose}
              />
            </div>
            <div className="px-6 py-5 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-900 mb-3">
                {uiParking.location.address} {uiParking.location.numDirection},{' '}
                {uiParking.location.street}
              </h2>
              <p className="text-sm text-700 mb-3">{uiParking.description}</p>

              <div className="grid grid-cols-3 gap-4 text-center mt-6">
                <div>
                  <i className="pi pi-home text-3xl mx-auto !block w-fit mb-2"></i>
                  <p className="text-sm font-medium">Dimensiones</p>
                  <p className="text-sm">
                    {uiParking.length}m x {uiParking.width}m x {uiParking.height}m
                  </p>
                </div>
                <div>
                  <i className="pi pi-car text-3xl mx-auto !block w-fit mb-2"></i>
                  <p className="text-sm font-medium">Disponibles</p>
                  <p className="text-sm">{uiParking.space} espacios</p>
                </div>
                <div>
                  <i className="pi pi-dollar text-3xl mx-auto !block w-fit mb-2"></i>
                  <p className="text-sm font-medium">Tarifa/Hora</p>
                  <p className="text-sm">{formatCurrency(uiParking.price)} </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {/* <div>
                <p className="text-sm font-semibold">Creado por:</p>
                <p className="text-sm">
                  {uiParking.user.name} {uiParking.user.lastName}
                </p>
              </div> */}

                {/* <div>
                <p className="text-sm font-semibold">Se unió:</p>
                <p className="text-sm">
                  {formatDate(uiParking.user.dateCreated)}
                </p>
              </div> */}
              </div>

              <div className="mt-auto flex gap-2 w-full">
                <Button
                  onClick={onClickDetail}
                  className="w-full"
                  outlined
                  label="Ver más"
                  severity="secondary"
                  iconPos="right"
                  icon="pi pi-info-circle"
                />
                <Button
                  onClick={onClickReserve}
                  className="w-full"
                  disabled={isOwner}
                  label={isOwner ? 'De tu propiedad' : 'Reservar'}
                  icon="pi pi-check"
                  iconPos="right"
                  severity={isOwner ? 'contrast' : 'success'}
                />
              </div>
            </div>
          </>
        )}
      </aside>
    </Portal>
  )
  // return <div className={asideClassName}>hello world</div>
}

interface Props {
  parking: Nullable<Parking>
  onClose?: () => void
  onClickDetail?: () => void
  onClickReserve?: () => void
}

export default ParkingSummaryAside
