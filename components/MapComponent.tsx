'use client'

import { useEffect, useRef, useState } from 'react'

interface MapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void
}

declare global {
  interface Window {
    google: any
  }
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBjNwxlLIkPAm0hQKJJDwvNJ5GEW5LqVxw'

export default function MapComponent({ onLocationSelect }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const marker = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Default center: Santiago, Chile
  const defaultCenter = { lat: -33.8688, lng: -51.2093 }

  useEffect(() => {
    if (isLoaded && mapContainer.current && !map.current) {
      initMap()
    }
  }, [isLoaded])

  useEffect(() => {
    if (!window.google) {
      loadGoogleMapsScript()
    } else {
      setIsLoaded(true)
    }
  }, [])

  const loadGoogleMapsScript = () => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&language=es`
    script.async = true
    script.onload = () => {
      setIsLoaded(true)
    }
    document.head.appendChild(script)
  }

  const initMap = () => {
    if (!mapContainer.current) return

    map.current = new window.google.maps.Map(mapContainer.current, {
      zoom: 13,
      center: defaultCenter,
      mapTypeControl: true,
      fullscreenControl: true,
    })

    // Create default marker
    marker.current = new window.google.maps.Marker({
      position: defaultCenter,
      map: map.current,
      draggable: true,
      title: 'Tu ubicación',
    })

    // Handle marker drag
    marker.current.addListener('dragend', () => {
      const position = marker.current.getPosition()
      handleLocationSelection(position.lat(), position.lng())
    })

    // Handle map click
    map.current.addListener('click', (e: any) => {
      const position = e.latLng
      marker.current.setPosition(position)
      handleLocationSelection(position.lat(), position.lng())
    })

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          map.current.setCenter(userLocation)
          marker.current.setPosition(userLocation)
          handleLocationSelection(userLocation.lat, userLocation.lng)
        },
        () => {
          // Use default if geolocation fails
          handleLocationSelection(defaultCenter.lat, defaultCenter.lng)
        }
      )
    }
  }

  const handleLocationSelection = (lat: number, lng: number) => {
    const location = { lat, lng }
    setSelectedLocation(location)
    onLocationSelect(location)
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div ref={mapContainer} className="w-full h-96 rounded-lg border border-gray-300" />
      <div className="text-xs text-gray-500">
        {selectedLocation ? (
          <div>
            <span className="text-green-600">✓ Ubicación confirmada:</span> {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
          </div>
        ) : (
          <div>Haz clic en el mapa o arrastra el marcador para seleccionar tu ubicación</div>
        )}
      </div>
    </div>
  )
}
