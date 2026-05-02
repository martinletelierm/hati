'use client'

import type { WizardData } from '../PreSaleWizard'

const PRICE_PER_UNIT = 27990

export default function StepConfirmation({ data }: { data: WizardData }) {
  const total = data.cantidad * PRICE_PER_UNIT

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-br from-forest via-forest-mid to-forest-light text-white p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white text-forest rounded-full mb-4 shadow-lg">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          ¡Reserva confirmada!
        </h2>
        <p className="text-white/80">Tu pedido quedó registrado correctamente</p>
      </div>

      <div className="p-6 md:p-8 space-y-5">
        <div className="bg-cream rounded-2xl p-5 space-y-3">
          <Info label="N° Comprobante" value={data.numeroPedido} />
          <Info label="Nombre"         value={data.nombre} />
          <Info label="Email"          value={data.email} />
          <Info label="Teléfono"       value={data.telefono} />
          <Info label="Cantidad"       value={`${data.cantidad} juego${data.cantidad > 1 ? 's' : ''}`} />
          <Info label="Total pagado"   value={`$${total.toLocaleString('es-CL')}`} bold />
          <Info label="Envío a"        value={`${data.direccion}, ${data.comuna}, ${data.ciudad}`} />
        </div>

        <div className="bg-orange/10 border-l-4 border-orange rounded-r-2xl p-4">
          <p className="text-forest text-sm">
            <strong>📱 Próximo paso:</strong> Te contactaremos por WhatsApp al{' '}
            <strong>{data.telefono}</strong> dentro de las próximas 24 horas para
            confirmar el pago y coordinar el envío.
          </p>
        </div>

        <p className="text-center text-gray-500 text-sm">
          Si tienes dudas, escríbenos a <strong className="text-forest">clara.valenzuela@uc.cl</strong>
        </p>

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-3xl mb-1">🐘</p>
          <p className="text-forest font-bold text-xl" style={{ fontFamily: 'Georgia, serif' }}>
            ¡Gracias por unirte a la selva!
          </p>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-right ${bold ? 'font-bold text-forest text-lg' : 'font-semibold text-forest'}`}>{value}</span>
    </div>
  )
}
