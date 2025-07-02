import { AdvancedMarker, Map, useMap } from '@vis.gl/react-google-maps'
import { useGeolocation } from '../../../../shared/hooks/useGeolocation'
import { usePromise } from '@/shared/hooks/usePromise'
import ParkingService from '../services/parkingService'
import { useNavigate } from 'react-router'
import { Fragment } from 'react/jsx-runtime'
import NearbyParkings from '../components/NearbyParkings'
import { useEffect, useState } from 'react'
import ParkingSummaryAside from '../components/ParkingSummaryAside'
import { Nullable } from 'primereact/ts-helpers'
import { Parking } from '../model/parking'
import AutocompleteAddress from '@/shared/components/AutocompleteAddress'

const DEFAULT_LOCATION = {
  latitude: -12.092446,
  longitude: -77.0167209,
}

const parkingService = new ParkingService()
const MAP_ID = 'find-park-map'

const FindYourParkPage = () => {
  const navigate = useNavigate()
  const { latitude, longitude, loading, error } = useGeolocation()
  const map = useMap(MAP_ID)
  const { data: parkingList, loading: parkingLoading } = usePromise(() => parkingService.getAll())
  const [selectedParking, setSelectedParking] = useState<Nullable<Parking>>(null)

  useEffect(() => {
    if (latitude && longitude) {
      map?.setCenter({ lat: latitude, lng: longitude })
      map?.setZoom(15)
    }
  }, [latitude, longitude, map])

  const handleGoToDetail = (parkingId: number) => {
    navigate(`/find-your-parking/${parkingId}`)
  }

  const handleChangedPlace = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()

      map?.setCenter({ lat, lng })
      map?.setZoom(15)
    }
  }

  const handleGoToReservation = (parking: Parking) => {
    navigate(`/checkout/${parking.id}`)
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <Fragment>
        <Map
          id={MAP_ID}
          mapId={MAP_ID}
          className="w-full h-full rounded-lg overflow-hidden"
          defaultCenter={{
            lat: latitude ?? DEFAULT_LOCATION.latitude,
            lng: longitude ?? DEFAULT_LOCATION.longitude,
          }}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI
          reuseMaps
        >
          <div className="absolute top-6 left-6 max-w-xl w-full">
            <AutocompleteAddress onChangedPlace={handleChangedPlace} />
          </div>

          {!loading && !error && latitude && longitude && (
            <AdvancedMarker position={{ lat: +latitude, lng: +longitude }} zIndex={10}>
              <div className="w-4 h-4 rounded-full bg-[#4285F4] shadow-[0_0_0_4px_rgba(66,133,244,0.3),0_0_0_8px_rgba(66,133,244,0.15)]" />
            </AdvancedMarker>
          )}

          {!parkingLoading &&
            parkingList?.map((parking) => (
              <AdvancedMarker
                key={parking.id}
                position={{
                  lat: +parking.location.latitude,
                  lng: +parking.location.longitude,
                }}
                onClick={() => setSelectedParking(parking)}
              />
            ))}
        </Map>
        {!loading && !error && latitude && longitude && (
          <NearbyParkings
            lat={+latitude}
            lng={+longitude}
            onClick={(parking) => setSelectedParking(parking)}
          />
        )}

        <ParkingSummaryAside
          parking={selectedParking}
          onClose={() => setSelectedParking(null)}
          onClickReserve={() => {
            if (selectedParking) handleGoToReservation(selectedParking)
          }}
          onClickDetail={() => {
            if (selectedParking) handleGoToDetail(selectedParking.id)
          }}
        />
      </Fragment>
    </div>
  )
}

export default FindYourParkPage
