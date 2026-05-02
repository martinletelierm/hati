'use client'

import { useState } from 'react'
import type { WizardData } from '../PreSaleWizard'

export default function StepMachine({
  data, update, onNext, onBack,
}: {
  data: WizardData
  update: (p: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const [error, setError] = useState('')

  const handleNext = () => {
    if (data.numeroBoleta.trim().length < 2) {
      setError('Ingresa el número de boleta o voucher')
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Paso 1</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          N° de boleta o voucher
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          Encuéntralo en el ticket impreso de la máquina
        </p>
      </div>

      <div className="space-y-1.5">
        <input
          autoFocus
          type="text"
          inputMode="numeric"
          value={data.numeroBoleta}
          onChange={e => { update({ numeroBoleta: e.target.value }); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleNext()}
          placeholder="Ej: 00123456"
          className={`w-full text-xl sm:text-2xl font-mono font-bold py-4 sm:py-5 px-4 sm:px-5 rounded-2xl border-2 outline-none transition-colors placeholder:text-gray-200 ${
            error
              ? 'border-red-300 bg-red-50 text-red-800'
              : 'border-gray-200 focus:border-forest bg-white text-forest'
          }`}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="bg-gray-50 rounded-xl px-4 py-4 space-y-1.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">¿Dónde está?</p>
        <p className="text-sm text-gray-500">→ En el ticket impreso de la máquina de pago</p>
        <p className="text-sm text-gray-500">→ También puede llamarse "N° voucher" o "N° boleta"</p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-w-14 px-5 py-4 rounded-2xl border border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-50 transition-colors"
          aria-label="Volver"
        >←</button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 min-h-14 bg-forest text-white font-semibold py-4 rounded-2xl text-base hover:bg-forest-mid transition-colors"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
