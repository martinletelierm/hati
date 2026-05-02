'use client'

import type { WizardData, PaymentType } from '../PreSaleWizard'

const OPTIONS: { type: PaymentType; title: string; desc: string; icon: string }[] = [
  {
    type: 'transferencia',
    title: 'Transferencia bancaria',
    desc: 'Te mostramos los datos y subes el comprobante',
    icon: '🏦',
  },
  {
    type: 'maquina',
    title: 'Pago con máquina',
    desc: 'Pagaste en efectivo o tarjeta presencialmente',
    icon: '💳',
  },
]

export default function StepPaymentType({
  data, update, onNext, onBack,
}: {
  data: WizardData
  update: (p: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const select = (tipo: PaymentType) => {
    update({ tipoPago: tipo })
    onNext()
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Paso 2</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          ¿Cómo pagaste?
        </h2>
        <p className="text-gray-400 mt-1 text-sm">Elige la forma de pago para continuar</p>
      </div>

      <div className="space-y-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.type}
            type="button"
            onClick={() => select(opt.type)}
            className="w-full min-h-24 flex items-center gap-4 sm:gap-5 bg-white border-2 border-gray-100 hover:border-forest hover:bg-forest/5 rounded-2xl p-4 sm:p-5 text-left transition-all group"
          >
            <span className="text-3xl shrink-0">{opt.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-forest text-base">{opt.title}</p>
              <p className="text-sm text-gray-400 mt-0.5">{opt.desc}</p>
            </div>
            <span className="text-gray-300 group-hover:text-forest transition-colors text-xl shrink-0">→</span>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="min-w-14 px-5 py-4 rounded-2xl border border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-50 transition-colors"
          aria-label="Volver"
        >
          ←
        </button>
      </div>
    </div>
  )
}
