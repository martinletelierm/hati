'use client'

import { useState } from 'react'
import type { WizardData } from '../PreSaleWizard'

const PRICE_PER_UNIT = 27990

const BANK_INFO = {
  nombre:       'Clara Valenzuela',
  rut:          '20.428.300-1',
  banco:        'Banco Santander',
  tipoCuenta:   'Cuenta Corriente',
  numeroCuenta: '000082103694',
  email:        'clara.valenzuela@uc.cl',
}

function copyText(text: string) {
  try {
    navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

export default function StepTransfer({
  data,
  update,
  onNext,
}: {
  data: WizardData
  update: (partial: Partial<WizardData>) => void
  onNext: () => void
}) {
  const total = data.cantidad * PRICE_PER_UNIT

  const allDataText = [
    BANK_INFO.nombre,
    BANK_INFO.rut,
    BANK_INFO.banco,
    BANK_INFO.tipoCuenta,
    BANK_INFO.numeroCuenta,
    BANK_INFO.email,
  ].join('\n')

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-orange/10 text-orange rounded-2xl mb-3 text-2xl">
          💸
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          Realiza la transferencia
        </h2>
        <p className="text-gray-500 mt-2 text-sm">Toca cualquier dato para copiarlo</p>
      </div>

      {/* Cantidad */}
      <div className="bg-cream rounded-2xl p-5">
        <label className="block text-sm font-semibold text-forest mb-3">
          ¿Cuántos juegos quieres?
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => update({ cantidad: Math.max(1, data.cantidad - 1) })}
            className="w-11 h-11 rounded-xl border-2 border-gray-200 text-xl font-bold text-forest hover:border-forest hover:bg-forest hover:text-white transition-colors flex items-center justify-center"
          >
            −
          </button>
          <span className="text-3xl font-bold text-forest w-10 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            {data.cantidad}
          </span>
          <button
            onClick={() => update({ cantidad: data.cantidad + 1 })}
            className="w-11 h-11 rounded-xl border-2 border-gray-200 text-xl font-bold text-forest hover:border-forest hover:bg-forest hover:text-white transition-colors flex items-center justify-center"
          >
            +
          </button>
          <span className="text-sm text-gray-500 ml-1">
            × ${PRICE_PER_UNIT.toLocaleString('es-CL')} c/u
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-br from-forest to-forest-mid text-white rounded-2xl p-6 text-center">
        <div className="text-sm uppercase tracking-widest text-white/60 mb-1">Total a transferir</div>
        <CopyValue
          value={String(total)}
          display={`$${total.toLocaleString('es-CL')}`}
          variant="hero"
        />
        {data.cantidad > 1 && (
          <p className="text-white/50 text-xs mt-2">{data.cantidad} juegos × ${PRICE_PER_UNIT.toLocaleString('es-CL')}</p>
        )}
      </div>

      {/* Datos bancarios */}
      <div className="bg-cream rounded-2xl p-4 space-y-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-forest">Datos de transferencia</span>
          <CopyAllButton text={allDataText} />
        </div>
        <CopyRow label="Nombre"     value={BANK_INFO.nombre} />
        <CopyRow label="RUT"        value={BANK_INFO.rut} />
        <CopyRow label="Banco"      value={BANK_INFO.banco} />
        <CopyRow label="Tipo"       value={BANK_INFO.tipoCuenta} />
        <CopyRow label="N° cuenta"  value={BANK_INFO.numeroCuenta} highlight />
        <CopyRow label="Email"      value={BANK_INFO.email} />
      </div>

      {/* Aviso */}
      <div className="bg-gold/10 border-l-4 border-gold rounded-r-2xl p-4">
        <p className="text-sm text-forest">
          <strong>Importante:</strong> en el comentario de la transferencia escribe{' '}
          <strong>"HATI"</strong> y guarda el número de operación — lo necesitarás en el siguiente paso.
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-orange hover:bg-orange/90 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg shadow-orange/30"
      >
        Ya transferí — Siguiente paso
      </button>

      <p className="text-center text-xs text-gray-400">
        ¿Aún no transfieres? Puedes hacerlo desde tu app de banco y volver acá.
      </p>
    </div>
  )
}

function CopyAllButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    copyText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
        copied ? 'bg-forest text-white' : 'bg-white text-forest hover:bg-forest hover:text-white border border-gray-200'
      }`}
    >
      {copied ? '✓ ¡Copiado!' : '📋 Copiar todo'}
    </button>
  )
}

function CopyRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-400 flex-shrink-0 w-24">{label}</span>
      <CopyValue value={value} display={value} highlight={highlight} />
    </div>
  )
}

function CopyValue({
  value, display, highlight, variant,
}: {
  value: string; display: string; highlight?: boolean; variant?: 'hero'
}) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    copyText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (variant === 'hero') {
    return (
      <button onClick={copy} className="block w-full mt-1">
        <div className="text-5xl md:text-6xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
          {display}
        </div>
        <div className="text-xs text-white/60 mt-2 flex items-center justify-center gap-1.5">
          {copied ? '✓ ¡Copiado!' : '📋 Toca para copiar'}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={copy}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors min-w-0 flex-1 justify-end ${
        copied
          ? 'bg-forest text-white'
          : highlight
          ? 'bg-white text-forest font-bold shadow-sm hover:bg-forest hover:text-white'
          : 'text-forest hover:bg-white'
      }`}
    >
      <span className="font-mono text-sm md:text-base truncate">{display}</span>
      <span className="text-xs flex-shrink-0">{copied ? '✓' : '📋'}</span>
    </button>
  )
}
