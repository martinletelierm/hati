'use client'

import { useState } from 'react'
import StepTransfer from './steps/StepTransfer'
import StepOrderNumber from './steps/StepOrderNumber'
import StepShipping from './steps/StepShipping'
import StepConfirmation from './steps/StepConfirmation'

export type WizardData = {
  cantidad: number
  numeroPedido: string
  nombre: string
  email: string
  telefono: string
  rut: string
  direccion: string
  ciudad: string
  comuna: string
  ubicacion: { lat: number; lng: number } | null
}

const STEPS = ['Transferencia', 'Comprobante', 'Envío'] as const

export default function PreSaleWizard() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardData>({
    cantidad: 1,
    numeroPedido: '',
    nombre: '',
    email: '',
    telefono: '',
    rut: '',
    direccion: '',
    ciudad: '',
    comuna: '',
    ubicacion: null,
  })
  const [submitted, setSubmitted] = useState(false)

  const update = (partial: Partial<WizardData>) =>
    setData((d) => ({ ...d, ...partial }))

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const onComplete = async () => {
    const res = await fetch('/api/presale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error')
    setSubmitted(true)
  }

  if (submitted) return <StepConfirmation data={data} />

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Progress bar */}
      <div className="bg-cream-dark p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    i < step
                      ? 'bg-forest text-white'
                      : i === step
                      ? 'bg-orange text-white ring-4 ring-orange/20'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`mt-1 text-xs font-medium hidden sm:block ${i <= step ? 'text-forest' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-forest' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="p-6 md:p-8">
        {step === 0 && <StepTransfer data={data} update={update} onNext={next} />}
        {step === 1 && <StepOrderNumber data={data} update={update} onNext={next} onBack={back} />}
        {step === 2 && <StepShipping data={data} update={update} onSubmit={onComplete} onBack={back} />}
      </div>
    </div>
  )
}
