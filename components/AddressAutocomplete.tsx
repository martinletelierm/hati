'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  value: string
  onChange: (address: string, ciudad: string, comuna: string) => void
  error?: string
}

declare global {
  interface Window { google: any; initPlaces?: () => void }
}

export default function AddressAutocomplete({ value, onChange, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.google?.maps?.places) { init(); return }

    const existing = document.getElementById('gplaces-script')
    if (existing) { existing.addEventListener('load', init); return }

    window.initPlaces = init
    const script = document.createElement('script')
    script.id = 'gplaces-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=es&callback=initPlaces`
    script.async = true
    document.head.appendChild(script)
  }, [])

  const init = () => {
    if (!inputRef.current || !window.google?.maps?.places) return
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'cl' },
      fields: ['formatted_address', 'address_components'],
      types: ['address'],
    })
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace()
      const addr = place.formatted_address ?? inputRef.current?.value ?? ''

      let ciudad = '', comuna = ''
      for (const c of place.address_components ?? []) {
        if (c.types.includes('locality')) ciudad = c.long_name
        if (c.types.includes('administrative_area_level_3')) comuna = c.long_name
        if (!comuna && c.types.includes('sublocality_level_1')) comuna = c.long_name
        if (!ciudad && c.types.includes('administrative_area_level_2')) ciudad = c.long_name
      }
      onChange(addr, ciudad, comuna)
    })
    setReady(true)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        defaultValue={value}
        placeholder="Ingresa tu dirección"
        className={`w-full py-4 px-5 rounded-2xl border-2 outline-none transition-colors text-base ${
          error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-200 focus:border-forest bg-white'
        }`}
      />
      {!ready && (
        <p className="text-xs text-gray-400 mt-1.5">Cargando sugerencias…</p>
      )}
      {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
    </div>
  )
}
