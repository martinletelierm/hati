'use client'

import { useState } from 'react'
import type { WizardData } from '../PreSaleWizard'

const PRICE = 27990

const TIPO_LABEL: Record<string, string> = {
  transferencia: 'Transferencia bancaria',
  maquina: 'Pago con máquina',
}

export default function StepConfirmation({ data }: { data: WizardData }) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState('')

  const total = data.cantidad * PRICE
  const direccionCompleta = [data.direccion, data.departamento, data.comuna, data.region]
    .filter(Boolean).join(', ')

  const refComprobante = data.numeroPedido.trim() || data.numeroBoleta.trim() || '—'
  const tipoLabel =
    (data.tipoPago && TIPO_LABEL[data.tipoPago]) || data.tipoPago || '—'

  const downloadPdf = async () => {
    setPdfError('')
    setPdfLoading(true)
    try {
      const res = await fetch('/api/comprobante-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoPago: data.tipoPago,
          numeroPedido: data.numeroPedido,
          numeroBoleta: data.numeroBoleta,
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
          rut: data.rut,
          direccion: data.direccion,
          departamento: data.departamento,
          comuna: data.comuna,
          ciudad: data.ciudad,
          region: data.region,
          cantidad: data.cantidad,
          comprobanteUrl: data.comprobanteUrl || null,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as { error?: string }))
        throw new Error(err.error || 'No se pudo generar el PDF')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safe = refComprobante.replace(/[^\w.-]+/g, '_').slice(0, 80)
      a.download = `hati-comprobante-${safe}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'No se pudo descargar el comprobante'
      setPdfError(message)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="text-center space-y-6 sm:space-y-8 step-enter">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          Gracias por tu compra
        </h2>
        <p className="text-gray-600 mt-3 text-base leading-relaxed">
          Tu pedido ya está registrado. Te avisaremos por WhatsApp cuando tu juego salga en camino hacia ti.
        </p>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
          Si antes necesitamos confirmar algún dato del envío, también te escribimos al mismo número.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 text-left">
        <Row label="Comprobante" value={refComprobante} mono />
        <Row label="Nombre"      value={data.nombre} />
        <Row label="Cantidad"    value={`${data.cantidad} juego${data.cantidad > 1 ? 's' : ''}`} />
        <Row label="Tipo de pago" value={tipoLabel} />
        <Row label="Total"       value={`$${total.toLocaleString('es-CL')}`} bold />
        <Row label="Envío a"     value={direccionCompleta} />
      </div>

      <div className="max-w-md mx-auto w-full space-y-3">
        <button
          type="button"
          onClick={downloadPdf}
          disabled={pdfLoading}
          className="w-full min-h-14 flex items-center justify-center gap-2 bg-white text-forest font-semibold py-4 px-5 rounded-2xl text-base border-2 border-forest hover:bg-forest/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span aria-hidden>↓</span>
          {pdfLoading ? 'Generando tu PDF…' : 'Descargar comprobante en PDF'}
        </button>
        <p className="text-xs text-gray-400 leading-relaxed px-1">
          {data.comprobanteUrl
            ? 'El PDF incluye el resumen del pedido y una copia del comprobante que adjuntaste.'
            : 'El PDF incluye el resumen de tu compra: referencia, total y datos de envío.'}
        </p>
        {pdfError && (
          <p className="text-red-500 text-sm text-center" role="alert">
            {pdfError}
          </p>
        )}
      </div>

      <div className="bg-amber-50 rounded-xl px-5 py-4 text-sm text-amber-900 text-left leading-relaxed border border-amber-100">
        <span className="font-semibold text-amber-950">WhatsApp:</span>{' '}
        te escribiremos a <strong>{data.telefono}</strong> cuando despachemos tu juego.
        No necesitas hacer nada más por ahora.
      </div>

      <p className="text-sm text-gray-400">
        hati · <span className="text-forest font-medium">ventas@editorialsjs.com</span>
      </p>
    </div>
  )
}

function Row({ label, value, mono, bold }: { label: string; value: string; mono?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-start justify-between px-4 sm:px-5 py-4 gap-4">
      <span className="text-sm text-gray-400 shrink-0">{label}</span>
      <span className={`text-sm text-right break-words min-w-0 max-w-[65%] ${mono ? 'font-mono' : ''} ${bold ? 'font-bold text-forest' : 'text-gray-700'}`}>
        {value}
      </span>
    </div>
  )
}
