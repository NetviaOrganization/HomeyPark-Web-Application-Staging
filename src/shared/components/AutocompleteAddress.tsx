import { useEffect, useState, useRef, FC } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { InputText } from 'primereact/inputtext'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'

interface AutocompleteAddressProps {
  onChangedPlace?: (place: google.maps.places.PlaceResult) => void
  defaultValue?: string
  loading?: boolean
}

const AutocompleteAddress: FC<AutocompleteAddressProps> = ({
  onChangedPlace,
  loading = false,
  defaultValue,
}) => {
  const placesLib = useMapsLibrary('places')
  const [inputValue, setInputValue] = useState(defaultValue ?? '')
  // const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!placesLib || !inputRef.current) return

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      fields: ['address_components', 'geometry', 'name', 'formatted_address'],
      types: ['address'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.name) return

      setInputValue(place.formatted_address ?? '')
      onChangedPlace?.(place)
    })

    // autocompleteRef.current = autocomplete

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesLib])

  return (
    <IconField>
      {loading ? (
        <InputIcon className="pi pi-spinner pi-spin" />
      ) : (
        <InputIcon className="pi pi-search" />
      )}
      <InputText
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Avenida Alfredo Benavides 2310, Miraflores, Lima"
        className="w-full"
      />
    </IconField>
  )
}

export default AutocompleteAddress
