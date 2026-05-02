'use client'

import { useState } from 'react'
import type { WizardData } from '../PreSaleWizard'

const PRICE = 27990

const BANK = {
  nombre:       'Clara Valenzuela',
  rut:          '20.428.300-1',
  banco:        'Banco Santander',
  tipoCuenta:   'Cuenta Corriente',
  numeroCuenta: '000082103694',
  email:        'clara.valenzuela@uc.cl',
}

function copy(text: string) {
  try { navigator.clipboard.writeText(text) } catch {
    const t = document.createElement('textarea')
    t.value = text; document.body.appendChild(t); t.select()
    document.execCommand('copy'); document.body.removeChild(t)
  }
}

export default function StepTransfer({
  data, update, onNext, onBack,
}: { data: WizardData; update: (p: Partial<WizardData>) => void; onNext: () => void; onBack: () => void }) {
  const total = data.cantidad * PRICE
  const allData = Object.values(BANK).join('\n')

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Paso 1</p>
        <h2 className="text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          Transfiere el monto
        </h2>
        <p className="text-gray-400 mt-1 text-sm">Usa tu app de banco con los datos de abajo</p>
      </div>

      {/* Quantity */}
      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">¿Cuántos juegos?</p>
        <div className="inline-flex items-center gap-5 bg-white border border-gray-200 rounded-2xl px-5 py-3">
          <button
            onClick={() => update({ cantidad: Math.max(1, data.cantidad - 1) })}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-forest hover:text-white text-forest font-bold text-lg transition-colors flex items-center justify-center"
          >−</button>
          <span className="text-2xl font-bold w-6 text-center tabular-nums">{data.cantidad}</span>
          <button
            onClick={() => update({ cantidad: data.cantidad + 1 })}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-forest hover:text-white text-forest font-bold text-lg transition-colors flex items-center justify-center"
          >+</button>
          <span className="text-sm text-gray-400 border-l border-gray-200 pl-5">
            ${PRICE.toLocaleString('es-CL')} c/u
          </span>
        </div>
      </div>

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
        <div className="divide-y divide-gray-50">
          <BankRow label="Nombre"   value={BANK.nombre} />
          <BankRow label="RUT"      value={BANK.rut} />
          <BankRow label="Banco"    value={BANK.banco} />
          <BankRow label="Tipo"     value={BANK.tipoCuenta} />
          <BankRow label="Cuenta"   value={BANK.numeroCuenta} mono />
          <BankRow label="Email"    value={BANK.email} />
        </div>
      </div>

      <div className="bg-amber-50 rounded-xl px-4 py-3 text-sm text-amber-800">
        Escribe <strong>HATI</strong> en el comentario y guarda el número de operación.
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-4 rounded-2xl border border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-50 transition-colors"
        >←</button>
        <button
          onClick={onNext}
          className="flex-1 bg-forest text-white font-semibold py-4 rounded-2xl text-base hover:bg-forest-mid transition-colors"
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
      onClick={() => { copy(String(total)); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="w-full bg-forest text-white rounded-2xl p-6 text-left hover:bg-forest-mid transition-colors"
    >
      <p className="text-white/50 text-xs uppercase tracking-widest mb-2">
        Total a transferir {cantidad > 1 && `· ${cantidad} juegos`}
      </p>
      <div className="flex items-end justify-between">
        <span className="text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
          ${total.toLocaleString('es-CL')}
        </span>
        <span className="text-white/50 text-sm mb-1">
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
      onClick={() => { copy(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
        copied ? 'bg-forest text-white' : 'bg-gray-100 text-gray-600 hover:bg-forest hover:text-white'
      }`}
    >
      {copied ? '✓ Copiado' : 'Copiar todo'}
    </button>
  )
}

function BankRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-sm text-gray-400 w-20 flex-shrink-0">{label}</span>
      <span className={`text-sm font-medium text-forest text-right ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  )
}
