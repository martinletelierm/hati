'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MapComponent from './MapComponent'

const formSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  rut: z.string().min(5, 'RUT inválido'),
  direccion: z.string().min(5, 'Ingresa tu dirección completa'),
  ciudad: z.string().min(2, 'Ciudad requerida'),
  comuna: z.string().min(2, 'Comuna requerida'),
  cantidad: z.number().min(1),
})

type FormData = z.infer<typeof formSchema>

const PRICE_EARLY = 27990
const PRICE_REGULAR = 29990
const DAILY_LIMIT = 20

export default function PreSaleForm() {
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [numeroPedido, setNumeroPedido] = useState('')
  const [loading, setLoading] = useState(false)
  const [soldToday, setSoldToday] = useState(0)

  useEffect(() => {
    fetch('/api/daily-sales')
      .then((r) => r.json())
      .then((d) => setSoldToday(d.total ?? 0))
      .catch(() => {})
  }, [])

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { cantidad: 1 },
  })

  const cantidad = watch('cantidad') || 1

  const unitsAtEarly = Math.max(0, DAILY_LIMIT - soldToday)
  const earlyUnits = Math.min(cantidad, unitsAtEarly)
  const regularUnits = cantidad - earlyUnits
  const total = earlyUnits * PRICE_EARLY + regularUnits * PRICE_REGULAR

  const onSubmit = async (data: FormData) => {
    if (!mapLocation) return
    setLoading(true)
    const pedido = `HATI-${Date.now()}`

    try {
      await fetch('/api/presale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ubicacion: mapLocation, precioTotal: total, numeroPedido: pedido }),
      })
      setNumeroPedido(pedido)
      setSubmitted(true)
    } catch {
      alert('Error al enviar el formulario. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-forest rounded-full mb-6">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-forest mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          ¡Reserva confirmada!
        </h3>
        <p className="text-gray-500 mb-2">Tu número de pedido es:</p>
        <p className="text-xl font-bold text-forest mb-8">{numeroPedido}</p>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Te contactaremos pronto para coordinar el pago y el envío. ¡Gracias por apoyar HATI!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid lg:grid-cols-5 gap-10">

        {/* LEFT: Form fields */}
        <div className="lg:col-span-3 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Nombre completo" error={errors.nombre?.message}>
              <input {...register('nombre')} placeholder="Tu nombre" className={inputClass} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input {...register('email')} type="email" placeholder="tu@email.com" className={inputClass} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Teléfono" error={errors.telefono?.message}>
              <input {...register('telefono')} placeholder="+56 9 1234 5678" className={inputClass} />
            </Field>
            <Field label="RUT" error={errors.rut?.message}>
              <input {...register('rut')} placeholder="12.345.678-9" className={inputClass} />
            </Field>
          </div>
          <Field label="Dirección" error={errors.direccion?.message}>
            <input {...register('direccion')} placeholder="Calle, número, departamento…" className={inputClass} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Ciudad" error={errors.ciudad?.message}>
              <input {...register('ciudad')} placeholder="Santiago" className={inputClass} />
            </Field>
            <Field label="Comuna" error={errors.comuna?.message}>
              <input {...register('comuna')} placeholder="Providencia" className={inputClass} />
            </Field>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <Field label="Cantidad de juegos" error={errors.cantidad?.message}>
              <input
                {...register('cantidad', { valueAsNumber: true })}
                type="number"
                min="1"
                className={`${inputClass} max-w-[120px]`}
              />
            </Field>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Envío:</strong> El costo de envío es por pagar del comprador. Lo coordinamos contigo al confirmar el pedido.
          </div>
        </div>

        {/* RIGHT: Map + Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-3">Confirma tu ubicación en el mapa</h3>
            <MapComponent onLocationSelect={setMapLocation} />
            {!mapLocation && (
              <p className="text-xs text-red-500 mt-2">Haz clic en el mapa para confirmar tu dirección</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-forest text-white rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-widest text-white/60 mb-4">Resumen del pedido</h3>
            <div className="space-y-2 mb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Producto</span>
                <span>HATI × {cantidad}</span>
              </div>
              {earlyUnits > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-300">{earlyUnits} × precio especial</span>
                  <span className="text-green-300">${(earlyUnits * PRICE_EARLY).toLocaleString('es-CL')}</span>
                </div>
              )}
              {regularUnits > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/70">{regularUnits} × precio regular</span>
                  <span>${(regularUnits * PRICE_REGULAR).toLocaleString('es-CL')}</span>
                </div>
              )}
              <div className="flex justify-between text-white/50 text-xs">
                <span>Envío</span>
                <span>Por coordinar</span>
              </div>
            </div>
            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-white/70 text-sm">Total</span>
                <span className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                  ${total.toLocaleString('es-CL')}
                </span>
              </div>
              <div className="text-xs text-white/40 mt-1">
                {Math.max(0, DAILY_LIMIT - soldToday)} unidades disponibles a precio especial hoy
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!mapLocation || loading}
            className="w-full bg-orange text-white font-bold py-4 rounded-xl text-lg hover:bg-orange/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#E8632A' }}
          >
            {loading ? 'Procesando…' : 'Confirmar reserva'}
          </button>
        </div>
      </div>
    </form>
  )
}

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest text-gray-900 placeholder-gray-400 bg-gray-50 transition'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
