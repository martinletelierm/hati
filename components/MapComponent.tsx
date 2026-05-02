'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  onLocationSelect: (location: { lat: number; lng: number }) => void
}

declare global {
  interface Window {
    google: any
    initHatiMap?: () => void
  }
}

const DEFAULT_CENTER = { lat: -33.4489, lng: -70.6693 } // Santiago

export default function MapComponent({ onLocationSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'selected'>('loading')

  useEffect(() => {
    if (window.google?.maps) {
      initMap()
    } else {
      loadScript()
    }
  }, [])

  const loadScript = () => {
    if (document.getElementById('google-maps-script')) return

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&language=es&callback=initHatiMap`
    script.async = true
    window.initHatiMap = initMap
    document.head.appendChild(script)
  }

  const initMap = () => {
    if (!containerRef.current) return

    mapRef.current = new window.google.maps.Map(containerRef.current, {
      zoom: 14,
      center: DEFAULT_CENTER,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d8d3' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4e8e0' }] },
      ],
    })

    markerRef.current = new window.google.maps.Marker({
      position: DEFAULT_CENTER,
      map: mapRef.current,
      draggable: true,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#1C3D35',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
    })

    markerRef.current.addListener('dragend', () => {
      const pos = markerRef.current.getPosition()
      handleSelect(pos.lat(), pos.lng())
    })

    mapRef.current.addListener('click', (e: any) => {
      markerRef.current.setPosition(e.latLng)
      handleSelect(e.latLng.lat(), e.latLng.lng())
    })

    setStatus('ready')

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const loc = { lat: coords.latitude, lng: coords.longitude }
          mapRef.current.setCenter(loc)
          markerRef.current.setPosition(loc)
          handleSelect(loc.lat, loc.lng)
        },
        () => {}
      )
    }
  }

  const handleSelect = (lat: number, lng: number) => {
    setStatus('selected')
    onLocationSelect({ lat, lng })
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ height: '220px' }}>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <span className="text-gray-400 text-sm">Cargando mapa…</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
      {status === 'selected' && (
        <div className="absolute bottom-2 left-2 bg-forest text-white text-xs px-3 py-1.5 rounded-full">
          Ubicación confirmada ✓
        </div>
      )}
    </div>
  )
}
