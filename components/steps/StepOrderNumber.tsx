'use client'

import { useState } from 'react'
import type { WizardData } from '../PreSaleWizard'

export default function StepOrderNumber({
  data, update, onNext, onBack,
}: {
  data: WizardData
  update: (p: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const [error, setError] = useState('')

  const handleNext = () => {
    if (data.numeroPedido.trim().length < 4) {
      setError('Ingresa el número de operación de tu transferencia')
      return
    }
    onNext()
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Paso 2</p>
        <h2 className="text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          N° de operación
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          Aparece en el comprobante de tu transferencia
        </p>
      </div>

      <div>
        <input
          autoFocus
          type="text"
          inputMode="numeric"
          value={data.numeroPedido}
          onChange={e => { update({ numeroPedido: e.target.value }); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleNext()}
          placeholder="Ej: 123456789"
          className={`w-full text-2xl font-mono font-bold py-5 px-5 rounded-2xl border-2 outline-none transition-colors placeholder:text-gray-200 ${
            error
              ? 'border-red-300 bg-red-50 text-red-800'
              : 'border-gray-200 focus:border-forest bg-white text-forest'
          }`}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="bg-gray-50 rounded-xl px-4 py-4 space-y-1.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">¿Dónde está?</p>
        <p className="text-sm text-gray-500">→ En la app de tu banco, tras confirmar el pago</p>
        <p className="text-sm text-gray-500">→ En el email de confirmación de tu banco</p>
        <p className="text-sm text-gray-500">→ También puede llamarse "N° de comprobante"</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-4 rounded-2xl border border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-forest text-white font-semibold py-4 rounded-2xl text-base hover:bg-forest-mid transition-colors"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
