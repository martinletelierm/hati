import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { computePreventaSplit } from '@/lib/pricing'
import { getPv1UnitsSoldToday } from '@/lib/pv1-sold-today'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
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
  } = body as Record<string, unknown>

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

  const nCantidad = Math.min(999, Math.max(1, Number(cantidad) || 1))

  const supabase = getSupabase()
  const vendidasHoyPv1 = await getPv1UnitsSoldToday(supabase)
  const split = computePreventaSplit(nCantidad, vendidasHoyPv1)

  const row: Record<string, unknown> = {
    tipo_pago: tipoPago,
    numero_pedido: (typeof numeroPedido === 'string' && numeroPedido) || (typeof numeroBoleta === 'string' && numeroBoleta) || `${tipoPago}-${Date.now()}`,
    comprobante_url: comprobanteUrl ?? null,
    numero_boleta: numeroBoleta ?? null,
    nombre, email, telefono, rut,
    direccion,
    departamento: departamento ?? null,
    comuna, ciudad: ciudad ?? null, region,
    cantidad: nCantidad,
    precio_total: split.precioTotal,
    unidades_preventa_1: split.unidadesPv1,
    unidades_preventa_2: split.unidadesPv2,
  }

  let { error } = await supabase.from('preorders').insert(row)

  if (error?.message?.includes('unidades_preventa')) {
    const { unidades_preventa_1: _u1, unidades_preventa_2: _u2, ...rest } = row
    const retry = await supabase.from('preorders').insert(rest)
    error = retry.error
  }

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    pedido: {
      precioTotal: split.precioTotal,
      unidadesPreventa1: split.unidadesPv1,
      unidadesPreventa2: split.unidadesPv2,
    },
  }, { status: 201 })
}
