'use client'

import { useState, useMemo } from 'react'
import type { WizardData } from '../PreSaleWizard'
import { REGIONES } from '@/lib/chile'

export default function StepShipping({
  data, update, onSubmit, onBack,
}: {
  data: WizardData
  update: (p: Partial<WizardData>) => void
  onSubmit: () => Promise<void>
  onBack: () => void
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const comunas = useMemo(
    () => REGIONES.find(r => r.nombre === data.region)?.comunas ?? [],
    [data.region]
  )

  const validate = () => {
    const e: Record<string, string> = {}
    if (data.nombre.trim().length < 2)              e.nombre    = 'Ingresa tu nombre'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Email inválido'
    if (data.telefono.replace(/\D/g, '').length < 8) e.telefono = 'Teléfono inválido'
    if (data.rut.trim().length < 5)                 e.rut       = 'RUT inválido'
    if (data.direccion.trim().length < 5)            e.direccion = 'Ingresa tu dirección'
    if (!data.region)                                e.region    = 'Selecciona una región'
    if (!data.comuna)                                e.comuna    = 'Selecciona una comuna'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Submit error:', err)
      alert(`Error al enviar: ${msg}`)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Paso 3</p>
        <h2 className="text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          Datos de envío
        </h2>
        <p className="text-gray-400 mt-1 text-sm">Te contactamos por WhatsApp para coordinar</p>
      </div>

      {/* Datos personales */}
      <div className="space-y-3">
        <Field label="Nombre completo" error={errors.nombre}>
          <input
            autoFocus
            value={data.nombre}
            onChange={e => update({ nombre: e.target.value })}
            placeholder="Tu nombre completo"
            className={cls(errors.nombre)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={data.email}
              onChange={e => update({ email: e.target.value })}
              placeholder="tu@email.com"
              className={cls(errors.email)}
            />
          </Field>
          <Field label="Teléfono" error={errors.telefono}>
            <input
              type="tel"
              value={data.telefono}
              onChange={e => update({ telefono: e.target.value })}
              placeholder="+56 9 ..."
              className={cls(errors.telefono)}
            />
          </Field>
        </div>

        <Field label="RUT" error={errors.rut}>
          <input
            value={data.rut}
            onChange={e => update({ rut: e.target.value })}
            placeholder="12.345.678-9"
            className={cls(errors.rut)}
          />
        </Field>
      </div>

      {/* Dirección */}
      <div className="border-t border-gray-100 pt-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Dirección de envío</p>

        <Field label="Región" error={errors.region}>
          <select
            value={data.region}
            onChange={e => update({ region: e.target.value, comuna: '', ciudad: '' })}
            className={cls(errors.region)}
          >
            <option value="">Selecciona tu región</option>
            {REGIONES.map(r => (
              <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
            ))}
          </select>
        </Field>

        <Field label="Comuna" error={errors.comuna}>
          <select
            value={data.comuna}
            onChange={e => update({ comuna: e.target.value })}
            disabled={!data.region}
            className={cls(errors.comuna) + (!data.region ? ' opacity-40 cursor-not-allowed' : '')}
          >
            <option value="">{data.region ? 'Selecciona tu comuna' : 'Primero elige la región'}</option>
            {comunas.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Dirección" error={errors.direccion}>
          <input
            value={data.direccion}
            onChange={e => update({ direccion: e.target.value })}
            placeholder="Calle y número  —  Ej: Av. Providencia 1234"
            className={cls(errors.direccion)}
          />
        </Field>

        <Field label="Depto / Casa / Block" hint="Opcional">
          <input
            value={data.departamento}
            onChange={e => update({ departamento: e.target.value })}
            placeholder="Ej: Depto 301, Casa B, Block 4"
            className={cls()}
          />
        </Field>
      </div>

      <p className="text-xs text-gray-400 text-center">
        El envío se paga al recibir. Lo coordinamos contigo por WhatsApp.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-4 rounded-2xl border border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          ←
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-forest text-white font-semibold py-4 rounded-2xl text-base hover:bg-forest-mid transition-colors disabled:opacity-50"
        >
          {loading ? 'Enviando…' : 'Confirmar reserva'}
        </button>
      </div>
    </form>
  )
}

const cls = (err?: string) =>
  `w-full py-4 px-5 rounded-2xl border-2 outline-none transition-colors text-base bg-white ${
    err ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-forest'
  }`

function Field({
  label, hint, error, children,
}: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-sm font-medium text-gray-500">{label}</label>
        {hint && <span className="text-xs text-gray-300">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
