'use client'

import { useEffect, useRef, useState } from 'react'

interface AddressResult {
  direccion: string
  comuna: string
  ciudad: string
  region: string
}

interface Props {
  value: string
  onChange: (result: AddressResult) => void
  error?: string
}

declare global {
  interface Window { google: any; initPlaces?: () => void }
}

export default function AddressAutocomplete({ value, onChange, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const acRef = useRef<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.google?.maps?.places) { init(); return }
    const existing = document.getElementById('gplaces-script')
    if (existing) { existing.addEventListener('load', init); return }
    window.initPlaces = init
    const s = document.createElement('script')
    s.id = 'gplaces-script'
    s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=es&callback=initPlaces`
    s.async = true
    document.head.appendChild(s)
  }, [])

  const init = () => {
    if (!inputRef.current || !window.google?.maps?.places) return
    acRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'cl' },
      fields: ['formatted_address', 'address_components'],
      types: ['address'],
    })
    acRef.current.addListener('place_changed', () => {
      const place = acRef.current.getPlace()
      const components = place.address_components ?? []

      const get = (type: string) =>
        components.find((c: any) => c.types.includes(type))?.long_name ?? ''

      const result: AddressResult = {
        direccion: place.formatted_address ?? inputRef.current?.value ?? '',
        comuna:
          get('administrative_area_level_3') ||
          get('sublocality_level_1') ||
          get('locality'),
        ciudad:
          get('locality') ||
          get('administrative_area_level_2'),
        region: get('administrative_area_level_1'),
      }
      onChange(result)
    })
    setReady(true)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        defaultValue={value}
        placeholder="Ej: Av. Providencia 1234, Providencia"
        className={`w-full py-4 px-5 rounded-2xl border-2 outline-none transition-colors text-base ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-forest bg-white'
        }`}
      />
      {!ready && <p className="text-xs text-gray-300 mt-1.5">Cargando sugerencias…</p>}
      {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
    </div>
  )
}
