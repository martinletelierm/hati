import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const PRICE_PER_UNIT = 27990

export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  console.log('[presale] body recibido:', JSON.stringify(body))

  const {
    tipoPago, cantidad = 1,
    numeroPedido, comprobanteUrl, numeroBoleta,
    nombre, email, telefono, rut,
    direccion, departamento, comuna, ciudad, region,
  } = body

  const missing: string[] = []
  if (!tipoPago)   missing.push('tipoPago')
  if (!nombre)     missing.push('nombre')
  if (!email)      missing.push('email')
  if (!telefono)   missing.push('telefono')
  if (!rut)        missing.push('rut')
  if (!direccion)  missing.push('direccion')
  if (!comuna)     missing.push('comuna')
  if (!region)     missing.push('region')

  if (missing.length) {
    return NextResponse.json({ error: `Faltan campos: ${missing.join(', ')}` }, { status: 400 })
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
