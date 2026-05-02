'use client'

import { useCallback, useEffect, useState } from 'react'
import { PREVENTA_1_CUPO_DIARIO } from '@/lib/pricing'

/** Por debajo de esto (y con cupo > 0) mostramos “quedan pocas”. */
const POCAS_UMBRAL = 5

const REFRESH_MS = 60_000

export default function PreventaHomeStatus() {
  const [vendidas, setVendidas] = useState<number | null>(null)
  const [restantes, setRestantes] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/presale/pricing?cantidad=1', { cache: 'no-store' })
      if (!res.ok) throw new Error('pricing')
      const json = (await res.json()) as {
        preventa1?: { vendidasHoy: number; restantesHoy: number }
      }
      const p1 = json.preventa1
      if (!p1 || typeof p1.vendidasHoy !== 'number' || typeof p1.restantesHoy !== 'number') {
        throw new Error('shape')
      }
      setVendidas(p1.vendidasHoy)
      setRestantes(p1.restantesHoy)
    } catch {
      setVendidas(null)
      setRestantes(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, REFRESH_MS)
    const onVis = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [load])

  if (loading) {
    return (
      <div
        className="rounded-2xl border border-gray-100 bg-white px-4 py-3.5"
        aria-busy="true"
        aria-label="Cargando cupo de preventa"
      >
        <div className="h-4 max-w-md mx-auto rounded bg-gray-100 animate-pulse" />
      </div>
    )
  }

  if (vendidas === null || restantes === null) {
    return null
  }

  const r = Math.max(0, Math.floor(restantes))
  const v = Math.max(0, Math.floor(vendidas))

  if (r <= 0) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-center text-sm text-red-950">
        <p className="font-semibold text-red-900">Pre Venta 1 agotada hoy</p>
        <p className="mt-1 text-red-900/85 leading-relaxed">
          El cupo diario a este precio ya se completó ({v}/{PREVENTA_1_CUPO_DIARIO} vendidas). Tu compra usará{' '}
          <strong>Pre Venta 2</strong> según corresponda.
        </p>
      </div>
    )
  }

  if (r <= POCAS_UMBRAL) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3.5 text-center text-sm text-amber-950">
        <p className="font-semibold text-amber-950">Quedan pocas unidades</p>
        <p className="mt-1 text-amber-950/90 leading-relaxed">
          Solo quedan <strong>{r}</strong> unidad{r !== 1 ? 'es' : ''} hoy a precio Pre Venta 1 ({v}/
          {PREVENTA_1_CUPO_DIARIO} vendidas).
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-forest/15 bg-white px-4 py-3.5 text-center text-sm text-gray-700 leading-relaxed">
      Pre Venta 1 hoy:{' '}
      <strong className="text-forest tabular-nums">
        {v}/{PREVENTA_1_CUPO_DIARIO}
      </strong>{' '}
      vendidas · quedan{' '}
      <strong className="text-forest tabular-nums">{r}</strong> a este precio
    </div>
  )
}
