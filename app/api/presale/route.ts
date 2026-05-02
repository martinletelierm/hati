import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const PRICE_PER_UNIT = 27990

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    tipoPago, cantidad = 1,
    numeroPedido, comprobanteUrl, numeroBoleta,
    nombre, email, telefono, rut,
    direccion, departamento, comuna, ciudad, region,
  } = body

  if (!nombre || !email || !rut || !direccion || !tipoPago) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const { error } = await getSupabase().from('preorders').insert({
    tipo_pago: tipoPago,
    numero_pedido: numeroPedido || numeroBoleta || `${tipoPago}-${Date.now()}`,
    comprobante_url: comprobanteUrl || null,
    numero_boleta: numeroBoleta || null,
    nombre, email, telefono, rut,
    direccion,
    departamento: departamento || null,
    comuna, ciudad: ciudad || null, region,
    cantidad: Number(cantidad),
    precio_total: Number(cantidad) * PRICE_PER_UNIT,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
