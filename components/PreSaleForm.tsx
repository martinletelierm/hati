'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MapComponent from './MapComponent'

const formSchema = z.object({
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().regex(/^\+?[0-9]{9,}$/, 'Teléfono inválido'),
  rut: z.string().regex(/^\d{1,2}\.\d{3}\.\d{3}[-k]$/i, 'RUT inválido (ej: 12.345.678-9)'),
  direccion: z.string().min(5, 'Dirección es requerida'),
  ciudad: z.string().min(2, 'Ciudad es requerida'),
  comuna: z.string().min(2, 'Comuna es requerida'),
  cantidad: z.number().min(1, 'Cantidad debe ser al menos 1'),
})

type FormData = z.infer<typeof formSchema>

const PRICE_PER_UNIT_EARLY = 27990
const PRICE_PER_UNIT_REGULAR = 29990
const DAILY_LIMIT = 20

interface PricingInfo {
  price: number
  unitsAvailableAtPrice: number
  total: number
}

export default function PreSaleForm() {
  const [quantity, setQuantity] = useState(1)
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null)
  const [soldToday, setSoldToday] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cantidad: 1,
    },
  })

  // Simulated sold count (in a real app, this would come from a server)
  useEffect(() => {
    setSoldToday(15) // Example: 15 units already sold today
  }, [])

  // Calculate pricing based on quantity
  useEffect(() => {
    const unitsAtEarlyPrice = Math.max(0, DAILY_LIMIT - soldToday)
    const earlyPriceUnits = Math.min(quantity, unitsAtEarlyPrice)
    const regularPriceUnits = quantity - earlyPriceUnits

    const totalCost = earlyPriceUnits * PRICE_PER_UNIT_EARLY + regularPriceUnits * PRICE_PER_UNIT_REGULAR

    setPricingInfo({
      price: earlyPriceUnits > 0 ? PRICE_PER_UNIT_EARLY : PRICE_PER_UNIT_REGULAR,
      unitsAvailableAtPrice: unitsAtEarlyPrice,
      total: totalCost,
    })
  }, [quantity, soldToday])

  const onSubmit = async (data: FormData) => {
    if (!mapLocation) {
      alert('Por favor, confirma tu ubicación en el mapa')
      return
    }

    const formData = {
      ...data,
      cantidad: quantity,
      ubicacion: mapLocation,
      precioTotal: pricingInfo?.total,
      numeroPedido: `HATI-${Date.now()}`,
    }

    try {
      const response = await fetch('/api/presale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      }
    } catch (error) {
      alert('Error al enviar el formulario')
    }
  }

  const cantidadWatch = watch('cantidad')

  useEffect(() => {
    if (cantidadWatch) {
      setQuantity(cantidadWatch)
    }
  }, [cantidadWatch])

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-primary mb-4">¡Reserva Confirmada!</h2>
          <p className="text-gray-600 mb-4">Hemos recibido tu pre-orden de HATI</p>
          <p className="text-sm text-gray-500 mb-6">
            Te enviaremos un email de confirmación con los detalles de tu pedido
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition"
          >
            Hacer otra reserva
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary mb-6">Información Personal</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              {...register('nombre')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Tu nombre completo"
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
            <input
              {...register('telefono')}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+56 9 1234 5678"
            />
            {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUT *</label>
            <input
              {...register('rut')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="12.345.678-9"
            />
            {errors.rut && <p className="text-red-500 text-sm mt-1">{errors.rut.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
            <input
              {...register('direccion')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Calle, número y detalles"
            />
            {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
              <input
                {...register('ciudad')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tu ciudad"
              />
              {errors.ciudad && <p className="text-red-500 text-sm mt-1">{errors.ciudad.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comuna *</label>
              <input
                {...register('comuna')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tu comuna"
              />
              {errors.comuna && <p className="text-red-500 text-sm mt-1">{errors.comuna.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
            <input
              {...register('cantidad', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.cantidad && <p className="text-red-500 text-sm mt-1">{errors.cantidad.message}</p>}
          </div>
        </div>

        {/* Mapa y Resumen */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">Confirma tu Ubicación</h2>
            <MapComponent onLocationSelect={setMapLocation} />
          </div>

          {/* Resumen de Compra */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-primary mb-4">Resumen de Compra</h3>

            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Producto:</span>
                <span className="font-medium">HATI Board Game</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cantidad:</span>
                <span className="font-medium">{quantity}</span>
              </div>

              {pricingInfo && (
                <>
                  {pricingInfo.unitsAvailableAtPrice > 0 && quantity > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">
                          {Math.min(quantity, pricingInfo.unitsAvailableAtPrice)} x ${PRICE_PER_UNIT_EARLY.toLocaleString('es-CL')}
                        </span>
                        <span className="text-green-600 font-medium">
                          ${(Math.min(quantity, pricingInfo.unitsAvailableAtPrice) * PRICE_PER_UNIT_EARLY).toLocaleString('es-CL')}
                        </span>
                      </div>
                      {quantity > pricingInfo.unitsAvailableAtPrice && (
                        <div className="flex justify-between text-sm">
                          <span className="text-orange-600">
                            {quantity - pricingInfo.unitsAvailableAtPrice} x ${PRICE_PER_UNIT_REGULAR.toLocaleString('es-CL')}
                          </span>
                          <span className="text-orange-600 font-medium">
                            ${((quantity - pricingInfo.unitsAvailableAtPrice) * PRICE_PER_UNIT_REGULAR).toLocaleString('es-CL')}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span>Precio unitario:</span>
                      <span className="font-medium">${PRICE_PER_UNIT_REGULAR.toLocaleString('es-CL')}</span>
                    </div>
                  )}
                </>
              )}

              <div className="text-xs text-gray-500 mt-2">
                ℹ️ {DAILY_LIMIT - soldToday} unidades disponibles a precio promocional hoy
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              <strong>Envío:</strong> Por pagar (a convenir con el comprador)
            </div>

            <div className="bg-primary text-white p-4 rounded-lg">
              <div className="text-sm text-white/80 mb-1">Total a pagar</div>
              <div className="text-3xl font-bold">
                ${pricingInfo?.total.toLocaleString('es-CL') || '0'}
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              Tu número de compra se generará automáticamente al confirmar la reserva
            </div>
          </div>

          <button
            type="submit"
            disabled={!mapLocation}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/80 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {mapLocation ? 'Confirmar Pre-Orden' : 'Confirma tu ubicación en el mapa'}
          </button>
        </div>
      </div>
    </form>
  )
}
