import BasePage from '@/shared/page/BasePage'
import { useParkingDetail } from '../hooks/useParkingDetail'
import { useNavigate, useParams } from 'react-router'
import StreetView from '@/shared/components/StreetView'
import { Button } from 'primereact/button'
// import { formatDate } from '@/shared/utils/date'
import Markdown from 'react-markdown'
import { formatCurrency } from '@/shared/utils/money'
import { useAppStore } from '@/app/store/store'

const ParkingDetailPage = () => {
  const { id } = useParams()
  const profileId = useAppStore((state) => state.auth.profileId)
  const navigate = useNavigate()
  const { parking, loading } = useParkingDetail(id!)

  const isOwner = Number(profileId) === parking?.profileId

  const handleGoBack = () => navigate(-1)

  const handleGoToReservation = () => {
    if (!parking) return
    navigate(`/checkout/${parking.id}`)
  }

  return (
    <BasePage>
      {loading ? (
        <h1>Cargando...</h1>
      ) : parking ? (
        <>
          <div className="flex items-center gap-3 mb-4 text-gray-800">
            <Button
              icon="pi pi-arrow-left"
              rounded
              text
              aria-label="Regresar"
              size="small"
              onClick={handleGoBack}
            />
            <h1 className="text-xl">Detalle de garaje</h1>
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <StreetView
              className="w-full h-96 "
              lat={+parking.location.latitude}
              lng={+parking.location.longitude}
              disableDefaultUI
              zoomControl={null}
              clickToGo={false}
            />
            <div className="bg-gradient-to-t from-black/60 to-black/10 absolute top-0 left-0 bottom-0 right-0 z-10 flex flex-col justify-end pointer-events-none">
              <div className="text-white p-6 *:pointer-events-auto w-fit">
                <h1 className="text-3xl font-semibold">
                  {parking.location.address} {parking.location.numDirection}
                </h1>
                <p>
                  <span>{parking.location.street}</span>, <span>{parking.location.city}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-gray-800 text-lg font-medium">Acerca del servicio</h3>
                  <div className="mt-4">
                    <div className="flex gap-8">
                      <div>
                        <i className="pi pi-home text-3xl mx-auto !block w-fit mb-2"></i>
                        <p className="text-sm font-medium">Dimensiones</p>
                        <ul className="text-sm">
                          <li>Largo: {parking.length}m</li>
                          <li>Ancho: {parking.width}m</li>
                          <li>Alto: {parking.height}m</li>
                        </ul>
                      </div>
                      <div>
                        <i className="pi pi-car text-3xl mx-auto !block w-fit mb-2"></i>
                        <p className="text-sm font-medium">Espacios en total</p>
                        <p className="text-sm">Hasta {parking.space} vehículos</p>
                      </div>
                      <div>
                        <i className="pi pi-dollar text-3xl mx-auto !block w-fit mb-2"></i>
                        <p className="text-sm font-medium">Tarifa/Hora</p>
                        <p className="text-sm">{formatCurrency(parking.price)} </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <h3 className="text-gray-800 text-lg font-medium">Descripción del garaje</h3>
                  <div className="mt-1 text-sm">
                    <Markdown>{parking.description}</Markdown>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button
                onClick={handleGoToReservation}
                disabled={isOwner}
                label={isOwner ? 'De tu propiedad' : 'Reservar'}
                icon="pi pi-check"
                iconPos="right"
                severity={isOwner ? 'contrast' : 'success'}
              />
            </div>
          </div>
        </>
      ) : (
        <h1>No se encontró el parking</h1>
      )}
    </BasePage>
  )
}

export default ParkingDetailPage
