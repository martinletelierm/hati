'use client'

import type { WizardData } from '../PreSaleWizard'

const PRICE = 27990

export default function StepCantidad({
  data, update, onNext,
}: {
  data: WizardData
  update: (p: Partial<WizardData>) => void
  onNext: () => void
}) {
  const total = data.cantidad * PRICE

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
            ${PRICE.toLocaleString('es-CL')} c/u
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Total estimado</p>
        <p className="text-2xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          ${total.toLocaleString('es-CL')}
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full min-h-14 bg-forest text-white font-semibold py-4 rounded-2xl text-base hover:bg-forest-mid transition-colors"
      >
        Continuar →
      </button>
    </div>
  )
}
