'use client'

import { useState } from 'react'

const BANK_INFO = {
  banco: 'Banco Estado',
  tipoCuenta: 'Cuenta Vista',
  numeroCuenta: '12345678',
  rut: '12.345.678-9',
  nombre: 'HATI SpA',
  email: 'pagos@hati.cl',
  monto: '27990',
}

export default function StepTransfer({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-orange/10 text-orange rounded-2xl mb-3 text-2xl">
          💸
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          Realiza la transferencia
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Toca cualquier dato para copiarlo
        </p>
      </div>

      {/* Total destacado */}
      <div className="bg-gradient-to-br from-forest to-forest-mid text-white rounded-2xl p-6 text-center">
        <div className="text-sm uppercase tracking-widest text-white/60 mb-1">Total a transferir</div>
        <CopyValue
          value={BANK_INFO.monto}
          display={`$${Number(BANK_INFO.monto).toLocaleString('es-CL')}`}
          variant="hero"
        />
      </div>

      {/* Datos de la cuenta */}
      <div className="bg-cream rounded-2xl p-4 space-y-2">
        <CopyRow label="Banco" value={BANK_INFO.banco} />
        <CopyRow label="Tipo de cuenta" value={BANK_INFO.tipoCuenta} />
        <CopyRow label="N° de cuenta" value={BANK_INFO.numeroCuenta} highlight />
        <CopyRow label="RUT" value={BANK_INFO.rut} />
        <CopyRow label="Nombre" value={BANK_INFO.nombre} />
        <CopyRow label="Email" value={BANK_INFO.email} />
      </div>

      {/* Aviso importante */}
      <div className="bg-gold/10 border-l-4 border-gold rounded-r-2xl p-4">
        <p className="text-sm text-forest">
          <strong>Importante:</strong> al hacer la transferencia, en el comentario o
          detalle escribe <strong>"HATI"</strong> y guarda el comprobante o número de
          operación — lo necesitarás en el siguiente paso.
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

function CopyRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <CopyValue value={value} display={value} highlight={highlight} />
    </div>
  )
}

function CopyValue({
  value,
  display,
  highlight,
  variant,
}: {
  value: string
  display: string
  highlight?: boolean
  variant?: 'hero'
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (variant === 'hero') {
    return (
      <button onClick={copy} className="group block w-full mt-1">
        <div className="text-5xl md:text-6xl font-bold animate-copied" style={{ fontFamily: 'Georgia, serif' }}>
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
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors min-w-0 ${
        copied
          ? 'bg-forest text-white'
          : highlight
          ? 'bg-white text-forest font-bold shadow-sm hover:bg-forest hover:text-white'
          : 'text-forest hover:bg-white'
      }`}
    >
      <span className="font-mono text-sm md:text-base truncate">{display}</span>
      <span className="text-xs flex-shrink-0">
        {copied ? '✓' : '📋'}
      </span>
    </button>
  )
}
