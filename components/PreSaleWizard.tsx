'use client'

import { useState } from 'react'
import StepPaymentType from './steps/StepPaymentType'
import StepTransfer from './steps/StepTransfer'
import StepReceipt from './steps/StepReceipt'
import StepMachine from './steps/StepMachine'
import StepShipping from './steps/StepShipping'
import StepConfirmation from './steps/StepConfirmation'

export type PaymentType = 'transferencia' | 'maquina'

export type WizardData = {
  tipoPago: PaymentType | ''
  cantidad: number
  // Transferencia
  comprobanteFile: File | null
  comprobanteUrl: string
  numeroPedido: string
  // Máquina
  numeroBoleta: string
  // Envío
  nombre: string
  email: string
  telefono: string
  rut: string
  direccion: string
  departamento: string
  comuna: string
  ciudad: string
  region: string
}

export default function PreSaleWizard() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardData>({
    tipoPago: '', cantidad: 1,
    comprobanteFile: null, comprobanteUrl: '', numeroPedido: '',
    numeroBoleta: '',
    nombre: '', email: '', telefono: '', rut: '',
    direccion: '', departamento: '', comuna: '', ciudad: '', region: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const update = (p: Partial<WizardData>) => setData(d => ({ ...d, ...p }))
  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

  // Pasos según tipo de pago:
  // Transferencia: 0-tipo | 1-transferencia | 2-comprobante | 3-envío
  // Máquina:       0-tipo | 1-boleta        | 2-envío
  const totalSteps = data.tipoPago === 'maquina' ? 3 : 4

  const onComplete = async () => {
    const res = await fetch('/api/presale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipoPago: data.tipoPago,
        cantidad: data.cantidad,
        numeroPedido: data.numeroPedido || null,
        comprobanteUrl: data.comprobanteUrl || null,
        numeroBoleta: data.numeroBoleta || null,
        nombre: data.nombre, email: data.email,
        telefono: data.telefono, rut: data.rut,
        direccion: data.direccion, departamento: data.departamento,
        comuna: data.comuna, ciudad: data.ciudad, region: data.region,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Error desconocido' }))
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    setSubmitted(true)
  }

  if (submitted) return <StepConfirmation data={data} />

  const progressStep = step // step 0 es elegir tipo, no cuenta como "progreso"

  return (
    <div>
      {step > 0 && (
        <div className="flex items-center gap-3 mb-8 px-1">
          <div className="flex-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-forest rounded-full transition-all duration-500"
              style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-400 tabular-nums flex-shrink-0">
            {step} / {totalSteps - 1}
          </span>
        </div>
      )}

      <div key={step} className="step-enter">
        {step === 0 && (
          <StepPaymentType
            data={data}
            update={update}
            onNext={next}
          />
        )}

        {/* Flujo transferencia */}
        {data.tipoPago === 'transferencia' && step === 1 && (
          <StepTransfer data={data} update={update} onNext={next} onBack={back} />
        )}
        {data.tipoPago === 'transferencia' && step === 2 && (
          <StepReceipt data={data} update={update} onNext={next} onBack={back} />
        )}
        {data.tipoPago === 'transferencia' && step === 3 && (
          <StepShipping data={data} update={update} onSubmit={onComplete} onBack={back} />
        )}

        {/* Flujo máquina */}
        {data.tipoPago === 'maquina' && step === 1 && (
          <StepMachine data={data} update={update} onNext={next} onBack={back} />
        )}
        {data.tipoPago === 'maquina' && step === 2 && (
          <StepShipping data={data} update={update} onSubmit={onComplete} onBack={back} />
        )}
      </div>
    </div>
  )
}
