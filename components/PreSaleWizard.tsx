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
}

export default function PreSaleWizard() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardData>({
    cantidad: 1, numeroPedido: '',
    nombre: '', email: '', telefono: '', rut: '',
    direccion: '', ciudad: '', comuna: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const update = (p: Partial<WizardData>) => setData(d => ({ ...d, ...p }))
  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

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

  const TOTAL_STEPS = 3

  return (
    <div>
      {/* Minimal progress */}
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="flex-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-400 tabular-nums flex-shrink-0">
          {step + 1} / {TOTAL_STEPS}
        </span>
      </div>

      <div key={step} className="step-enter">
        {step === 0 && <StepTransfer data={data} update={update} onNext={next} />}
        {step === 1 && <StepOrderNumber data={data} update={update} onNext={next} onBack={back} />}
        {step === 2 && <StepShipping data={data} update={update} onSubmit={onComplete} onBack={back} />}
      </div>
    </div>
  )
}
