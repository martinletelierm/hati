'use client'

import type { WizardData } from '../PreSaleWizard'
import { useState } from 'react'

export default function StepOrderNumber({
  data,
  update,
  onNext,
  onBack,
}: {
  data: WizardData
  update: (partial: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!data.numeroPedido.trim()) {
      setError('Ingresa tu número de comprobante para continuar')
      return
    }
    if (data.numeroPedido.trim().length < 4) {
      setError('El número parece muy corto, revísalo')
      return
    }
    setError('')
    onNext()
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-magenta/10 text-magenta rounded-2xl mb-3 text-2xl">
          🧾
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          Número de comprobante
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Es el número que aparece en el comprobante de tu transferencia
        </p>
      </div>

      <div className="bg-cream rounded-2xl p-5 text-sm text-forest space-y-2">
        <p className="font-semibold">¿Dónde encontrar este número?</p>
        <ul className="space-y-1.5 text-gray-600 text-sm">
          <li className="flex gap-2"><span className="text-orange">→</span>En la app de tu banco, después de transferir</li>
          <li className="flex gap-2"><span className="text-orange">→</span>En el correo de confirmación de tu banco</li>
          <li className="flex gap-2"><span className="text-orange">→</span>Suele llamarse "N° de operación" o "comprobante"</li>
        </ul>
      </div>

      <div>
        <label className="block text-sm font-semibold text-forest mb-2">
          Número de comprobante / operación <span className="text-orange">*</span>
        </label>
        <input
          autoFocus
          value={data.numeroPedido}
          onChange={(e) => {
            update({ numeroPedido: e.target.value })
            if (error) setError('')
          }}
          placeholder="Ej: 12345678"
          className={`w-full px-5 py-4 text-lg border-2 rounded-2xl focus:outline-none transition-colors ${
            error
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200 focus:border-forest bg-white'
          }`}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          className="sm:flex-shrink-0 px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
        >
          ← Volver
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-orange hover:bg-orange/90 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg shadow-orange/30"
        >
          Continuar al envío
        </button>
      </div>
    </div>
  )
}
