import { AdvancedMarker, Map, useMap } from '@vis.gl/react-google-maps'
import { useGeolocation } from '../../../../shared/hooks/useGeolocation'
import { usePromise } from '@/shared/hooks/usePromise'
import ParkingService from '../services/ParkingService'
import { useNavigate } from 'react-router'
import NearbyParkings from '../components/NearbyParkings'
import ParkingSummaryAside from '../components/ParkingSummaryAside'
import AutocompleteAddress from '@/shared/components/AutocompleteAddress'
import { Nullable } from 'primereact/ts-helpers'
import { Parking } from '../model/parking'
import { Slider } from 'primereact/slider'
import { Rating } from 'primereact/rating'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { useEffect, useState, useMemo } from 'react'
import { ProgressBar } from 'primereact/progressbar'
import { Tooltip } from 'primereact/tooltip'
import ReservationService from '../../reservations/services/reservationService'
import { useAuthState } from '@/shared/hooks/useAuth'
import { formatDate } from '@/shared/utils/date'

const DEFAULT_LOCATION = {
  latitude: -12.092446,
  longitude: -77.0167209,
}

const parkingService = new ParkingService()
const reservationService = new ReservationService()
const MAP_ID = 'find-park-map'

const FindYourParkPage = () => {
  const navigate = useNavigate()
  const { latitude, longitude, loading, error } = useGeolocation()
  const map = useMap(MAP_ID)
  const { data: parkingList, loading: parkingLoading } = usePromise(() => parkingService.getAll())
  const [selectedParking, setSelectedParking] = useState<Nullable<Parking>>(null)
  const { profileId } = useAuthState()
  const { data: reservations } = usePromise(
    () =>
      profileId ? reservationService.getReservationsByGuestId(profileId) : Promise.resolve([]),
    [profileId]
  )
  const [recentReservations, setRecentReservations] = useState<any[]>([])

  useEffect(() => {
    const localData = localStorage.getItem('recent_reservations')
    if (localData) {
      setRecentReservations(JSON.parse(localData))
    }
  }, [])

  // toggles filters on/off
  const [filtersEnabled, setFiltersEnabled] = useState<boolean>(false)

  // filtro de precio
  const maxPriceAvailable = useMemo(
    () =>
      parkingList && parkingList.length
        ? Math.ceil(Math.max(...parkingList.map((p) => p.price)))
        : 100,
    [parkingList]
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPriceAvailable])
  // filtro de rating
  const [minRating, setMinRating] = useState<number>(0)
  // filtro de verificados
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false)

  // init priceRange when data arrives
  useEffect(() => {
    if (parkingList && parkingList.length) {
      setPriceRange([0, maxPriceAvailable])
    }
  }, [parkingList, maxPriceAvailable])

  // center map on user
  useEffect(() => {
    if (latitude && longitude) {
      map?.setCenter({ lat: latitude, lng: longitude })
      map?.setZoom(15)
    }
  }, [latitude, longitude, map])

  const handleGoToDetail = (id: number) => navigate(`/find-your-parking/${id}`)
  const handleGoToReservation = (p: Parking) => navigate(`/checkout/${p.id}`)
  const handlePlaceChange = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      map?.setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })
      map?.setZoom(15)
    }
  }
  const clearFilters = () => {
    setPriceRange([0, maxPriceAvailable])
    setMinRating(0)
    setOnlyVerified(false)
  }

  // decide which list to show
  const displayedParkings = useMemo(() => {
    if (!parkingList) return []
    if (!filtersEnabled) return parkingList
    return parkingList.filter((p) => {
      const [minP, maxP] = priceRange
      const byPrice = p.price >= minP && p.price <= maxP
      const byRating = p.averageRating >= minRating
      const byVerified = onlyVerified ? !!p.userInfo.verifiedEmail : true
      return byPrice && byRating && byVerified
    })
  }, [parkingList, filtersEnabled, priceRange, minRating, onlyVerified])

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Buscador siempre visible (top-left) */}
      <div className="absolute top-6 left-6 z-30 w-80">
        <AutocompleteAddress onChangedPlace={handlePlaceChange} />

        {recentReservations.length > 0 && (
          <div className="mt-4 bg-white p-4 rounded-md shadow-md w-96">
            <h3 className="font-semibold text-lg mb-2">Tus últimas reservas</h3>
            <ul className="space-y-2 text-sm">
              {recentReservations.map((r, i) => (
                <li
                  key={i}
                  onClick={() => {
                    localStorage.setItem('reservation_prefill', JSON.stringify(r))
                    navigate(`/checkout/${r.parkingId}`)
                  }}
                  className="border-b pb-2 last:border-0 cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  <div className="font-semibold">{r.street}</div>
                  <div>{formatDate(r.date)}</div>
                  <div className="text-green-600 font-medium">${r.total.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Botón toggle filtros (solo ícono), top-right */}

      <div className="absolute top-6 right-6 z-30 flex gap-4 items-center">
        <div className="rounded-sm bg-white p-4 shadow-md flex items-center gap-2">
          <ProgressBar
            id="discount-progressbar"
            value={reservations ? (reservations.length % 10) * 10 : 0}
            showValue
            className="w-32 h-3"
            data-pr-tooltip="Al llegar a 10 reservas, recibirás un descuento"
          />

          {/* Inicializamos el Tooltip apuntando al ProgressBar */}
          <Tooltip target="#discount-progressbar" position="top" mouseTrack mouseTrackLeft={10} />
        </div>
        <Button
          icon="pi pi-filter"
          className={filtersEnabled ? 'p-button-success' : 'p-button-secondary'}
          onClick={() => setFiltersEnabled((fe) => !fe)}
        />
      </div>

      {/* panel de filtros */}
      {filtersEnabled && (
        <div className="absolute top-16 right-6 z-20 bg-white p-4 rounded-lg shadow-lg w-80 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rango de precio (USD):</label>
            <Slider
              value={priceRange}
              onChange={(e) => setPriceRange(e.value as [number, number])}
              range
              min={0}
              max={maxPriceAvailable}
            />
            <div className="flex justify-between text-xs mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rating mínimo:</label>
            <Rating value={minRating} onChange={(e) => setMinRating(e.value || 0)} cancel={false} />
          </div>

          <div className="flex items-center">
            <Checkbox
              inputId="verifiedFilter"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.checked!)}
            />
            <label htmlFor="verifiedFilter" className="ml-2 text-sm">
              Solo cocheras con usuario verificado
            </label>
          </div>

          <Button
            label="Borrar filtros"
            icon="pi pi-filter-slash"
            className="w-full mt-2"
            onClick={clearFilters}
          />
        </div>
      )}

      {/* MAPA */}
      <Map
        id={MAP_ID}
        mapId={MAP_ID}
        className="w-full h-full"
        defaultCenter={{
          lat: latitude ?? DEFAULT_LOCATION.latitude,
          lng: longitude ?? DEFAULT_LOCATION.longitude,
        }}
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI
        reuseMaps
      >
        {!loading && !error && latitude && longitude && (
          <AdvancedMarker position={{ lat: latitude, lng: longitude }} zIndex={10}>
            <div className="w-4 h-4 rounded-full bg-blue-500" />
          </AdvancedMarker>
        )}

        {!parkingLoading &&
          displayedParkings.map((p) => (
            <AdvancedMarker
              key={p.id}
              position={{ lat: +p.location.latitude, lng: +p.location.longitude }}
              onClick={() => setSelectedParking(p)}
            />
          ))}
      </Map>

      {/* LISTA LATERAL */}
      {!loading && !error && latitude && longitude && (
        <NearbyParkings lat={latitude} lng={longitude} onClick={(p) => setSelectedParking(p)} />
      )}

      {/* DETALLES */}
      <ParkingSummaryAside
        parking={selectedParking}
        onClose={() => setSelectedParking(null)}
        onClickReserve={() => selectedParking && handleGoToReservation(selectedParking)}
        onClickDetail={() => selectedParking && handleGoToDetail(selectedParking.id)}
      />
    </div>
  )
}

export default FindYourParkPage
