'use client'

import { useState } from 'react'
import type { WizardData } from '../PreSaleWizard'
import MapComponent from '../MapComponent'

export default function StepShipping({
  data,
  update,
  onSubmit,
  onBack,
}: {
  data: WizardData
  update: (partial: Partial<WizardData>) => void
  onSubmit: () => Promise<void>
  onBack: () => void
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (data.nombre.trim().length < 2) e.nombre = 'Requerido'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) e.email = 'Email inválido'
    if (data.telefono.trim().length < 8) e.telefono = 'Teléfono inválido'
    if (data.rut.trim().length < 5) e.rut = 'RUT inválido'
    if (data.direccion.trim().length < 5) e.direccion = 'Dirección incompleta'
    if (data.ciudad.trim().length < 2) e.ciudad = 'Requerido'
    if (data.comuna.trim().length < 2) e.comuna = 'Requerido'
    if (!data.ubicacion) e.ubicacion = 'Confirma tu ubicación en el mapa'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await onSubmit()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-purple/10 text-purple rounded-2xl mb-3 text-2xl">
          📦
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          Datos de envío
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Te contactaremos por WhatsApp para coordinar el despacho
        </p>
      </div>

      <Input
        label="Nombre completo"
        value={data.nombre}
        onChange={(v) => update({ nombre: v })}
        placeholder="Ej: María González"
        error={errors.nombre}
        required
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={data.email}
          onChange={(v) => update({ email: v })}
          placeholder="tu@email.com"
          error={errors.email}
          required
        />
        <Input
          label="Teléfono"
          type="tel"
          value={data.telefono}
          onChange={(v) => update({ telefono: v })}
          placeholder="+56 9 1234 5678"
          error={errors.telefono}
          required
        />
      </div>

      <Input
        label="RUT"
        value={data.rut}
        onChange={(v) => update({ rut: v })}
        placeholder="12.345.678-9"
        error={errors.rut}
        required
      />

      <Input
        label="Dirección"
        value={data.direccion}
        onChange={(v) => update({ direccion: v })}
        placeholder="Calle, número, depto"
        error={errors.direccion}
        required
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Ciudad"
          value={data.ciudad}
          onChange={(v) => update({ ciudad: v })}
          placeholder="Santiago"
          error={errors.ciudad}
          required
        />
        <Input
          label="Comuna"
          value={data.comuna}
          onChange={(v) => update({ comuna: v })}
          placeholder="Providencia"
          error={errors.comuna}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-forest mb-2">
          Confirma tu ubicación en el mapa <span className="text-orange">*</span>
        </label>
        <MapComponent onLocationSelect={(loc) => update({ ubicacion: loc })} />
        {errors.ubicacion && (
          <p className="text-red-500 text-sm mt-1.5">⚠️ {errors.ubicacion}</p>
        )}
      </div>

      <div className="bg-gold/10 border-l-4 border-gold rounded-r-2xl p-4 text-sm text-forest">
        <strong>Envío:</strong> El costo del despacho es <strong>por pagar</strong> al
        recibir el producto. Te contactaremos por WhatsApp para coordinar.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="sm:flex-shrink-0 px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
        >
          ← Volver
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-forest hover:bg-forest-mid text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg shadow-forest/30 disabled:opacity-50"
        >
          {loading ? 'Enviando…' : 'Confirmar pre-venta ✓'}
        </button>
      </div>
    </form>
  )
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-forest mb-1.5">
        {label} {required && <span className="text-orange">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
          error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-200 focus:border-forest bg-white'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">⚠️ {error}</p>}
    </div>
  )
}
