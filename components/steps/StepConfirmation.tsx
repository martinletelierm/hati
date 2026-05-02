import type { WizardData } from '../PreSaleWizard'

const PRICE = 27990

export default function StepConfirmation({ data }: { data: WizardData }) {
  const total = data.cantidad * PRICE
  const direccionCompleta = [data.direccion, data.departamento, data.comuna, data.region]
    .filter(Boolean).join(', ')

  return (
    <div className="text-center space-y-8 step-enter">
      <div>
        <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>¡Listo!</h2>
        <p className="text-gray-400 mt-2">Tu reserva quedó registrada</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 text-left">
        <Row label="Comprobante" value={data.numeroPedido} mono />
        <Row label="Nombre"      value={data.nombre} />
        <Row label="Cantidad"    value={`${data.cantidad} juego${data.cantidad > 1 ? 's' : ''}`} />
        <Row label="Total"       value={`$${total.toLocaleString('es-CL')}`} bold />
        <Row label="Envío a"     value={direccionCompleta} />
      </div>

      <div className="bg-amber-50 rounded-xl px-5 py-4 text-sm text-amber-800 text-left">
        Te contactamos al <strong>{data.telefono}</strong> por WhatsApp en las próximas
        24 h para confirmar y coordinar el envío.
      </div>

      <p className="text-sm text-gray-400">
        hati · <span className="text-forest font-medium">clara.valenzuela@uc.cl</span>
      </p>
    </div>
  )
}

function Row({ label, value, mono, bold }: { label: string; value: string; mono?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-start justify-between px-5 py-4 gap-4">
      <span className="text-sm text-gray-400 flex-shrink-0">{label}</span>
      <span className={`text-sm text-right break-words max-w-[65%] ${mono ? 'font-mono' : ''} ${bold ? 'font-bold text-forest' : 'text-gray-700'}`}>
        {value}
      </span>
    </div>
  )
}
