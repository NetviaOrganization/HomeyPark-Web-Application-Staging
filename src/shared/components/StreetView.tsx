import {
  useEffect,
  useRef,
  CSSProperties,
  FC,
  useImperativeHandle,
  RefObject,
} from 'react'
import { useApiIsLoaded } from '@vis.gl/react-google-maps'

interface StreetViewProps
  extends Omit<google.maps.StreetViewPanoramaOptions, 'position'> {
  lat: number
  lng: number
  className?: string
  style?: CSSProperties
  ref?: RefObject<StreetViewHandle | null>
}

export interface StreetViewHandle {
  panorama: google.maps.StreetViewPanorama | null
}

const StreetView: FC<StreetViewProps> = ({
  lat,
  lng,
  className,
  style,
  ref,
  ...options
}) => {
  const panoRef = useRef<HTMLDivElement>(null)
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null)
  const loaded = useApiIsLoaded()

  useEffect(() => {
    if (!loaded) return

    if (panoRef.current) {
      const position = { lat, lng }

      const panorama = new google.maps.StreetViewPanorama(panoRef.current, {
        position,
        ...options,
      })

      panoramaRef.current = panorama
    }

    return () => {
      panoramaRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, lat, lng, ...Object.values(options)])

  useImperativeHandle(
    ref,
    () => ({
      panorama: panoramaRef.current,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loaded]
  )

  return <div className={className} style={style} ref={panoRef} />
}

export default StreetView
