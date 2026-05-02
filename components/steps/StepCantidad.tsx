'use client'

import { useEffect, useState } from 'react'
import type { WizardData } from '../PreSaleWizard'
import { PREVENTA_1_CLP, PREVENTA_2_CLP, PREVENTA_1_CUPO_DIARIO } from '@/lib/pricing'

type PricingApi = {
  preventa1: {
    precio: number
    cupoDiario: number
    vendidasHoy: number
    restantesHoy: number
  }
  preventa2: { precio: number }
  pedido: {
    cantidad: number
    unidadesPreventa1: number
    unidadesPreventa2: number
    precioTotal: number
  }
}

export default function StepCantidad({
  data, update, onNext,
}: {
  data: WizardData
  update: (p: Partial<WizardData>) => void
  onNext: () => void
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/presale/pricing?cantidad=${data.cantidad}`)
        const json = (await res.json()) as PricingApi
        if (cancelled || !json.pedido) return
        update({
          precioTotal: json.pedido.precioTotal,
          unidadesPreventa1: json.pedido.unidadesPreventa1,
          unidadesPreventa2: json.pedido.unidadesPreventa2,
          vendidasHoyPv1: json.preventa1.vendidasHoy,
          restantesPv1Hoy: json.preventa1.restantesHoy,
        })
      } catch {
        if (!cancelled) {
          update({
            precioTotal: data.cantidad * PREVENTA_1_CLP,
            unidadesPreventa1: data.cantidad,
            unidadesPreventa2: 0,
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [data.cantidad, update])

  const total = data.precioTotal > 0 ? data.precioTotal : data.cantidad * PREVENTA_1_CLP
  const restantes = data.restantesPv1Hoy
  const cupoLleno = restantes <= 0

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Paso 1</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          ¿Cuántos juegos?
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          Elige la cantidad; después indicarás cómo pagaste
        </p>
      </div>

      <div className="rounded-2xl border border-forest/20 bg-white px-4 py-4 text-left space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Preventa activa</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
          <span className="text-forest">
            <strong>Pre Venta 1</strong> · ${PREVENTA_1_CLP.toLocaleString('es-CL')} c/u
          </span>
          <span className="text-gray-500">
            máx. {PREVENTA_1_CUPO_DIARIO} unidades / día a este precio
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm border-t border-gray-100 pt-2">
          <span className="text-forest">
            <strong>Pre Venta 2</strong> · ${PREVENTA_2_CLP.toLocaleString('es-CL')} c/u
          </span>
          <span className="text-gray-400 text-xs">cuando se agota el cupo diario de Pre Venta 1</span>
        </div>
        {!loading && (
          <p className={`text-sm pt-2 border-t border-gray-100 ${cupoLleno ? 'text-amber-800 bg-amber-50 -mx-4 px-4 py-2 rounded-b-xl' : 'text-gray-600'}`}>
            {cupoLleno
              ? 'El cupo de Pre Venta 1 de hoy ya se completó. Tu pedido usará Pre Venta 2 según corresponda.'
              : (
                <>
                  Hoy quedan <strong>{restantes}</strong> unidad{restantes !== 1 ? 'es' : ''} a Pre Venta 1
                  {' '}({data.vendidasHoyPv1}/{PREVENTA_1_CUPO_DIARIO} vendidas hoy).
                </>
                )}
          </p>
        )}
      </div>

      <div>
        <div className="w-full sm:w-auto inline-flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5 bg-white border border-gray-200 rounded-2xl px-4 sm:px-5 py-3">
          <button
            type="button"
            onClick={() => update({ cantidad: Math.max(1, data.cantidad - 1) })}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-forest hover:text-white text-forest font-bold text-lg transition-colors flex items-center justify-center"
          >−</button>
          <span className="text-2xl font-bold w-6 text-center tabular-nums">{data.cantidad}</span>
          <button
            type="button"
            onClick={() => update({ cantidad: data.cantidad + 1 })}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-forest hover:text-white text-forest font-bold text-lg transition-colors flex items-center justify-center"
          >+</button>
          <span className="w-full sm:w-auto text-center sm:text-left text-sm text-gray-400 sm:border-l border-gray-200 sm:pl-5">
            Precio según cupo (ver total abajo)
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Total estimado</p>
        {loading ? (
          <p className="text-sm text-gray-400">Calculando…</p>
        ) : (
          <>
            <p className="text-2xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
              ${total.toLocaleString('es-CL')}
            </p>
            {(data.unidadesPreventa1 > 0 || data.unidadesPreventa2 > 0) && (
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {data.unidadesPreventa1 > 0 && (
                  <span>
                    {data.unidadesPreventa1} × Pre Venta 1 (${PREVENTA_1_CLP.toLocaleString('es-CL')})
                    {data.unidadesPreventa2 > 0 ? ' · ' : ''}
                  </span>
                )}
                {data.unidadesPreventa2 > 0 && (
                  <span>
                    {data.unidadesPreventa2} × Pre Venta 2 (${PREVENTA_2_CLP.toLocaleString('es-CL')})
                  </span>
                )}
              </p>
            )}
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className="w-full min-h-14 bg-forest text-white font-semibold py-4 rounded-2xl text-base hover:bg-forest-mid transition-colors disabled:opacity-50"
      >
        Continuar →
      </button>
    </div>
  )
}
