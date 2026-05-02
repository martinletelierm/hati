'use client'

import { useState } from 'react'
import type { WizardData } from '../PreSaleWizard'

const PRICE = 27990

const BANK = {
  beneficiario: 'Editorial SJS',
  rut:          '76.996.471-1',
  banco:        'Banco Estado',
  tipoCuenta:   'Cuenta Vista / Chequera Electrónica',
  numeroCuenta: '34371448367',
  email:        'ventas@editorialsjs.com',
  asunto:       'HATI',
}

const COPY_BLOCK = [
  BANK.beneficiario,
  BANK.rut,
  BANK.banco,
  BANK.tipoCuenta,
  BANK.numeroCuenta,
  BANK.email,
  BANK.asunto,
].join('\n')

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
          <BankRow label="Beneficiario" value={BANK.beneficiario} />
          <BankRow label="RUT"          value={BANK.rut} />
          <BankRow label="Banco"        value={BANK.banco} />
          <BankRow label="Tipo"        value={BANK.tipoCuenta} />
          <BankRow label="Nº cuenta"   value={BANK.numeroCuenta} mono />
          <BankRow label="Correo"      value={BANK.email} />
          <BankRow label="Asunto"      value={BANK.asunto} />
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

function BankRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 sm:px-5 py-3.5">
      <span className="text-sm text-gray-400 sm:min-w-[7.5rem] shrink-0">{label}</span>
      <span className={`text-sm font-medium text-forest sm:text-right break-all ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  )
}
