'use client'

import { useState } from 'react'
import type { WizardData } from '../PreSaleWizard'
import { PREVENTA_1_CLP, PREVENTA_2_CLP } from '@/lib/pricing'

/** Bloque tal como debe verse / copiarse en la app del banco */
const TRANSFER_LINES = [
  'Editorial SJS',
  'Rut: 76.996.471-1',
  'Cuenta Vista/ Chequera Electrónica Banco Estado',
  'Nº 34371448367',
] as const

const COPY_BLOCK = TRANSFER_LINES.join('\n')

function copy(text: string) {
  try { navigator.clipboard.writeText(text) } catch {
    const t = document.createElement('textarea')
    t.value = text; document.body.appendChild(t); t.select()
    document.execCommand('copy'); document.body.removeChild(t)
  }
}

export default function StepTransfer({
  data, onNext, onBack,
}: { data: WizardData; update: (p: Partial<WizardData>) => void; onNext: () => void; onBack: () => void }) {
  const total =
    data.precioTotal > 0
      ? data.precioTotal
      : data.cantidad * PREVENTA_1_CLP
  const allData = COPY_BLOCK

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Paso 3</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          Transfiere el monto
        </h2>
        <p className="text-gray-400 mt-1 text-sm">Usa tu app de banco con los datos de abajo</p>
      </div>

      {(data.unidadesPreventa1 > 0 || data.unidadesPreventa2 > 0) && (
        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 text-left leading-relaxed">
          {data.unidadesPreventa1 > 0 && (
            <span>
              {data.unidadesPreventa1} juego{data.unidadesPreventa1 !== 1 ? 's' : ''} a Pre Venta 1 (${PREVENTA_1_CLP.toLocaleString('es-CL')})
              {data.unidadesPreventa2 > 0 ? ' · ' : ''}
            </span>
          )}
          {data.unidadesPreventa2 > 0 && (
            <span>
              {data.unidadesPreventa2} juego{data.unidadesPreventa2 !== 1 ? 's' : ''} a Pre Venta 2 (${PREVENTA_2_CLP.toLocaleString('es-CL')})
            </span>
          )}
        </p>
      )}

      {/* Total */}
      <TotalCard total={total} cantidad={data.cantidad} />

      {/* Bank data */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Datos de transferencia
          </span>
          <CopyAllBtn text={allData} />
        </div>
        <div className="px-5 py-5 space-y-2.5">
          {TRANSFER_LINES.map((line, i) => (
            <p
              key={i}
              className={`text-sm font-medium text-forest leading-snug ${
                line.startsWith('Nº ') ? 'font-mono tracking-wide' : ''
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 rounded-xl px-4 py-3 text-sm text-amber-800">
        En el <strong>asunto o mensaje</strong> de la transferencia indica <strong>HATI</strong> y conserva el número de operación.
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
          onClick={onNext}
          className="flex-1 min-h-14 bg-forest text-white font-semibold py-4 rounded-2xl text-base hover:bg-forest-mid transition-colors"
        >
          Ya transferí →
        </button>
      </div>
    </div>
  )
}

function TotalCard({ total, cantidad }: { total: number; cantidad: number }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => { copy(String(total)); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="w-full bg-forest text-white rounded-2xl p-5 sm:p-6 text-left hover:bg-forest-mid transition-colors"
    >
      <p className="text-white/50 text-xs uppercase tracking-widest mb-2">
        Total a transferir {cantidad > 1 && `· ${cantidad} juegos`}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <span className="text-4xl sm:text-5xl font-bold leading-none" style={{ fontFamily: 'Georgia, serif' }}>
          ${total.toLocaleString('es-CL')}
        </span>
        <span className="text-white/50 text-sm sm:mb-1">
          {copied ? '✓ Copiado' : 'Tocar para copiar'}
        </span>
      </div>
    </button>
  )
}

function CopyAllBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => { copy(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
        copied ? 'bg-forest text-white' : 'bg-gray-100 text-gray-600 hover:bg-forest hover:text-white'
      }`}
    >
      {copied ? '✓ Copiado' : 'Copiar todo'}
    </button>
  )
}

