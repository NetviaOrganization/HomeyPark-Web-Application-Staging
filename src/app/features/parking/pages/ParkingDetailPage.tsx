import BasePage from '@/shared/page/BasePage'
import { useParkingDetail } from '../hooks/useParkingDetail'
import { useNavigate, useParams } from 'react-router'
import StreetView from '@/shared/components/StreetView'
import { Button } from 'primereact/button'
import Markdown from 'react-markdown'
import { formatCurrency } from '@/shared/utils/money'
import { useAppStore } from '@/app/store/store'
import ParkingRating from '../components/ParkingRating'
import OwnerInfo from '../components/OwnerInfo'
import ReviewsSection from '../components/ReviewsSection'

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

          {/* Hero Section con StreetView prominente */}
          <div className="relative rounded-lg overflow-hidden mb-4">
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

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Columna principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Información básica del garaje */}
                <div className="bg-white rounded-lg border p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Información del garaje</h2>

                  {/* Características */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <i className="pi pi-home text-3xl text-blue-500 mb-2 block"></i>
                      <p className="text-sm font-medium text-gray-800">Dimensiones</p>
                      <div className="text-sm text-gray-600 mt-1">
                        <p>
                          {parking.length}m × {parking.width}m × {parking.height}m
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <i className="pi pi-car text-3xl text-green-500 mb-2 block"></i>
                      <p className="text-sm font-medium text-gray-800">Capacidad</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {parking.space} {parking.space === 1 ? 'vehículo' : 'vehículos'}
                      </p>
                    </div>
                    <div className="text-center">
                      <i className="pi pi-dollar text-3xl text-yellow-500 mb-2 block"></i>
                      <p className="text-sm font-medium text-gray-800">Precio por Hora</p>
                      <p className="text-lg font-semibold text-gray-800 mt-1">
                        {formatCurrency(parking.price)}
                      </p>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción</h3>
                    <div className="text-gray-700 prose prose-sm max-w-none">
                      <Markdown>{parking.description}</Markdown>
                    </div>
                  </div>
                </div>

                {/* Sistema completo de reseñas */}
                <ReviewsSection parkingId={parking.id} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Información del propietario */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Propietario</h3>
                  <OwnerInfo
                    userInfo={parking.userInfo}
                    size="medium"
                    layout="vertical"
                    showName={true}
                    showBadges={true}
                  />
                </div>

                {/* Botón de reserva */}
                <div className="bg-white rounded-lg border p-6">
                  <div className="text-center">
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(parking.price)}
                      </p>
                      <p className="text-sm text-gray-600">por hora</p>
                    </div>

                    <Button
                      onClick={handleGoToReservation}
                      disabled={isOwner}
                      label={isOwner ? 'De tu propiedad' : 'Reservar ahora'}
                      icon="pi pi-check"
                      iconPos="right"
                      severity={isOwner ? 'contrast' : 'success'}
                      className="w-full"
                      size="large"
                    />

                    {!isOwner && (
                      <p className="text-xs text-gray-500 mt-2">
                        No se realizará el cobro hasta confirmar
                      </p>
                    )}
                  </div>
                </div>

                {/* Información de contacto */}
                {parking.phone && (
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Contacto</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="pi pi-phone" />
                      <span>{parking.phone}</span>
                    </div>
                  </div>
                )}
              </div>
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
